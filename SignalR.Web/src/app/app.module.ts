import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SignalRModule } from './signalR.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        SignalRModule.forRoot()
    ],
    providers: [
        
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
