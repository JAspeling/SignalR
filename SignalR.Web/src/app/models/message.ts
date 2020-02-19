export type Messages = Message[];

export class Message {
    constructor(init?: Partial<Message>) {
        Object.assign(this, init);
    }

    message: string;
    user: string;
    mine: boolean;
}