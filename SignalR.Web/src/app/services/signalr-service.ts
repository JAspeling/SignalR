import { Injectable } from '@angular/core';
import { ISignalRConnection, SignalR } from 'ng2-signalr';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { NotificationHub } from '../hubs/notification-hub';
import { INotificationHub } from '../interfaces/notification-hub.interface';
import { LoggingService } from './feedback-service';
import { NameService } from './name-service';

@Injectable()
export class SignalRService {
    public notificationHubReady$: Subject<boolean> = new Subject<boolean>();
    public notificationHub: INotificationHub;

    constructor(private readonly signalR: SignalR,
        private readonly feedbackService: LoggingService,
        private readonly nameService: NameService
    ) {
    }

    connect(hub: string): Promise<ISignalRConnection> {
        return new Promise<ISignalRConnection>((resolve, reject) => {
            this.signalR.connect({ hubName: hub, url: environment.signalrUrl, jsonp: true, qs: { name: this.nameService.name } })
                .then((connection: ISignalRConnection) => {
                    this.feedbackService.log(`Connection to ${hub} success`);
                    this.instantiateHub(hub, connection);
                    resolve(connection);
                })
                .catch((error) => {
                    this.feedbackService.log(`Failed to connect to SignalR hub ${hub}`);
                    reject(error);
                });

        });
    }

    private instantiateHub(hub: string, connection: ISignalRConnection): void {
        switch (hub) {
            case INotificationHub.hub:
                this.notificationHub = new NotificationHub(connection);
                this.notificationHubReady$.next(true);
                break;
        }
    }
}
