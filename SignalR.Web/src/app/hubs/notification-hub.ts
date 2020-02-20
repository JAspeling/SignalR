import { BroadcastEventListener, ISignalRConnection } from 'ng2-signalr';
import { Observable, Subject } from 'rxjs';

import { INotificationHub } from '../interfaces/notification-hub.interface';
import { HubMessage } from '../models/notification-hub-message';
import { AppInjector } from '../services/app-injector';
import { LoggingService } from '../services/feedback-service';
import { HubBase } from './hub-base';
import { HubNotification } from '../models/hub-notification';

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
    public registerSendMessage(): Observable<HubMessage> {
        return this.register<HubMessage>(this.clientMethods.NotificationHub.SendMessage);
    }

    public registerNotify(): Observable<HubNotification> {
        return this.register<HubNotification>(this.clientMethods.NotificationHub.Notify);
    }

    private register<T>(method: string): Observable<T> {
        if (!this.assertConnection()) { return; }

        this.log(`Subscribing to ${method}`);

        const listener$ = new BroadcastEventListener<T>(method);
        this.connection.listen(listener$);

        return listener$;
    }

    // Execute Server methods
    public sendMessage(message: string): Promise<void> {
        return this.connection.invoke(this.serverMethods.NotificationHub.SendMessage, message);
    }

    public sendGroupMessage(group: string, message: string) {
        return this.connection.invoke(this.serverMethods.NotificationHub.SendGroupMessage, group, message);
    }

    public sendGroupsMessage(groups: string[], message: string) {
        return this.connection.invoke(this.serverMethods.NotificationHub.SendGroupsMessage, groups, message);
    }

    public joinGroup(group: string): Promise<void> {
        return this.connection.invoke(this.serverMethods.NotificationHub.JoinGroup, group);
    }
    
    public leaveGroup(group: string): Promise<void> {
        return this.connection.invoke(this.serverMethods.NotificationHub.LeaveGroup, group);
    }

    private log(message: string): void {
        this.feedbackService.log(`[${INotificationHub.hub}] ${message}`);
    }
}
