import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signalr-service';
import { INotificationHub } from './interfaces/notification-hub.interface';
import { ISignalRConnection } from 'ng2-signalr';
import { NotificationHubMessage } from './models/notification-hub-message';
import { LoggingService } from './services/feedback-service';
import { SignalRConnectionManager } from './services/signalr-connection-manager-service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'signalr-web';

    constructor(public readonly signalrService: SignalRService,
        private readonly logger: LoggingService,
        private readonly signalRManager: SignalRConnectionManager) {

    }

    public ngOnInit(): void {
        console.log(`subscribing to ${INotificationHub.hub}`);

        this.signalRManager.connect(INotificationHub.hub).subscribe(() => {
            this.subscribeToSendMessage();
            this.subscribeToNotify();
        })
    }
    
    private subscribeToNotify() {
        this.signalrService.notificationHub.registerNotify()
            .subscribe({
                next: (message: string) => { this.log(`${message}`); },
                error: (error) => { this.log(`Notify failed`); },
                complete: () => { },
            });
    }

    private subscribeToSendMessage(): void {
        this.signalrService.notificationHub.registerSendMessage()
            .subscribe({
                next: (message: NotificationHubMessage) => { this.log(`[${message.userName || 'Anonymous'}] ${message.message}`); },
                error: (error) => { this.log(`SendMessage failed`); },
                complete: () => { },
            });
    }

    public log(message: string) {
        this.logger.log(message);
    }

    public async sendMessage(): Promise<void> {
        await this.signalrService.notificationHub.sendMessage('Sent from the button!');
    }
}
