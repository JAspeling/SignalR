import { ISignalRConnection } from 'ng2-signalr';
import { isNullOrUndefined } from 'util';

export class HubBase {
    public connection: ISignalRConnection;

    // These need to match the methods on the server
    serverMethods = {
        NotificationHub: {
            SendMessage: 'SendMessage',
            SendGroupMessage: 'SendGroupMessage',
            SendGroupsMessage: 'SendGroupsMessage',
            JoinGroup: 'JoinGroup',
            LeaveGroup: 'LeaveGroup'
        }
    };

    clientMethods = {
        NotificationHub: {
            Notify: 'Notify',
            SendMessage: 'SendMessage',
        }
    }

    constructor(connection: ISignalRConnection) {
        this.connection = connection;
    }

    public assertConnection(): boolean {
        return !isNullOrUndefined(this.connection);
    }
}
