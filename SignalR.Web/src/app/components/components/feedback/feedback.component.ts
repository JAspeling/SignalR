import { Component, OnInit, OnDestroy } from '@angular/core';

import { HubEvent } from '../../../models/event';
import { SignalRService } from '../../../services/signalr-service';
import { NotificationHubMessage } from '../../../models/notification-hub-message';
import { Subscription, Subject } from 'rxjs';
import { FeedbackService } from '../../../services/feedback-service';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit, OnDestroy {

    events: HubEvent[] = [];
    subs: Subscription[] = [];

    constructor(private readonly signalR: SignalRService,
        private readonly feedbackService: FeedbackService) {
        feedbackService.event$.subscribe(data => {
            this.events.push(data);
        });
        console.log('Feedback component ctor');
    }

    ngOnInit() {

        // this.monitorNotificationHubSendMessage();

        //this.signalR.notificationHub().connection.invoke('SendMessage', 'Johan Aspeling', 'fired from ngOnInit!');
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    private monitorNotificationHubSendMessage() {
        this.subs.push(
            this.signalR.notificationHub().registerSendMessage().subscribe((message: NotificationHubMessage) => {
                this.feedbackService.log(`[${message.userName}] message.message`);
            })
        );
    }
}
