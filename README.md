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
	"corpora_ids": ["12345"], //Collection of corpora to pipe into analysis
	"cleanup": ['stopwords'], //Cleanup steps to add
	"operation": "nlp-relation", //Type of analysis to be preformed
	"tokenizer": "", //Tokenizer used (if required)
	"library": "", //Library associated w/ analysis (if required)
	"transaction_id": "", (Field to be populated by linguine-python)
	"analysis_name": "Relation Extraction (Stanford CoreNLP)", //Name to display in text fields
	"time_created": 1461342250445, //Used to calculate ETA of analyses
	"user_id": "12345" //Unique identifier of user who created analysis
}
```

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

#### Set environment variable to development
1. `export NODE_ENV=developent`

#### Install bower
1. `sudo npm install -g bower`

#### Install gulp
1. `sudo npm install -g gulp`

#### Building and starting the service
1. `npm install`
2. `bower install`
3. During bower install, you may be asked to choose a version of `angular`.  choose the version required by `linguine-node`.
4. `gulp build`
5. `npm start`
6. Navigate to http://localhost:3000 and you should finally see the site up and running!
