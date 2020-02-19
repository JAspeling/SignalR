import { ModuleWithProviders, NgModule } from '@angular/core';
import { SignalRConfiguration, SignalRModule as Ng2SignalRModule } from 'ng2-signalr';

import { LoggingService } from './services/feedback-service';
import { SignalRConnectionManager } from './services/signalr-connection-manager-service';
import { SignalRService } from './services/signalr-service';

export function createConfig(): SignalRConfiguration {
    const config = new SignalRConfiguration();
    config.logging = true;
    return config;
}

@NgModule({
    imports: [
        Ng2SignalRModule.forRoot(createConfig)
    ],
    exports: [
        Ng2SignalRModule
    ]
})
export class SignalRModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SignalRModule,
            providers: [
                SignalRService,
                LoggingService,
                SignalRConnectionManager
            ]
        };
    }
}
