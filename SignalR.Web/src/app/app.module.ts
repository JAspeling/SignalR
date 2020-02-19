import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components/components.module';
import { AppInjector } from './services/app-injector';
import { SignalRModule } from './signalR.module';
import { NameService } from './services/name-service';

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
        NameService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { 
    constructor(injector: Injector) {
        // Store module's injector in the AppInjector class
        AppInjector.setInjector(injector);
    }
}
