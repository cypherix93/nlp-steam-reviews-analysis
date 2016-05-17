# Sentiment Analysis - Steam Reviews
---

*Note:* For an in depth description of the project please check out our [Project Report](https://github.com/cypherix93/nlp-steam-reviews-analysis/blob/master/docs/Report.pdf).


## Initial Steps

You will need to have [Node](https://nodejs.org/en/) installed to be able to run anything. We used Node 6.1.0 for our project. You will also need [MongoDB](https://www.mongodb.com/) since that is our database.

After you have installed Node, you will need to open a terminal and type in the following command:

`npm install -g gulp http-server`

This will install the necessary packages to build our application. After this has completed, navigate to the directory where you have extracted the project to and type in the following command into the terminal to build our project:

`gulp`

Gulp will take a few seconds and build the entire project. The built files will be in the build directory, from which you can run different parts of the app.

## Getting the Data

The dump of our MongoDB is uploaded at [Dropbox](https://www.dropbox.com/s/6nqpznfmni8obvk/nlp-steam-reviews-analysis.zip?dl=0) and [Google Drive](https://drive.google.com/open?id=0B2xohzERH7kOME1sX2dZM1FOQTA). Download either one and type in the following command to migrate the data to your local MongoDB server:

Start MongoDB using:

`mongod`

Then upload our data into your MongoDB:

`mongorestore -d nlp-steam-reviews-analysis /path/to/the/extracted/data`

MongoDB will take a while to upload the data to your local server.


## How to Run

### Server

Navigate to the root directory of the project. Then type in the following command to start our server:

`node ./build/server/Server.js`

You should see the terminal output something like this:

	=> Bootstrapping application...
	=> Setting up Routes...
	=> Starting Server...

	Magic is happening at http://localhost:31363

*Note: Don't try to navigate to that URL in the browser, because our server is merely a JSON API and does not have a UI by default. That's where the Client comes in.*

### Client

Navigate to the root directory of the project. Then type in the following command to start our client:

`http-server -p 32363 ./build/client`

You should see the terminal output something like this:

	Starting up http-server, serving ./client
	Available on:
	  http:192.168.1.119:32363
	  http:169.254.172.77:32363
	  http:169.254.57.221:32363
	  http:127.0.0.1:32363
	Hit CTRL-C to stop the server

*Note: The PORT that you specify to http-server is IMPORTANT because our server is setup to only respond to the URL http://localhost:32363 due to security concerns. For more information on CORS, [click here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).*

### Command Line

We also have a command line interface which allows the developer to perform system specific things like training, testing, evaluating and updating game stats.

Navigate to the root directory of the project. Then type in the following commands to start our CLI to do specific tasks:

#### Train
`node ./build/server/CommandLine.js --train`

*Warning: SLOW.*

#### Test
`node ./build/server/CommandLine.js --test [appId]`

*Note: If you don't provide AppID, it will test ALL the games. Warning: SLOW.*

#### Evaluate
`node ./build/server/CommandLine.js --accuracy [appId]`

*Note: If you don't provide AppID, it will evaluate ALL the games. Warning: SLOW.*

#### Update Stats
`node ./build/server/CommandLine.js --update [appId]`

*Note: If you don't provide AppID, it will update stats for ALL the games. Warning: SLOW.*

---
