import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback/feedback.component';
import { SignalRModule } from '../../signalR.module';
import { ChatComponent } from './chat/chat.component';

@NgModule({
    declarations: [FeedbackComponent, ChatComponent],
    imports: [
        CommonModule,
        SignalRModule.forRoot(),
    ],
    exports: [
        FeedbackComponent,
        ChatComponent,
    ]
})
export class ComponentsModule { }
