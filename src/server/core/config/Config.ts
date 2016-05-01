import path = require("path");

export class Config
{
    private static rootPath = path.normalize(__dirname + "/../..");

    private static appConfig = {
        development: {
            rootPath: Config.rootPath,
            port: 36103,
            cors: {
                origin: "http://localhost:22139",
                credentials: true 
            }
        }
    };

    public static current;

    public static init(env)
    {
        Config.current = Config.appConfig[env];
    }
}