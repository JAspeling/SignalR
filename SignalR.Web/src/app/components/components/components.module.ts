import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback/feedback.component';
import { SignalRModule } from '../../signalR.module';

@NgModule({
    declarations: [FeedbackComponent],
    imports: [
        CommonModule,
        SignalRModule.forRoot(),
    ],
    exports: [
        FeedbackComponent
    ]
})
export class ComponentsModule { }
