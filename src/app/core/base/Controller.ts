import {Message} from "./Message";

const {ipcMain} = require("electron");

export class Controller
{
    protected messages:Message[];

    constructor()
    {
        this.messages = [];
    }

    protected initSelf(instance)
    {
        var controllerName = instance.constructor.name.replace(/Controller/g, "").toLowerCase();
        var proto = Object.getPrototypeOf(instance);

        for (let key of Object.getOwnPropertyNames(proto))
        {
            // If this is the constructor, don't do anything
            if (key === "constructor")
                continue;

            // If this is not a function, don't do anything
            if (typeof instance[key] !== "function")
                continue;

            // Otherwise, add the function as a message
            let message = new Message(controllerName + "/" + key, instance[key]);
            this.messages.push(message);
        }

        // Then init the events
        this.initEvents();
    }

    private initEvents()
    {
        // Loop through all the messages and hook up the events
        for (let message of this.messages)
        {
            console.log(message);

            ipcMain.on(message.channel, (event:Event, ...args:any[]) =>
            {
                event.returnValue = message.listener(args);
            });
        }
    }
}