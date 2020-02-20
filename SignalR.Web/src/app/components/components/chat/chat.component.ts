import { Component, OnInit } from '@angular/core';
import { Messages, Message } from '../../../models/message';
import { isNullOrUndefined } from 'util';
import { SignalRService } from '../../../services/signalr-service';
import { NotificationHubMessage } from '../../../models/notification-hub-message';
import { NameService } from '../../../services/name-service';
import { INotificationHub } from '../../../interfaces/notification-hub.interface';
import { SignalRConnectionManager } from '../../../services/signalr-connection-manager-service';
import { NotificationHub } from '../../../hubs/notification-hub';
import { HubNotification } from '../../../models/hub-notification';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
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

    connected: boolean = false;

    constructor(private readonly signalR: SignalRService,
        private readonly connectionManager: SignalRConnectionManager,
        private readonly nameService: NameService) { }

    ngOnInit() {
        this.signalR.notificationHub$.subscribe((hub: INotificationHub) => {
            this.notificationHub = hub;
            this.subscribeToHubMethods();
        });

        this.connectionManager.connectionLost$.subscribe(hub => {
            if (hub instanceof NotificationHub) {
                this.connected = false;
            }
        });

        this.connectionManager.connectionEstablished$.subscribe(hub => {
            if (hub instanceof NotificationHub) {
                this.connected = true;
            }
        })
    }

    private subscribeToHubMethods() {
        this.currentUser = this.nameService.name;

        this.notificationHub.registerSendMessage().subscribe((message: NotificationHubMessage) => {
            this.messages.push(new Message({ user: message.userName, message: message.message }));
        });

        this.notificationHub.registerNotify().subscribe((notification: HubNotification) => {
            this.messages.push(new Message({ user: notification.originatingUser, message: notification.message, info: true }));
        });
    }

    public sendMessage(): void {
        if (this.connected && !isNullOrUndefined(this.message) && this.message !== '') {

            if (this.containsGroups()) {
                var groups = this.joinedGroups.filter(g => this.message.contains(g.name)).map(g => g.name);
                this.notificationHub.sendGroupsMessage(groups, this.message);
            } else {
                this.notificationHub.sendMessage(this.message);
            }
            
            this.messages.push(new Message({ message: this.message, user: 'You', mine: true }));
            this.message = '';

            ($('#input')[0] as HTMLInputElement).focus();
        }
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
}
