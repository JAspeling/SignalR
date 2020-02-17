import { Observable } from 'rxjs';

import { NotificationHubMessage } from '../models/notification-hub-message';

export abstract class INotificationHub {
    static hub: string = 'NotificationHub'; // Needs to match the hub name on the server.
    abstract registerSendMessage(): Observable<NotificationHubMessage>;
}
