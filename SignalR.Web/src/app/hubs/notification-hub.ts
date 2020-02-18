import { BroadcastEventListener, ISignalRConnection } from 'ng2-signalr';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

import { INotificationHub } from '../interfaces/notification-hub.interface';
import { NotificationHubMessage } from '../models/notification-hub-message';
import { HubBase } from './hub-base';

export class NotificationHub extends HubBase implements INotificationHub {

    private constructor(public connection: ISignalRConnection) {
        super(connection);

        if (!this.assertConnection) {
            console.warn('NotificationHub will not work, as the connection to SignalR server has not been established yet.');
        }
    }

    public static instance: NotificationHub;

    public static getInstance(connection?: ISignalRConnection): NotificationHub {
        if (isNullOrUndefined(NotificationHub.instance)) {
            if (isNullOrUndefined(connection)) throw new Error(`Cannot create a new instance of ${INotificationHub.hub} without a SignalR connection`);
            NotificationHub.instance = new NotificationHub(connection);
        }

        return NotificationHub.instance;
    }

    // Listen to when the server broadcasts 'SendNotification' on the NotificationHub
    public registerSendMessage(): Observable<NotificationHubMessage> {
        if (!this.assertConnection) { return; }

        const listener$ = new BroadcastEventListener<NotificationHubMessage>(this.serverMethods.NotificationHub.SendNotification);
        this.connection.listen(listener$);

        return listener$;
    }
}
