import { Component, OnInit, OnDestroy } from '@angular/core';

import { HubEvent } from '../../../models/event';
import { SignalRService } from '../../../services/signalr-service';
import { NotificationHubMessage } from '../../../models/notification-hub-message';
import { Subscription, Subject } from 'rxjs';
import { LoggingService } from '../../../services/feedback-service';

// declare const $: any;

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit, OnDestroy {

    events: HubEvent[] = [];
    subs: Subscription[] = [];
    scrolled = false;

    constructor(private readonly signalR: SignalRService,
        private readonly logger: LoggingService) {
        logger.event$.subscribe(data => {
            this.events.push(data);
        });
    }

    ngOnInit() {
        const out = document.getElementById("feedback")

        // setInterval(function () {
        //     // allow 1px inaccuracy by adding 1
        //     const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 10;

        //     // scroll to bottom if isScrolledToBottom is true
        //     if (isScrolledToBottom) {
        //         out.scrollTop = out.scrollHeight - out.clientHeight
        //     }
        // }, 500)
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

}
