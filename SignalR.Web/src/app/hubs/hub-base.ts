import { BroadcastEventListener, ISignalRConnection } from 'ng2-signalr';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

export class HubBase {
    public connection: ISignalRConnection;

    constructor(connection: ISignalRConnection) {
        this.connection = connection;
    }

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
