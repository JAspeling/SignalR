import { Injectable } from '@angular/core';
import { ISignalRConnection, SignalR } from 'ng2-signalr';

import { environment } from '../../environments/environment';
import { NotificationHub } from '../hubs/notification-hub';
import { INotificationHub } from '../interfaces/notification-hub.interface';
import { Dictionary } from '../interfaces/dictionary';

@Injectable()
export class SignalRService {
    public connections: Dictionary<ISignalRConnection> = {};

    notificationHub = (connection: ISignalRConnection): INotificationHub => NotificationHub.getInstance(connection);

    constructor(private readonly signalR: SignalR) {
    }

    connect(hub: string): Promise<ISignalRConnection> {
        return new Promise<ISignalRConnection>((resolve, reject) => {
            this.signalR.connect({ hubName: hub, url: environment.signalrUrl })
                .then((connection: ISignalRConnection) => {
                    this.connections[hub] = connection;
                    console.log(`[SignalR] Connection to hub ${hub} started`);
                    resolve(connection);
                })
                .catch((error) => {
                    console.error(`[SignalR] Failed to connect to SignalR hub ${hub}`, error);
                    reject(error);
                });

        });
    }
}
