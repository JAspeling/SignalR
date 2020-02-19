import { Injectable } from '@angular/core';
import { ISignalRConnection, ConnectionStatus } from 'ng2-signalr';

import { LoggingService } from './feedback-service';
import { SignalRService } from './signalr-service';
import { isNullOrUndefined } from 'util';
import { Observable, from, of } from 'rxjs';
import { catchError, finalize, tap, delay } from 'rxjs/operators'

@Injectable()
export class SignalRConnectionManager {
    private _retries: number = null;
    private set retryAmount(retries: number) {
        // Can only be set once, or set to null.
        if (isNullOrUndefined(this._retries) || isNullOrUndefined(retries)) {
            this._retries = retries;
        }
    }

    private get retryAmount(): number {
        return this._retries;
    }

    constructor(private readonly signalR: SignalRService, private logger: LoggingService) {

    }

    pollForAvailability(connection: ISignalRConnection, hub: string): void {
        this.connectRetryIndefinitely(hub)
    }

    monitorServerConnection(connection: ISignalRConnection, hub: string): void {
        this.logger.log(`Subscribing to server status on ${connection.id}`);
        connection.status.subscribe({
            next: (status: ConnectionStatus) => {
                this.logger.log(`[next] status: ${status.name}`, status);

                // Disconnected
                if (status.value === 4) {
                    this.pollForAvailability(connection, hub);
                }
            },
            error: (error) => {
                this.logger.log(`[error] status: ${error}`, error);
            },
            complete: () => {
                this.logger.log(`[complete] closed: ${closed}`);
            }
        })
    }

    // Should only be called when a connection has already been established - Server restart, appPool recycle, etc. 
    // Connection has made to the server at least once, so we know its not a 'bad' connection, and should 
    // be able to reconnect.
    private connectRetryIndefinitely(hub: string): Promise<ISignalRConnection> {

        return this.connect(hub)
            .then((connection: ISignalRConnection) => {
                this.logger.log(`${connection.id} connected!`)
                this.retryAmount = null;
                this.monitorServerConnection(connection, hub);

                // Connection established successfully
                return Promise.resolve(connection);
            })
            .catch((err) => {
                this.logger.log(`Connection to ${hub} failed, retrying`)

                // Retry the connection.
                return new Promise(resolve => setTimeout(() => resolve(this.connectRetryIndefinitely(hub)), 5000));
            })
    }

    connectWithRetry(hub: string, retries: number = 5): Promise<ISignalRConnection> {
        this.retryAmount = retries

        if (retries >= 0) {
            return this.connect(hub).then((connection: ISignalRConnection) => {
                this.logger.log(`${connection.id} connected!`);
                this.retryAmount = null;
                this.monitorServerConnection(connection, hub);

                return Promise.resolve(connection);
            }).catch((error) => {
                this.logger.log(`Connection to ${hub} failed, ${retries} retries remaining`);

                return new Promise<ISignalRConnection>(resolve => setTimeout(() => resolve(this.connectWithRetry(hub, --retries)), 5000));
            })
        } else {
            // Fail the connection attempt
            const err: string = `Failed to connect to ${hub} ${this.retryAmount} times, aborting connection attempts.`;
            this.logger.log(err)
            this.retryAmount = null;

            throw new Error(err);
        }
    }

    connect(hub: string): Promise<ISignalRConnection> {
        return this.connectToHub(hub);
    }

    private connectToHub(hub: string): Promise<ISignalRConnection> {
        this.log(`Connecting to ${hub}...`);
        return this.signalR.connect(hub);
    }

    public log(message: string) {
        this.logger.log(message);
    }
}
