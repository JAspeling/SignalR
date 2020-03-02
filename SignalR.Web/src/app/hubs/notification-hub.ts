import { ISignalRConnection } from 'ng2-signalr';
import { Observable } from 'rxjs';

import { INotificationHub } from '../interfaces/notification-hub.interface';
import { HubNotification } from '../models/hub-notification';
import { HubMessage } from '../models/notification-hub-message';
import { HubBase } from './hub-base';

export class NotificationHub extends HubBase implements INotificationHub {
    serverMethods = {
        SendMessage: 'SendMessage',
        SendGroupMessage: 'SendGroupMessage',
        SendGroupsMessage: 'SendGroupsMessage',
        JoinGroup: 'JoinGroup',
        LeaveGroup: 'LeaveGroup'
    }

    clientMethods = {
        SendMessage: 'SendMessage',
        Notify: 'Notify'
    }

    public constructor(public connection: ISignalRConnection) {
        super(connection);

        this.assertConnection(INotificationHub.hub);
    }

    // Listen to when the server broadcasts 'SendNotification' on the NotificationHub
    public registerSendMessage(): Observable<HubMessage> {
        return this.register<HubMessage>(this.clientMethods.SendMessage);
    }

    public registerNotify(): Observable<HubNotification> {
        return this.register<HubNotification>(this.clientMethods.Notify);
    }

    // Execute Server methods
    public sendMessage(message: string): Promise<void> {
        return this.connection.invoke(this.serverMethods.SendMessage, message);
    }

    public sendGroupMessage(group: string, message: string) {
        return this.connection.invoke(this.serverMethods.SendGroupMessage, group, message);
    }

    public sendGroupsMessage(groups: string[], message: string) {
        return this.connection.invoke(this.serverMethods.SendGroupsMessage, groups, message);
    }

    public joinGroup(group: string): Promise<void> {
        return this.connection.invoke(this.serverMethods.JoinGroup, group);
    }

    public leaveGroup(group: string): Promise<void> {
        return this.connection.invoke(this.serverMethods.LeaveGroup, group);
    }
}
