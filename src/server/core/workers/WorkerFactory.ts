const Worker = require('webworker-threads').Worker as any;

export class WorkerFactory
{
    public static createWorkerWithTask(task:Function)
    {
        var worker = new Worker(function ()
        {
            this.onmessage = function (event)
            {
                var message = task(event.data);
                postMessage(message, this.thread.id);
            }
        });

        return worker;
    }
}