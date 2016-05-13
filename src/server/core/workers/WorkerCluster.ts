import _ = require("lodash");
import q = require("q");

export class WorkerCluster
{
    public static async splitWorkLoad(task:Function, payload:any[], numWorkers:number = 2)
    {
        // Split payload up
        var chunkLength = (payload.length / numWorkers) + 1;
        var chunks = _.chunk(payload, chunkLength);

        console.log("Split work into: " + chunks.length);

        // Loop over all workers and start workload with promises
        var promises = [];
        for (let chunk of chunks)
        {
            let def = q.defer();

            task(chunk).then(data => def.resolve(data));

            promises.push(def.promise);
        }

        // Wait on all the workers to finish
        var results = await Promise.all(promises);

        // Return the flattened list of results
        return _.flatten(results);
    }
}