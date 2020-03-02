import { Component, OnInit } from '@angular/core';
import { Messages, Message } from '../../../models/message';
import { isNullOrUndefined } from 'util';
import { SignalRService } from '../../../services/signalr-service';
import { HubMessage } from '../../../models/notification-hub-message';
import { NameService } from '../../../services/name-service';
import { INotificationHub } from '../../../interfaces/notification-hub.interface';
import { SignalRConnectionManager } from '../../../services/signalr-connection-manager-service';
import { NotificationHub } from '../../../hubs/notification-hub';
import { HubNotification } from '../../../models/hub-notification';
import { HubComponent } from '../../../hubs/hub-component';
import { IGreeterHub } from '../../../interfaces/greeter-hub.interface';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends HubComponent {
    messages: Messages = [];
    message: string;
    currentUser: string;

    groups: { name: string, joined: boolean }[] = [
        { name: 'Admins', joined: false },
        { name: 'Debt', joined: false },
        { name: 'Working Capital', joined: false },
        { name: 'Trade', joined: false },
    ]

    get joinedGroups(): { name: string, joined: boolean }[] {
        return this.groups.filter(g => g.joined);
    }
    notificationHub: INotificationHub;
    greeterHub: IGreeterHub;

    connected: boolean = false;

    constructor(private readonly signalR: SignalRService,
        private readonly connectionManager: SignalRConnectionManager,
        private readonly nameService: NameService) {
        super(connectionManager)
    }

    ngOnInit() {
        super.ngOnInit();
        this.currentUser = this.nameService.name;
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    public handleHubConnection() {
        this.signalR.notificationHub$.subscribe((hub: INotificationHub) => {
            this.connected = true;
            this.notificationHub = hub;
            this.subscribeToNotificationHubMethods();
        });

        this.signalR.greeterHub$.subscribe((hub: IGreeterHub) => {
            this.greeterHub = hub;
            this.subscribeToGreeterHubMethods();
        })
    }

    public handleHubConnectionLost() {
        this.connectionManager.connectionLost$.subscribe(hub => {
            if (hub instanceof NotificationHub) {
                this.connected = false;
            }
        });
    }

    private subscribeToNotificationHubMethods() {
        this.subscribeToSendMessage();
        this.subscribeToNotify();
    }

    private subscribeToGreeterHubMethods() {
        this.subscribeToGreet();
    }

    private subscribeToGreet() {
        this.greeterHub.registerGreet().subscribe((user: string) => {
            this.messages.push(new Message({ user: user, message: 'Hello! I Just joined the chat.', info: true }));
        });
    }

    private subscribeToNotify() {
        this.hubSubscriptions.push(
            this.notificationHub.registerNotify().subscribe((notification: HubNotification) => {
                this.messages.push(new Message({ user: notification.originatingUser, message: notification.message, info: true }));
            })
        );
    }

    private subscribeToSendMessage() {
        this.hubSubscriptions.push(this.notificationHub.registerSendMessage().subscribe((message: HubMessage) => {
            this.messages.push(new Message({
                groups: message.groups ? message.groups.filter(g => this.joinedGroups.map(g => g.name).indexOf(g) !== -1) : [],
                user: message.userName, message: message.message
            }));
        }));
    }

    public sendMessage(): void {
        if (this.connected && !isNullOrUndefined(this.message) && this.message !== '') {

            if (this.containsGroups()) {
                var groups = this.joinedGroups.filter(g => this.message.contains(g.name)).map(g => g.name);
                this.removeGroups()
                this.notificationHub.sendGroupsMessage(groups, this.message);
            } else {
                this.notificationHub.sendMessage(this.message);
            }

            this.messages.push(new Message({ message: this.message, user: 'You', mine: true }));
            this.message = '';

            ($('#input')[0] as HTMLInputElement).focus();
        }
    }

    private removeGroups() {
        this.joinedGroups.forEach(g => {
            this.message = this.message.replaceAll(`@${g.name}`, '');
        })
    }

    private containsGroups(): boolean {
        return this.joinedGroups.length > 0 && this.message.containsOneOf(this.joinedGroups.map(g => `@${g.name}`));
    }

    public toggleGroup(group: { name: string, joined: boolean }): void {
        group.joined = !group.joined;

        if (group.joined) {
            this.notificationHub.joinGroup(group.name);
            this.messages.push(new Message({ message: `Joined ${group.name}`, info: true, user: 'You' }));
        } else {
            this.notificationHub.leaveGroup(group.name);
            this.messages.push(new Message({ message: `Left ${group.name}`, info: true, user: 'You' }));
        }
    }

    public trackByFn(index: number): number {
        return index;
    }

}
