![Build-Indicator](https://travis-ci.org/Pastafarians/linguine-node.svg?branch=master)

# linguine-node

## Overview
linguine-node is a Node.js web server for use in the Linguine natural language processing workbench. The server presents a client-facing web interface, which allows users to upload, view, tag, and analyze text files. It communicates with a Python server with JSON messages, and presents the results on-screen to the user.

## Adding an operation

To add a new analysis or cleanup operation to this project:

1. Add the operation to the correct list in assets/js/analysis/new.controller.js
2. Create a visualizeOperation() function for the operation in assets/js/analysis/show.controller.js
3. Add the operation as a case in the visualize() function in assets/js/analysis/show.controller.js

## Operation template

In assets/js/analysis/new.controller.js, add the operation into the analysisTypes, cleanupTypes, or tokenizerTypes list, depending on if the operation is an analysis, something to clean text, or something to tokenize the text into separate word tokens.

```javascript
{
  name: "Foo Bar",// The operation name to display to the user
  unfriendly_name: "foobar", // The name of the operation identifier used in the Python operation builder
  description: "A foo bar turns your text into a baz using a library." // A description of the operation to display to the user
}
```
Create a visualize function in assets/js/analysis/show.controller.js to display the results of the analysis operation.
```javascript
$scope.visualizeFoobar = function() {
  // DOM element #graph is the location on the page where visualizations can be placed
  // Results of the analysis operation can be accessed at $scope.analysis.result
}
```

Add the visualization to the list of cases in assets/js/analysis/show.controller.js.
```javascript
$scope.visualize = function () {
  if ($scope.analysis.analysis === "tfidf" ) {
    $scope.visualizeTfidf();
  } else if  ($scope.analysis.analysis == "wordcloudop") {
    $scope.visualizeWordcloud();
  }
}
```
## API

linguine-node assembles an HTTP request to send to the Python server. The request is assembled in routes/analysis.js. This is the template used for building the request.

```javascript
{
  "transaction_id": "transactionId", // An ID associated with the current request.
  "operation": "tfidf", // The analytic operation to be performed.
  "library": "nltk", // The library to use when executing the analysis.
  "corpora_ids": ["id1", "id2", "etc"] // The corpora ID's to run the analysis on.
  "user_id": "user1", // The user who requested the analysis.
  "cleanup": ["removeCapsGreedy","removePunct", "etc"] // The cleanup operations to perform on the text.
}
```

## Dependencies

* Node and npm
* MongoDB

## Development

1. `npm install`
2. `npm run ldap`
3. `bower install`
4. `gulp build` (Or `gulp` if you want watch enabled and unminified assets)
5. `npm start`

To run tests:

1. `npm install`
2. `bower install`
3. `npm test`

## Installation

### Ubuntu 14.04
All of these commands were run from the main directory of this project.  Some of them do not need to be run from there, but some do.  For the sake of making this easy, just run all of them from there.

#### Install nodejs
1. `sudo apt-get install nodejs`
2. `sudo apt-get install nodejs-legacy` (for a symlink from `node` -> `nodejs`)

#### Install npm
1. `sudo apt-get install npm`

#### Install mongodb
1. `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`
2. `echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list`
3. `sudo apt-get update`
4. `sudo apt-get install -y mongodb-org`
5. The service will not start right away because of a bug in the mongo config file that you will need to patch.  Run `sudo vim /etc/init/mongod.conf` and comment out the line that starts with `limit nofile` (it was line 9 for me).
6. Ensure that mongodb is running by issuing the command `service mongod status`.

Details for instructions taken from [here](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-14-04).

#### Set environment variable to development
1. `export NODE_ENV=developent`

#### Install bower
1. `sudo npm install -g bower`

#### Install gulp
1. `sudo npm install -g gulp`

#### Building and starting the service
1. `sudo npm install`
2. `bower install` You may have to change owners for your `configstore` directory since you cannot run `bower` as sudo.  If so, simply run `sudo chown -R username /home/username/.config/configstore`.
3. During bower install, you will be asked to choose a version of `angular`.  I chose option 1 for version 1.3.3 that was required by `linguine-node`.
4. `gulp build`
5. `npm start`
6. Navigate to http://localhost:3000 and you should finally see the site up and running!
