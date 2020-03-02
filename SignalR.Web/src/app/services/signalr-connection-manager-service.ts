import { Injectable } from '@angular/core';
import { ConnectionStatus, ISignalRConnection } from 'ng2-signalr';
import { Subject } from 'rxjs';

import { IHub } from '../hubs/hub';
import { LoggingService } from './feedback-service';
import { SignalRService } from './signalr-service';

@Injectable()
export class SignalRConnectionManager {
    connectionEstablished$: Subject<IHub> = new Subject<IHub>();
    connectionLost$: Subject<any> = new Subject<any>();

    constructor(private readonly signalR: SignalRService, private logger: LoggingService) {

    }

    /**
     * Connects to the specified hub and returns a connection when the connection is successful.
     * Handles reconnection when a connection to SignalR is lost. Will continue retrying indefinitely 
     * until a connection is re-established.
     * @param hub The name of the hub to connect to.
     * @param params The parameters that will be sent with the connection as QueryParameters
     */
    public connect(hub: string, params?: any): Subject<IHub> {
        this.connectAndRetryOnFail(hub, params);
        return this.connectionEstablished$;
    }

    /**
     * Connects to the signalR hub, and retries if the connection failed.
     * @param hubName The name of the hub to connect to
     * @param params The parameters that will be sent with the connection as QueryParameters
     */
    private connectAndRetryOnFail(hubName: string, params?: any): void {
        this.signalR.connect(hubName, params)
            .then((hub: IHub) => {
                this.connectionEstablished$.next(hub);
                this.monitorServerConnection(hub, hubName, params);
            })
            .catch((err) => {
                this.connectionLost$.next(err)
                
                setTimeout(() => this.connectAndRetryOnFail(hubName, params), 5000);
            })
    }

    /**
     * Monitors the State of the hub connection and attempt to retry when the connection disconnects.
     * 
     * @param hub The instance of the hub, should be in a connected state.
     * @param hubName The name of the hub - this is required when a reconnect attempt is made.
     * @param params The parameters that will be sent with the connection as QueryParameters - This is required when a reconnect attempt is made.
     */
    private monitorServerConnection(hub: IHub, hubName: string, params?: any): void {
        this.logger.log(`Subscribing to server status on ${hub.connection.id} to monitor connection loss.`);
        hub.connection.status.subscribe({
            next: (status: ConnectionStatus) => {
                this.logger.log(`SignalR connection status: ${status.name} (${status.value})`, status);

                this.checkForDisconnects(status, hub, hubName, params);
            }
        })
    }


    /**
     * Handles disconnects according to the SignalR hub connection status.
     * @param status The SignalR connection status
     * @param hub The instance of the hub - required to emit a connection established event.
     * @param hubName The name of the hub - this is required when a reconnect attempt is made.
     * @param params The parameters that will be sent with the connection as QueryParameters - This is required when a reconnect attempt is made.
     */
    private checkForDisconnects(status: ConnectionStatus, hub: IHub, hubName: string, params?: any) {
        switch (status.value) {
            case 1: // Connected
                this.connectionEstablished$.next(hub);
                break;
            case 2: // Reconnecting
                this.connectionLost$.next(status.value);
                break;
            case 4: // Disconnected
                this.connectionLost$.next(status.value);
                this.connectAndRetryOnFail(hubName, params);
                break;
        }
    }
}
