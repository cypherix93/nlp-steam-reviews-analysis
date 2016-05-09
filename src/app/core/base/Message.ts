export class Message
{
    public channel:string;
    public listener:(...args:any[]) => any;

    constructor(channel:string, listener?:(...args:any[]) => any)
    {
        this.channel = channel;
        this.listener = listener;
    }
}