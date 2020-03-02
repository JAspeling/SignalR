import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { SignalRConnectionManager } from '../services/signalr-connection-manager-service';

/**
 * This class should be inherited from when you have a component that uses a hub.
 */
export abstract class HubComponent implements OnInit, OnDestroy {
    hubSubscriptions: Subscription[] = [];
    signalRManager: SignalRConnectionManager;

    constructor(signalRManager: SignalRConnectionManager) {
        this.signalRManager = signalRManager;
    }

    public ngOnInit() {
        this.handleHubConnection();
        this.handleHubConnectionLost();
    }

    public ngOnDestroy() {
        if (!isNullOrUndefined(this.hubSubscriptions)) {
            this.hubSubscriptions.forEach(sub => sub.unsubscribe());
        }
    }

    /**
     * This method should be overridden in your component to subscribe to the client functions
     * when a connection is established with your hub.
     * 
     * This method is called on ngOnInit and should not be called manually by your component.
     * Make sure you implement ngOnInit in your component and call super.ngOnInit() to make sure 
     * the connection subscriptions are handled correctly.
     */
    abstract handleHubConnection();

    handleHubConnectionLost() {
        this.signalRManager.connectionLost$.subscribe((err) => {
            this.hubSubscriptions.forEach(sub => {
                sub.unsubscribe();
            });
        });
    }
}
