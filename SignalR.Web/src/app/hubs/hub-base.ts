import { BroadcastEventListener, ISignalRConnection } from 'ng2-signalr';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

export class HubBase {
    public connection: ISignalRConnection;

    constructor(connection: ISignalRConnection) {
        this.connection = connection;
    }

    /**
     * Registers a client method on the server, and listens to whenever that method is called
     * 
     * @param T The parameter type that is used in the method. *__Note__: Can only have one parameter. 
     * When multiple parameters are required, those must be grouped into a plain class object and sent through
     * as one parameter.*
     * @param method The Client Method name that must be subscribed to on the server.
     */
    public register<T>(method: string): Observable<T> {
        if (!this.assertConnection()) { return; }

        const listener$ = new BroadcastEventListener<T>(method);
        this.connection.listen(listener$);

        return listener$;
    }
    
    public assertConnection(hubName?: string): boolean {
        var result = !isNullOrUndefined(this.connection);
        if (!result && !isNullOrUndefined(hubName)) {
            console.warn(`${hubName} will not work, as the SignalR connection to the hub has not been established yet.`);
        }
        return result
    }
}
