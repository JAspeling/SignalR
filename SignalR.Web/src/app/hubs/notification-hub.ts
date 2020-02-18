import { BroadcastEventListener, ISignalRConnection } from 'ng2-signalr';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

import { INotificationHub } from '../interfaces/notification-hub.interface';
import { NotificationHubMessage } from '../models/notification-hub-message';
import { HubBase } from './hub-base';
import { FeedbackService } from '../services/feedback-service';
import { AppInjector } from '../services/app-injector';

export class NotificationHub extends HubBase implements INotificationHub {
    public constructor(public connection: ISignalRConnection) {
        super(connection);

        if (!this.assertConnection) {
            console.warn('NotificationHub will not work, as the connection to SignalR server has not been established yet.');
        }
        this.feedbackService = AppInjector.getInstance(FeedbackService);
    }

    feedbackService: FeedbackService;

    // Listen to when the server broadcasts 'SendNotification' on the NotificationHub
    public registerSendMessage(): Observable<NotificationHubMessage> {
        if (!this.assertConnection) { return; }
        this.log(`Subscribing to ${this.serverMethods.NotificationHub.SendMessage}`);

        const listener$ = new BroadcastEventListener<NotificationHubMessage>(this.serverMethods.NotificationHub.SendMessage);
        this.connection.listen(listener$);

        return listener$;
    }

    // Send server messages
    public sendMessage(message: string): Promise<void> {
        return this.connection.invoke(this.serverMethods.NotificationHub.SendMessage, message);
    }

    public log(message: string): void {
        this.feedbackService.log(`[${INotificationHub.hub}] ${message}`);
    }
}
