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
        this.signalRManager.connect(INotificationHub.hub, { name: this.nameService.name })
            .subscribe({
                next: (hub: INotificationHub) => {
                    this.isConnected = true;
                    this.subscribeToSendMessage(hub);
                    this.subscribeToNotify(hub);
                }
            });
    }

    handleHubConnectionLost() {
        super.handleHubConnectionLost();
        this.signalRManager.connectionLost$.subscribe((err) => {
            this.isConnected = false;
        });
    }

    private subscribeToNotify(hub: INotificationHub) {
        this.hubSubscriptions.push(
            hub.registerNotify()
                .subscribe({
                    next: (notification: HubNotification) => { this.logger.log(`${notification.originatingUser} - ${notification.message}`); },
                    error: (error) => { this.logger.log(`Notify failed`); },
                    complete: () => { },
                })
        );
    }

    private subscribeToSendMessage(hub: INotificationHub): void {
        this.hubSubscriptions.push(hub.registerSendMessage()
            .subscribe({
                next: (message: HubMessage) => { this.logger.log(`[${message.userName || 'Anonymous'}] ${message.message}`); },
                error: (error) => { this.logger.log(`SendMessage failed`); },
                complete: () => { },
            }));
    }
}
