import { ISignalRConnection } from 'ng2-signalr';
import { Subject } from 'rxjs';

export abstract class IHub {
    static hub: string;
    connection: ISignalRConnection;
}
