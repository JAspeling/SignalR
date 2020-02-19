import { Component, OnInit } from '@angular/core';
import { Messages, Message } from '../../../models/message';
import { isNullOrUndefined } from 'util';
import { SignalRService } from '../../../services/signalr-service';
import { NotificationHubMessage } from '../../../models/notification-hub-message';
import { NameService } from '../../../services/name-service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    messages: Messages = [];
    message: string;
    currentUser: string;

    constructor(private readonly signalR: SignalRService, private readonly nameService: NameService) { }

    ngOnInit() {
        if (isNullOrUndefined(this.signalR.notificationHub)) {
            this.signalR.notificationHubReady$.subscribe(() => {
                this.subscribeToHubMethods();
            })
        } else {
            this.subscribeToHubMethods();
        }
    }

    private subscribeToHubMethods() {
        this.currentUser = this.nameService.name;
        
        this.signalR.notificationHub.registerSendMessage().subscribe((message: NotificationHubMessage) => {
            this.messages.push(new Message({ user: message.userName, message: message.message }));
        });

        this.signalR.notificationHub.registerNotify().subscribe((message: string) => {
            this.messages.push(new Message({ message: message, info: true }));
        });
    }

    public sendMessage(): void {
        if (!isNullOrUndefined(this.message)) {
            this.signalR.notificationHub.sendMessage(this.message);
            this.messages.push(new Message({ message: this.message, mine: true }));
        }
    }
}
