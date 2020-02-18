import { Injectable } from '@angular/core';
import { HubEvent } from '../models/event';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class FeedbackService {
    event$: Subject<HubEvent> = new Subject();

    public log(message: string) {
        console.log(`[Feedback] = ${message}`);
        this.event$.next(new HubEvent({ message: message }));
    }
}
