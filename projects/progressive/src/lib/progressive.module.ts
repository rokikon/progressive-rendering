import { NgModule } from '@angular/core';
import { ProgressiveDirective } from './progressive.directive';
import { ProgressiveService } from './progressive.service';


@NgModule({
    declarations: [
        ProgressiveDirective
    ],
    exports: [
        ProgressiveDirective
    ],
    providers: [
        ProgressiveService
    ]
})
export class ProgressiveModule {
}
