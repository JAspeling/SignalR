import { ISignalRConnection } from 'ng2-signalr';
import { Observable } from 'rxjs';

import { IHub } from '../hubs/hub';
import { HubNotification } from '../models/hub-notification';
import { HubMessage } from '../models/notification-hub-message';

export abstract class INotificationHub implements IHub {
    static hub: string = 'NotificationHub'; // Needs to match the hub name on the server.
    public connection: ISignalRConnection;

    abstract registerSendMessage(): Observable<HubMessage>;
    abstract registerNotify(): Observable<HubNotification>;

    abstract sendMessage(message: string): Promise<void>;
    abstract sendGroupMessage(group: string, message: string): Promise<void>;
    abstract sendGroupsMessage(groups: string[], message: string): Promise<void>;
    abstract joinGroup(group: string): Promise<void>;
    abstract leaveGroup(group: string): Promise<void>;
}
