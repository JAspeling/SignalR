import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signalr-service';
import { INotificationHub } from './interfaces/notification-hub.interface';
import { ISignalRConnection } from 'ng2-signalr';
import { NotificationHubMessage } from './models/notification-hub-message';
import { FeedbackService } from './services/feedback-service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'signalr-web';

    constructor(public readonly signalrService: SignalRService,
        private readonly feedbackService: FeedbackService) {

    }

    public ngOnInit(): void {
        console.log(`subscribing to ${INotificationHub.hub}`);
        this.connectToHub(INotificationHub.hub).then(() => {
            this.subscribeToSendMessage();
        });
    }


    private connectToHub(hub: string): Promise<ISignalRConnection> {
        this.log(`Connecting to ${hub}...`);
        return this.signalrService.connect(hub)
    }

    private subscribeToSendMessage(): void {
        this.signalrService.notificationHub.registerSendMessage()
            .subscribe((message: NotificationHubMessage) => {
                try {
                    this.log(`[${message.userName || 'Anonymous'}] ${message.message}`);
                } catch (error) {
                    this.log('ERROR: Failed to display the SignalR notification');
                    console.error('Failed to display the SignalR notification', error);
                }
            });
    }

    public log(message: string) {
        this.feedbackService.log(message);
    }

    public async sendMessage(): Promise<void> {
        await this.signalrService.notificationHub.sendMessage('Sent from the button!');
    }
}
