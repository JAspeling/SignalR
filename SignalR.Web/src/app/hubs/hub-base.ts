import { ISignalRConnection } from 'ng2-signalr';
import { isNullOrUndefined } from 'util';

export class HubBase {
    public connection: ISignalRConnection;

    // These need to match the methods on the server
    serverMethods = {
        NotificationHub: {
            SendNotification: 'SendNotification'
        }
    };

    constructor(connection: ISignalRConnection) {
        this.connection = connection;
    }

    public assertConnection(): boolean {
        return !isNullOrUndefined(this.connection);
    }
}
