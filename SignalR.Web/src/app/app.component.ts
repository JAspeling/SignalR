import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signalr-service';
import { INotificationHub } from './interfaces/notification-hub.interface';
import { ISignalRConnection } from 'ng2-signalr';
import { NotificationHubMessage } from './models/notification-hub-message';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'signalr-web';

    constructor(public readonly signalrService: SignalRService) {

    }

    public ngOnInit(): void {
        this.connectToHub(INotificationHub.hub, (connection: ISignalRConnection) => this.subscribeToAllNotifications(connection));
    }

    private connectToHub(hub: string, connectionCallback: (connection: ISignalRConnection) => void): void {
        this.signalrService.connect(hub)
            .then((connection: ISignalRConnection) => {
                connectionCallback(connection);
            })
            .catch((err) => {
                console.error(`Error occurred while Connecting to SignalR hub ${hub}.`, err);
            });
    }

    private subscribeToAllNotifications(connection: ISignalRConnection): void {
        this.signalrService.notificationHub(connection).registerSendMessage()
            .subscribe((message: NotificationHubMessage) => {
                try {
                    console.log(`[SIGNALR INCOMING] - ${message.userName}: ${message.message}`);
                } catch (error) {
                    console.error('Failed to display the SignalR notification');
                }
            });
    }
}
