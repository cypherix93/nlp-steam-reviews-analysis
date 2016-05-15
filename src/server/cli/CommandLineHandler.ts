export class CommandLineHandler
{
    public static printWelcomeText()
    {
        console.log();
        console.log("Welcome to the Syntactic Parsing playground for CSE 390");
        console.log("---------------------------------------------------------");
    }

    public static printHelpText()
    {
        console.log();
        console.log("Available commands:");
        console.log("---------------------------------------------------------");
        console.log(CommandLineHandler.writeHelpLine("help", "Print this help text"));
        console.log();
        console.log(CommandLineHandler.writeHelpLine("train", "Train on all games we have scraped"));
        console.log(CommandLineHandler.writeHelpLine("test <appId>", "Test system on the game provided", 3));
        console.log();
        console.log(CommandLineHandler.writeHelpLine("exit", "Exit Application"));
        console.log();
    }

    private static writeHelpLine(command, text, tabs?)
    {
        tabs = tabs || 4;

        var tabsString = (function ()
        {
            var s = "";
            for (let i = 0; i < tabs; i++)
            {
                s += "\t";
            }
            return s;
        })();

        return command + tabsString + text;
    };
}