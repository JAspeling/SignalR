import { Component, OnInit } from '@angular/core';
import { Messages, Message } from '../../../models/message';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    messages: Messages = [];
    constructor() { }

    ngOnInit() {
        for (let index = 0; index < 10; index++) {
            this.messages.push(new Message({ message: `test ${index + 1}`, mine: index === 0 }));

        }
    }

}
