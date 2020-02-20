import { Injectable } from '@angular/core';
import { ConnectionStatus, ISignalRConnection } from 'ng2-signalr';
import { Subject } from 'rxjs';

import { IHub } from '../hubs/hub';
import { LoggingService } from './feedback-service';
import { SignalRService } from './signalr-service';

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
        this.connectAndRetryOnFail(hub, options);
        return this.connectionEstablished$;
    }

    private monitorServerConnection(connection: ISignalRConnection, hub: string, options?: any): void {
        this.logger.log(`Subscribing to server status on ${connection.id} to monitor connection loss.`);
        connection.status.subscribe({
            next: (status: ConnectionStatus) => {
                this.logger.log(`SignalR connection status: ${status.name}`, status);

                // Disconnected
                if (status.value === 4) {
                    this.connectAndRetryOnFail(hub, options);
                }
            }
        })
    }

    // Connects to the server, and retries if the connection failed.
    private connectAndRetryOnFail(hubName: string, options?: any): void {
        this.signalR.connect(hubName, options)
            .then((hub: IHub) => {
                this.logger.log(`${hub.connection.id} connected!`)
                this.monitorServerConnection(hub.connection, hubName, options);

                // Connection established successfully
                this.connectionEstablished$.next(hub);
            })
            .catch((err) => {
                this.logger.log(`Connection to ${hubName} failed, retrying`)

                // Retry the connection.
                setTimeout(() => this.connectAndRetryOnFail(hubName, options), 5000);
            })
    }
}
