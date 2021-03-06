import {CommandLineHandler} from "./cli/CommandLineHandler";
import {TurneyHandler} from "./cli/TurneyHandler";

export class CommandLine
{
    public static async main()
    {
        var command = process.argv[2];
        var arg = process.argv[3];

        switch(command)
        {
            case "--help":
                CommandLineHandler.printHelpText();
                break;
            case "--train":
                await TurneyHandler.train();
                break;
            case "--test":
                await TurneyHandler.test(arg);
                break;
            case "--accuracy":
                await TurneyHandler.computeAccuracy(arg);
                break;
            case "--update":
                await TurneyHandler.updateGame(arg);
                break;
        }
    }
}

CommandLine.main()
    .then(() => process.exit(0))
    .catch(err =>
    {
        console.error(err);
        process.exit(1);
    });