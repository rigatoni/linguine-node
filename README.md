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
2. `bower install`
3. `gulp build` (Or `gulp` if you want watch enabled and unminified assets)
4. `npm start`

To run tests:

1. `npm install`
2. `bower install`
3. `npm test`
