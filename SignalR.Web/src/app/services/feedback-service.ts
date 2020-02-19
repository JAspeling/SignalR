import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { HubEvent } from '../models/event';

@Injectable()
export class LoggingService {
    event$: Subject<HubEvent> = new Subject();

    public log(message: string, ...params: any[]) {
        console.log(`[Feedback] = ${message}`, params);
        this.event$.next(new HubEvent({ message: message }));
    }
}
