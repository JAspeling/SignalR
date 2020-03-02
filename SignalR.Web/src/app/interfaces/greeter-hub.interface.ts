import { IHub } from '../hubs/hub';
import { ISignalRConnection } from 'ng2-signalr';
import { Observable } from 'rxjs';
import { HubMessage } from '../models/notification-hub-message';

export abstract class IGreeterHub implements IHub {
    static hub: string = 'GreeterHub';
    connection: ISignalRConnection;
    
    serverMethods: any;
    clientMethods: any;

    // Client Methods
    abstract registerGreet(): Observable<string>;

    //server methods
    abstract sendGreeting();
}
