import { Injectable } from '@angular/core';
import { ISignalRConnection, SignalR } from 'ng2-signalr';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { NotificationHub } from '../hubs/notification-hub';
import { INotificationHub } from '../interfaces/notification-hub.interface';
import { LoggingService } from './feedback-service';
import { NameService } from './name-service';
import { share } from 'rxjs/operators';
import { IHub } from '../hubs/hub';

@Injectable()
export class SignalRService {
    private notificationHubSubject: Subject<INotificationHub>;
    public notificationHub$: Observable<INotificationHub>;

    constructor(private readonly signalR: SignalR,
        private readonly feedbackService: LoggingService,
        private readonly nameService: NameService
    ) {
        this.notificationHubSubject = new Subject<INotificationHub>();
        this.notificationHub$ = this.notificationHubSubject.pipe(share())
    }

    connect(hub: string, options?: any): Promise<IHub> {
        return new Promise<IHub>((resolve, reject) => {
            this.signalR.connect({ hubName: hub, url: environment.signalrUrl, jsonp: true, qs: { name: this.nameService.name } })
                .then((connection: ISignalRConnection) => {
                    this.feedbackService.log(`Connection to ${hub} success`);
                    resolve(this.instantiateHub(hub, connection));
                })
                .catch((error) => {
                    this.feedbackService.log(`Failed to connect to SignalR hub ${hub}`);
                    reject(error);
                });

        });
    }

    private instantiateHub(hubName: string, connection: ISignalRConnection): IHub {
        var hub: IHub;
        switch (hubName) {
            case INotificationHub.hub:
                hub = new NotificationHub(connection);
                this.notificationHubSubject.next(hub as INotificationHub);
                break;
        }
        return hub;
    }
}
