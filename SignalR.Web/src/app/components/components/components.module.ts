import './../../prototypes/string';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FeedbackComponent } from './feedback/feedback.component';
import { SignalRModule } from '../../signalR.module';
import { ChatComponent } from './chat/chat.component';
import { MentionModule } from 'angular-mentions';

@NgModule({
    declarations: [FeedbackComponent, ChatComponent],
    imports: [
        MentionModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SignalRModule.forRoot(),
    ],
    exports: [
        FeedbackComponent,
        ChatComponent,
    ]
})
export class ComponentsModule { }
