import { Observable } from 'rxjs';

import { NotificationHubMessage } from '../models/notification-hub-message';
import { ISignalRConnection } from 'ng2-signalr';
import { IHub } from '../hubs/hub';

export abstract class INotificationHub implements IHub {
    static hub: string = 'NotificationHub'; // Needs to match the hub name on the server.
    public connection: ISignalRConnection;

    abstract registerSendMessage(): Observable<NotificationHubMessage>;
    abstract registerNotify(): Observable<string>;

    abstract sendMessage(message: string): Promise<void>;
}
