import { ISignalRConnection } from 'ng2-signalr';

import { IGreeterHub } from '../interfaces/greeter-hub.interface';
import { HubBase } from './hub-base';
import { Observable } from 'rxjs';
import { HubMessage } from '../models/notification-hub-message';

export class GreeterHub extends HubBase implements IGreeterHub  {
    serverMethods: {
        SendGreeting: 'SendGreeting'
    };

    clientMethods = {
        Greet: 'Greet'
    };

    public constructor(public connection: ISignalRConnection) {
        super(connection);

        this.assertConnection(IGreeterHub.hub);
    }

    public registerGreet(): Observable<string> {
        return this.register<string>(this.clientMethods.Greet);
    }

    public sendGreeting() {
        this.connection.invoke(this.serverMethods.SendGreeting);
    }
}