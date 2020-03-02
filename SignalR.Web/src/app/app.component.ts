import { Component, OnDestroy, OnInit } from '@angular/core';

import { INotificationHub } from './interfaces/notification-hub.interface';
import { HubMessage } from './models/notification-hub-message';
import { LoggingService } from './services/feedback-service';
import { SignalRConnectionManager } from './services/signalr-connection-manager-service';
import { SignalRService } from './services/signalr-service';
import { NameService } from './services/name-service';
import { Subscription } from 'rxjs';
import { HubNotification } from './models/hub-notification';
import { HubComponent } from './hubs/hub-component';
import { IGreeterHub } from './interfaces/greeter-hub.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends HubComponent implements OnInit, OnDestroy {
    constructor(public readonly signalrService: SignalRService,
        private readonly logger: LoggingService,
        private readonly nameService: NameService,
        readonly signalRManager: SignalRConnectionManager) {
        super(signalRManager);
    }

    public isConnected: boolean = false;

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    handleHubConnection() {
        this.signalRManager.connect(INotificationHub.hub, { name: this.nameService.name }).subscribe();
        this.signalRManager.connect(IGreeterHub.hub, { name: this.nameService.name }).subscribe();
    }

    handleHubConnectionLost() {
        super.handleHubConnectionLost();
        this.signalRManager.connectionLost$.subscribe((err) => {
            this.isConnected = false;
        });
    }
}
