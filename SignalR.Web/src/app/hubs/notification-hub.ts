import { BroadcastEventListener, ISignalRConnection } from 'ng2-signalr';
import { Observable, Subject } from 'rxjs';

import { INotificationHub } from '../interfaces/notification-hub.interface';
import { NotificationHubMessage } from '../models/notification-hub-message';
import { AppInjector } from '../services/app-injector';
import { LoggingService } from '../services/feedback-service';
import { HubBase } from './hub-base';

export class NotificationHub extends HubBase implements INotificationHub {
    public constructor(public connection: ISignalRConnection) {
        super(connection);

        if (!this.assertConnection()) {
            console.warn('NotificationHub will not work, as the connection to SignalR server has not been established yet.');
        }
        this.feedbackService = AppInjector.getInstance(LoggingService);
    }
    feedbackService: LoggingService;

    // Listen to when the server broadcasts 'SendNotification' on the NotificationHub
    public registerSendMessage(): Observable<NotificationHubMessage> {
        return this.register<NotificationHubMessage>(this.serverMethods.NotificationHub.SendMessage);
    }

    public registerNotify(): Observable<string> {
        return this.register<string>(this.serverMethods.NotificationHub.Notify);
    }

    private register<T>(method: string): Observable<T> {
        if (!this.assertConnection()) { return; }

        this.log(`Subscribing to ${method}`);

        const listener$ = new BroadcastEventListener<T>(method);
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
