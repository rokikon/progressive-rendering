import {ChangeDetectorRef, Injectable, NgZone, TemplateRef, TrackByFunction, ViewContainerRef, ViewRef} from '@angular/core';
import {animationFrameScheduler} from 'rxjs';
import {first} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProgressiveRenderingService {
    currentRenderingIndex = 0;
    renderingQueueLength = 0;

    constructor(private zone: NgZone) {
    }

    scheduleRendering(items: any[],
                      viewContainer: ViewContainerRef,
                      templateRef: TemplateRef<any>,
                      map: Map<any, ViewRef>,
                      trackBy: TrackByFunction<any>,
                      cdr?: ChangeDetectorRef): void {
        const updateRenderingQueue = this.updateRenderingQueue.bind(this);
        const zone = this.zone;
        this.renderingQueueLength += items.length;

        animationFrameScheduler.schedule(function(index): void {
            if (typeof index === 'number' && items[index]) {
                const embeddedView: ViewRef = viewContainer
                    .createEmbeddedView(templateRef, {$implicit: items[index].item, index});
                map.set(trackBy(index, items[index].item), embeddedView);
                if (index < items.length) {
                    zone.onMicrotaskEmpty
                        .pipe(first())
                        .subscribe(() => {
                            updateRenderingQueue();
                            this.schedule(index + 1);
                        });
                    if (cdr) {
                        cdr.markForCheck();
                    }
                } else {
                    this.unsubscribe();
                }
            }
        }, 0, 0);
    }

    updateRenderingQueue(): void {
        this.currentRenderingIndex++;
        if (this.renderingQueueLength === this.currentRenderingIndex) {
            this.renderingQueueLength = 0;
            this.currentRenderingIndex = 0;
        }
    }
}
