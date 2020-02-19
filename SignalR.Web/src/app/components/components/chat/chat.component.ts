import { Component, OnInit } from '@angular/core';
import { Messages, Message } from '../../../models/message';
import { isNullOrUndefined } from 'util';
import { SignalRService } from '../../../services/signalr-service';
import { NotificationHubMessage } from '../../../models/notification-hub-message';
import { NameService } from '../../../services/name-service';
import { INotificationHub } from '../../../interfaces/notification-hub.interface';

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
    notificationHub: INotificationHub;

    constructor(private readonly signalR: SignalRService, private readonly nameService: NameService) { }

    ngOnInit() {
        this.signalR.notificationHub$.subscribe((hub: INotificationHub) => {
            this.notificationHub = hub; 
            this.subscribeToHubMethods();
        });
        
        // if (isNullOrUndefined(this.signalR.notificationHub)) {
        //     this.signalR.notificationHubReady$.subscribe(() => {
        //         this.subscribeToHubMethods();
        //     })
        // } else {
        //     this.subscribeToHubMethods();
        // }
    }

    private subscribeToHubMethods() {
        this.currentUser = this.nameService.name;

        this.notificationHub.registerSendMessage().subscribe((message: NotificationHubMessage) => {
            this.messages.push(new Message({ user: message.userName, message: message.message }));
        });

        this.notificationHub.registerNotify().subscribe((message: string) => {
            this.messages.push(new Message({ message: message, info: true }));
        });
    }

    public sendMessage(): void {
        if (!isNullOrUndefined(this.message)) {
            this.notificationHub.sendMessage(this.message);
            this.messages.push(new Message({ message: this.message, user: 'You', mine: true }));
        }
    }

    public toggleGroup(group: { name: string, joined: boolean }): void {
        group.joined = !group.joined;
    }
}
