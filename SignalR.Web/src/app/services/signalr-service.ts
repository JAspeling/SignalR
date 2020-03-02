import { Injectable } from '@angular/core';
import { ISignalRConnection, SignalR } from 'ng2-signalr';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { IHub } from '../hubs/hub';
import { NotificationHub } from '../hubs/notification-hub';
import { INotificationHub } from '../interfaces/notification-hub.interface';
import { LoggingService } from './feedback-service';
import { IGreeterHub } from '../interfaces/greeter-hub.interface';
import { GreeterHub } from '../hubs/greeter-hub';

@Injectable()
export class SignalRService {
    private notificationHubSubject: Subject<INotificationHub> = new Subject<INotificationHub>();
    public notificationHub$: Observable<INotificationHub>;

    private greeterHubSubject: Subject<IGreeterHub> = new Subject<IGreeterHub>();
    public greeterHub$: Observable<IGreeterHub>;


    constructor(private readonly signalR: SignalR,
        private readonly feedbackService: LoggingService
    ) {
        this.notificationHub$ = this.notificationHubSubject.pipe(share());
        this.greeterHub$ = this.greeterHubSubject.pipe(share());
    }

    connect(hub: string, options?: any): Promise<IHub> {
        return new Promise<IHub>((resolve, reject) => {
            this.signalR.connect({ hubName: hub, url: environment.signalrUrl, jsonp: true, qs: options })
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
            case IGreeterHub.hub:
                hub = new GreeterHub(connection);
                this.greeterHubSubject.next(hub as IGreeterHub);
                break;
        }
        return hub;
    }
}
