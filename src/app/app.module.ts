import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ProgressiveModule} from '../../projects/progressive/src/lib/progressive.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        ProgressiveModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
