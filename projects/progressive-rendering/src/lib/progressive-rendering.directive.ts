import {
    ChangeDetectorRef,
    Directive,
    DoCheck,
    Input,
    IterableDiffer,
    IterableDiffers,
    TemplateRef,
    TrackByFunction,
    ViewContainerRef,
    ViewRef,
} from '@angular/core';
import { ProgressiveRenderingService } from './progressive-rendering.service';

@Directive({
    selector: '[progressiveRenderingFor]',
})
export class ProgressiveRenderingDirective implements DoCheck {
    @Input('progressiveRenderingFor') items;
    // tslint:disable-next-line:no-input-rename
    @Input('progressiveRenderingForTrackBy') trackBy: TrackByFunction<any>;

    @Input('progressiveRenderingForOf') set tmProgressiveForOf(items: any) {
        this._items = [...items];

        if (items && !this._difference) {
            this._difference = this.differs.find(items)
                .create(this.trackBy ? this.trackBy : this._defaultTrackByFunction);
        }
    }

    private _items: any;
    private _itemsMap: Map<any, ViewRef> = new Map<any, ViewRef>();
    private _difference: IterableDiffer<any>;
    private _defaultTrackByFunction: TrackByFunction<any> = (index: number) => index;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private differs: IterableDiffers,
        private progressiveRenderingService: ProgressiveRenderingService,
        private cdr: ChangeDetectorRef) {
    }

    ngDoCheck(): void {
        if (this._difference) {
            const items = [];
            const whatChanges = this._difference.diff(this._items);
            const trackBy = this.trackBy ? this.trackBy : this._defaultTrackByFunction;

            if (whatChanges) {
                whatChanges.forEachRemovedItem((item: any) => {
                    const currView = this._itemsMap.get(trackBy(item.currentIndex, item.item));
                    const viewIndex = this.viewContainer.indexOf(currView);
                    this.viewContainer.remove(viewIndex);
                    this._itemsMap.delete(trackBy(item.currentIndex, item.item));
                });

                whatChanges.forEachAddedItem((item: any) => {
                    items.push(item);
                });

                whatChanges.forEachIdentityChange((item: any) => {
                    const currView: any = this._itemsMap.get(trackBy(item.currentIndex, item.item));
                    currView.context.$implicit = item.item;
                    currView.context.index = item.currentIndex;
                });
                if (items.length) {
                    this.progressiveRenderingService.scheduleRendering(
                        items,
                        this.viewContainer,
                        this.templateRef,
                        this._itemsMap,
                        trackBy,
                        this.cdr,
                    );
                }
            }
        }
    }
}
