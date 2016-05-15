const readlineSync = require("readline-sync");
import {CommandLineHandler} from "./cli/CommandLineHandler";
import {TurneyHandler} from "./cli/TurneyHandler";

export class CommandLine
{
    public static main()
    {
        var readline = readlineSync as any;

        // Print welcome text
        CommandLineHandler.printWelcomeText();

        // Print help text
        CommandLineHandler.printHelpText();

        // Start shell
        readline.promptCLLoop(
            {
                help: CommandLineHandler.printHelpText,

                train: TurneyHandler.train,
                test: TurneyHandler.test,
                accuracy: TurneyHandler.computeAccuracy,

                exit: CommandLine.exit
            });
    }

    private static exit()
    {
        console.log("\nGoodbye!\n");
        return true;
    }
}

CommandLine.main();