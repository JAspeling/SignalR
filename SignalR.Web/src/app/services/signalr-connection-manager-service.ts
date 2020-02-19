import { Injectable } from '@angular/core';
import { ConnectionStatus, ISignalRConnection } from 'ng2-signalr';
import { Subject } from 'rxjs';

import { LoggingService } from './feedback-service';
import { SignalRService } from './signalr-service';
import { IHub } from '../hubs/hub';

@Injectable()
export class SignalRConnectionManager {
    connectionEstablished$: Subject<IHub> = new Subject<IHub>();

    constructor(private readonly signalR: SignalRService, private logger: LoggingService) {

    }

    /**
     * Connects to the specified hub and returns a connection when the connection is successful.
     * Handles reconnection when a connection to SignalR is lost. Will continue retrying indefinitely 
     * until a connection is re-established.
     * @param hub 
     */
    public connect(hub: string, options?: any): Subject<IHub> {
        this.connectRetryIndefinitely(hub);
        return this.connectionEstablished$;
    }

    private monitorServerConnection(connection: ISignalRConnection, hub: string): void {
        this.logger.log(`Subscribing to server status on ${connection.id} to monitor connection loss.`);
        connection.status.subscribe({
            next: (status: ConnectionStatus) => {
                this.logger.log(`SignalR connection status: ${status.name}`, status);

                // Disconnected
                if (status.value === 4) {
                    this.connectRetryIndefinitely(hub);
                }
            }
        })
    }

    // Should only be called when a connection has already been established - Server restart, appPool recycle, etc. 
    // Connection has made to the server at least once, so we know its not a 'bad' connection, and should 
    // be able to reconnect.
    private connectRetryIndefinitely(hubName: string): void {
        this.signalR.connect(hubName)
            .then((hub: IHub) => {
                this.logger.log(`${hub.connection.id} connected!`)
                this.monitorServerConnection(hub.connection, hubName);

                // Connection established successfully
                this.connectionEstablished$.next(hub);
            })
            .catch((err) => {
                this.logger.log(`Connection to ${hubName} failed, retrying`)

                // Retry the connection.
                setTimeout(() => this.connectRetryIndefinitely(hubName), 5000);
            })
    }

    public log(message: string) {
        this.logger.log(message);
    }
}
