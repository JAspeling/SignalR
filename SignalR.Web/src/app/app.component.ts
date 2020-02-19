import { Component, OnDestroy, OnInit } from '@angular/core';

import { INotificationHub } from './interfaces/notification-hub.interface';
import { NotificationHubMessage } from './models/notification-hub-message';
import { LoggingService } from './services/feedback-service';
import { SignalRConnectionManager } from './services/signalr-connection-manager-service';
import { SignalRService } from './services/signalr-service';
import { NameService } from './services/name-service';

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

        console.log(`subscribing to ${INotificationHub.hub}`);
        this.signalRManager.connect(INotificationHub.hub, { name: this.nameService.name}).subscribe((hub: INotificationHub) => {
            this.subscribeToSendMessage(hub);
            this.subscribeToNotify(hub);
        });
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.signalrService.notificationHub$.subscribe(hub => {
            hub.connection.stop();
        })
    }

    private subscribeToNotify(hub: INotificationHub) {
        hub.registerNotify()
            .subscribe({
                next: (message: string) => { this.log(`${message}`); },
                error: (error) => { this.log(`Notify failed`); },
                complete: () => { },
            });
    }

    private subscribeToSendMessage(hub: INotificationHub): void {
        hub.registerSendMessage()
            .subscribe({
                next: (message: NotificationHubMessage) => { this.log(`[${message.userName || 'Anonymous'}] ${message.message}`); },
                error: (error) => { this.log(`SendMessage failed`); },
                complete: () => { },
            });
    }

    public log(message: string) {
        this.logger.log(message);
    }

    public sendMessage(): void {
        this.signalrService.notificationHub$.subscribe((hub: INotificationHub) => {
            hub.sendMessage('Sent from the button!')
        });
    }
}
