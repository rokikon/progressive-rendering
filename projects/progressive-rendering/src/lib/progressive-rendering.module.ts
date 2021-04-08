import { NgModule } from '@angular/core';
import { ProgressiveRenderingDirective } from './progressive-rendering.directive';
import { ProgressiveRenderingService } from './progressive-rendering.service';


@NgModule({
    declarations: [
        ProgressiveRenderingDirective
    ],
    exports: [
        ProgressiveRenderingDirective
    ],
    providers: [
        ProgressiveRenderingService
    ]
})
export class ProgressiveRenderingModule {
}
