import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SignalRModule } from './signalR.module';
import { ComponentsModule } from './components/components/components.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ComponentsModule,
        SignalRModule.forRoot()
    ],
    providers: [
        
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
