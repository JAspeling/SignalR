import { Component, OnDestroy, OnInit } from '@angular/core';

import { INotificationHub } from './interfaces/notification-hub.interface';
import { HubMessage } from './models/notification-hub-message';
import { LoggingService } from './services/feedback-service';
import { SignalRConnectionManager } from './services/signalr-connection-manager-service';
import { SignalRService } from './services/signalr-service';
import { NameService } from './services/name-service';
import { Subscription } from 'rxjs';
import { HubNotification } from './models/hub-notification';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    constructor(public readonly signalrService: SignalRService,
        private readonly logger: LoggingService,
        private readonly signalRManager: SignalRConnectionManager,
        private readonly nameService: NameService) {

        this.handleHubConnection();
        this.handleHubConnectionLost();
    }

    public isConnected: boolean = false;
    private hubSubscriptions: Subscription[] = [];

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.signalrService.notificationHub$.subscribe(hub => {
            hub.connection.stop();
        })
    }

    private handleHubConnection() {
        console.log(`subscribing to ${INotificationHub.hub}`);
        this.signalRManager.connect(INotificationHub.hub, { name: this.nameService.name }).subscribe((hub: INotificationHub) => {
            this.isConnected = true;
            this.subscribeToSendMessage(hub);
            this.subscribeToNotify(hub);
        });
    }

    private handleHubConnectionLost() {
        this.signalRManager.connectionLost$.subscribe(() => {
            this.isConnected = false;
            this.hubSubscriptions.forEach(sub => {
                sub.unsubscribe();
            });
        });
    }

    private subscribeToNotify(hub: INotificationHub) {
        this.hubSubscriptions.push(hub.registerNotify()
            .subscribe({
                next: (notification: HubNotification) => { this.logger.log(`${notification.originatingUser} - ${notification.message}`); },
                error: (error) => { this.logger.log(`Notify failed`); },
                complete: () => { },
            }));
    }

    private subscribeToSendMessage(hub: INotificationHub): void {
        this.hubSubscriptions.push(hub.registerSendMessage()
            .subscribe({
                next: (message: HubMessage) => { this.logger.log(`[${message.userName || 'Anonymous'}] ${message.message}`); },
                error: (error) => { this.logger.log(`SendMessage failed`); },
                complete: () => { },
            }));
    }

    public sendMessage(): void {
        this.signalrService.notificationHub$.subscribe((hub: INotificationHub) => {
            hub.sendMessage('Sent from the button!')
        });
    }
}
