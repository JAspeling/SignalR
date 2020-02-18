export class HubEvent {
    constructor(init?: Partial<HubEvent>) {
        Object.assign(this, init);
    }

    timestamp: Date = new Date(Date.now());
    message: string;
}
