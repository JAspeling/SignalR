export type Messages = Message[];

export class Message {
    constructor(init?: Partial<Message>) {
        Object.assign(this, init);
    }

    groups: string[];
    message: string;
    user: string;
    mine: boolean;
    info: boolean;
}