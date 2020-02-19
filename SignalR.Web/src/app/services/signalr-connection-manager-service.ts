import { Injectable } from '@angular/core';
import { ISignalRConnection } from 'ng2-signalr';

import { LoggingService } from './feedback-service';
import { SignalRService } from './signalr-service';
import { isNullOrUndefined } from 'util';

@Injectable()
export class SignalRConnectionManager {
    private _retries: number = null;
    private set retries(retries: number) {
        // Can only be set once, or set to null.
        if (isNullOrUndefined(this._retries) || isNullOrUndefined(retries)) {
            this._retries = retries;
        }
    }

    private get retries(): number {
        return this._retries;
    }

    constructor(private readonly signalR: SignalRService, private logger: LoggingService) {

    }

    connect(hub: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.connectToHub(hub)
                .then((connection: ISignalRConnection) => {
                    resolve(connection);
                }).catch((error) => {
                    reject(error);
                });
        })
    }

    connectWithRetry(hub: string, retries: number = 5): Promise<ISignalRConnection> {
        this.retries = retries

        if (retries >= 0) {
            return this.connect(hub)
                .then((connection: ISignalRConnection) => {
                    this.logger.log(`${connection.id} connected!`)
                    this.retries = null;
                    return Promise.resolve(connection);
                })
                .catch((err) => {
                    this.logger.log(`Connection to ${hub} failed, ${retries} retries remaining`)

                    return new Promise(resolve => setTimeout(() => resolve(this.connectWithRetry(hub, --retries)), 5000)) // <-- The important part
                })
        } else {
            const err: string = `Failed to connect to ${hub} ${this.retries} times, aborting connection attempts.`;
            this.logger.log(err)
            this.retries = null;
            return Promise.reject(err);
        }

        return;
    }

    private connectToHub(hub: string): Promise<ISignalRConnection> {
        this.log(`Connecting to ${hub}...`);
        return this.signalR.connect(hub)
    }

    public log(message: string) {
        this.logger.log(message);
    }
}
