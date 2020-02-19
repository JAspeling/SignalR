import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { HubEvent } from '../models/event';

@Injectable()
export class LoggingService {
    event$: Subject<HubEvent> = new Subject();

    public log(message: string) {
        console.log(`[Feedback] = ${message}`);
        this.event$.next(new HubEvent({ message: message }));
    }
}
