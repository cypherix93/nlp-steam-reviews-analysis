import {WorkerFactory} from "./WorkerFactory";
import _ = require("lodash");
import q = require("q");

export class WorkerCluster
{
    public static async splitWorkLoad(task:Function, payload:any[], workers?:number = 2)
    {
        var slaves = [];

        // Create workers
        for (let i = 0; i < workers; i++)
        {
            let worker = WorkerFactory.createWorkerWithTask(task);
            slaves.push(worker);
        }

        // Split payload up
        var chunkLength = payload.length / slaves;
        var chunks = _.chunk(payload, chunkLength);

        // Loop over all workers and start workload with promises
        var promises = [];
        for (let i = 0; i < slaves.length; i++)
        {
            let slave = slaves[i];
            let chunk = chunks[i];

            let def = q.defer();

            slave.onmessage = function (event)
            {
                def.resolve(event.data);
            };
            slave.postMessage(chunk);

            promises.push(def.promise);
        }

        // Wait on all the workers to finish
        var results = await Promise.all(promises);

        // Return the flattened list of results
        return _.flatten(results);
    }
}