import { Component, OnInit, OnDestroy } from '@angular/core';

import { HubEvent } from '../../../models/event';
import { SignalRService } from '../../../services/signalr-service';
import { NotificationHubMessage } from '../../../models/notification-hub-message';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit, OnDestroy {

    events: HubEvent[] = [];

    constructor(private readonly signalR: SignalRService) { }

    ngOnInit() {

        this.monitorNotificationHubSendMessage();
        
        for (let index = 0; index < 100; index++) {
            this.events.push(new HubEvent({ message: `test ${index + 1}` }));
        }
    }

    private monitorNotificationHubSendMessage() {
        this.signalR.notificationHub().registerSendMessage().subscribe((message: NotificationHubMessage) => {
        });
    }
}
