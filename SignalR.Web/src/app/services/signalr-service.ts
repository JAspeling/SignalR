import { Injectable } from '@angular/core';
import { ISignalRConnection, SignalR } from 'ng2-signalr';

import { environment } from '../../environments/environment';
import { NotificationHub } from '../hubs/notification-hub';
import { INotificationHub } from '../interfaces/notification-hub.interface';
import { LoggingService } from './feedback-service';
import { isNullOrUndefined } from 'util';
import { IHub } from '../hubs/hub';

@Injectable()
export class SignalRService {
    private _notificationHub: INotificationHub;
    public get notificationHub(): INotificationHub {
        this.assertHub(this._notificationHub);
        return this._notificationHub;
    };

    constructor(private readonly signalR: SignalR,
        private readonly feedbackService: LoggingService) {
    }

    connect(hub: string): Promise<ISignalRConnection> {
        return new Promise<ISignalRConnection>((resolve, reject) => {
            this.signalR.connect({ hubName: hub, url: environment.signalrUrl, jsonp: true })
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
            case INotificationHub.hub: this._notificationHub = new NotificationHub(connection); break;
        }
    }

    private assertHub(hub: IHub): void {
        if (isNullOrUndefined(hub)) {
            throw new Error(`${IHub.hub} isn't connected yet. Call signalRService.connect(${IHub.hub});`);
        }
    }
}
