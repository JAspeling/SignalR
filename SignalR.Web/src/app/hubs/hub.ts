import { ISignalRConnection } from 'ng2-signalr';

export abstract class IHub {
    static hub: string;
    connection: ISignalRConnection;

    serverMethods: any;
    clientMethods: any;
}
