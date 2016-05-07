/// <reference path="../../typings/main.d.ts" />

import express = require("express");

import {Config} from "./core/config/Config";

// Initialize Config for the current environment
Config.init(process.env.NODE_ENV = process.env.NODE_ENV || "development");

export class ElectronApp
{
    public static electron = require("electron");
    private static electronApp = ElectronApp.electron.app;

    public static mainWindow;

    public static main()
    {
        // Bootstrap the application and couple the middlewares
        ElectronApp.init();

        // Start up the server
        console.log("=> Starting Electron...");
    }

    public static init()
    {
        console.log("=> Bootstrapping application...");

        ElectronApp.initWindowEvents();
    }

    private static createMainWindow()
    {
        const BrowserWindow = ElectronApp.electron.BrowserWindow;

        var mainWindow = ElectronApp.mainWindow;

        // Create the browser window.
        mainWindow = new BrowserWindow({width: 800, height: 600});

        // and load the index.html of the app.
        mainWindow.loadURL("file://" + Config.current.rootPath + "/ui/index.html");

        console.log(Config.current.rootPath + "/ui/index.html");

        // Open the DevTools.
        mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        mainWindow.on('closed', function ()
        {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null
        });
    }

    private static initWindowEvents()
    {
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        ElectronApp.electronApp.on("ready", ElectronApp.createMainWindow);

        // Quit when all windows are closed.
        ElectronApp.electronApp.on("window-all-closed", function ()
        {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== "darwin")
            {
                ElectronApp.electronApp.quit();
            }
        });

        ElectronApp.electronApp.on('activate', function ()
        {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (ElectronApp.mainWindow === null)
            {
                ElectronApp.createMainWindow();
            }
        });
    }
}

// Start app
ElectronApp.main();