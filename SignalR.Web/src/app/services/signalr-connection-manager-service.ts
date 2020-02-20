import { Injectable } from '@angular/core';
import { ConnectionStatus, ISignalRConnection } from 'ng2-signalr';
import { Subject } from 'rxjs';

import { IHub } from '../hubs/hub';
import { LoggingService } from './feedback-service';
import { SignalRService } from './signalr-service';

@Injectable()
export class SignalRConnectionManager {
    connectionEstablished$: Subject<IHub> = new Subject<IHub>();
    connectionLost$: Subject<IHub> = new Subject<IHub>();

    constructor(private readonly signalR: SignalRService, private logger: LoggingService) {

    }

    /**
     * Connects to the specified hub and returns a connection when the connection is successful.
     * Handles reconnection when a connection to SignalR is lost. Will continue retrying indefinitely 
     * until a connection is re-established.
     * @param hub 
     */
    public connect(hub: string, options?: any): Subject<IHub> {
        this.connectAndRetryOnFail(null, hub, options);
        return this.connectionEstablished$;
    }

    // Connects to the server, and retries if the connection failed.
    private connectAndRetryOnFail(hub: IHub, hubName: string, options?: any): void {
        this.signalR.connect(hubName, options)
            .then((hub: IHub) => {
                this.logger.log(`${hub.connection.id} connected!`)
                this.monitorServerConnection(hub, hubName, options);

                // Connection established successfully
                this.connectionEstablished$.next(hub);
            })
            .catch((err) => {
                this.logger.log(`Connection to ${hubName} failed, retrying`)
                this.connectionLost$.next(hub)
                // Retry the connection.
                setTimeout(() => this.connectAndRetryOnFail(hub, hubName, options), 5000);
            })
    }

    private monitorServerConnection(hub: IHub, hubName: string, options?: any): void {
        this.logger.log(`Subscribing to server status on ${hub.connection.id} to monitor connection loss.`);
        hub.connection.status.subscribe({
            next: (status: ConnectionStatus) => {
                this.logger.log(`SignalR connection status: ${status.name} (${status.value})`, status);

                this.checkForDisconnects(status, hub, hubName, options);

                // Disconnected
                if (status.value === 4) {
                    this.connectAndRetryOnFail(hub, hubName, options);
                }
            }
        })
    }

    private checkForDisconnects(status: ConnectionStatus, hub: IHub, hubName: string, options?: any) {
        switch (status.value) {
            case 1: // Connected
                this.connectionEstablished$.next(hub);
                break;
            case 2: // Reconnecting
                this.connectionLost$.next(hub);
                break;
            case 4: // Disconnected
                this.connectionLost$.next(hub);
                this.connectAndRetryOnFail(hub, hubName, options);
                break;
        }
    }
}
