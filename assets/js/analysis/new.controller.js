(function(){
 
  angular
  .module('linguine.analysis')
  .controller('AnalysisNewController', AnalysisNewController);

  function AnalysisNewController($http, $scope, $state, $rootScope, flash, usSpinnerService) {
    $scope.analysisNotSelected = true;
    $scope.needTokenizer = true; 
    $scope.analysis = {analysisName: ""};
    $scope.preprocAvailable = true;

    /*
     * Analyses are the crux of the NLP workflow, so they should be 
     * chosen before anything else. Analysis can be run on either
     * a single corpus or an entire corpora. Rach analysis can also have
     * tokenization tasks and specific cleanup tasks bound to them, represented
     * by the tokenizerTypes and cleanupTypes objects.
     */
    $scope.analysisTypes = [
      {
        name: "Term Frequency Analysis",
        unfriendly_name: "wordcloudop",
        description: "This operation uses the NLTK Punkt tokenizer to separate terms. Used for finding the most frequent words a single corpus.",
        multipleCorporaAllowed: false,
        tokenAllowed: true,
        tokenizerRequired: true
      },
      {
        name: "Part of Speech Tagging (Stanford CoreNLP)",
        unfriendly_name: "nlp-pos",
        description: "This operation performs a part of speech analysis on each word provided in the corpus. Each word will receive an identifier which represents the appropriate part of speech for the given word. ",
        multipleCorporaAllowed: false,
        tokenAllowed: false,
        tokenizerRequired: false
      },
      {
        name: "Named Entity Recognition (Stanford CoreNLP)",
        unfriendly_name: "nlp-ner",
        description: "This operation will classify each word in the corpus based on its status as a place, organization, location, or expression of time. If a term does not match as a named entity, it will recieve a status of '0' ", 
        tokenAllowed: false,
        multipleCorporaAllowed: false,
        tokenizerRequired: false
      },
      {
        name: "Sentiment (Stanford CoreNLP)",
        unfriendly_name: "nlp-sentiment",
        description: "This operation will measure the sentiment of the corpus, sentences, and tokens using models provided by Stanford Core NLP.",
        tokenAllowed: false,
        multipleCorporaAllowed: false,
        tokenizerRequired: false
      }
    ];
    
    /*
     * Object to keep track of all cleanup tasks that
     * are available to pass back to the Python server. The keys
     * are the unfriendly names of each cleanup task so that they
     * can be bound to each analysis in the cleanupTypes object
     */
    var cleanups = {
      "stem_porter": {
        name: "Stem (Porter)",
        unfriendly_name: "stem_porter",
        description: "Stem words using the NLTK Porter Stemmer. Converts inflected words in the corpus to their base form. This is a good general purpose stemmer to use."
      },
      "removecapsnnp": {
        name: "Remove Capitalization (NNP)",
        unfriendly_name: "removecapsnnp",
        description: "Convert uppercase letters to lowercase letters while leaving proper nouns capitalized, using TextBlob's Part-of-Speech tagger to identify proper nouns."
      },
      "removepunct": {
        name: "Remove Punctuation",
        unfriendly_name: "removepunct",
        description: "Remove all punctuation, using NLTK's Regexp tokenizer to scan the text for patterns of punctuation marks."
      }
    };
    
    /*
     * for each unfriendly_name of an analysis, there is a set of cleanup tasks
     * that are deemed applicable. 
     * This object is used to list all cleanup tasks relevant to each analysis on the view.
     *
     * Key[analysisUnfriendlyName] => value [cleanupUnfriendlyName1, unfriendlyName2, ... n]
     */
    $scope.cleanupTypes = {
      "pos_tag": [cleanups.stem_porter, cleanups.removecapsnnp, cleanups.removepunct ],
      "wordcloudop": [cleanups.stem_porter, cleanups.removecapsnnp, cleanups.removepunct ],
      "nlp-pos": [],
      "nlp-ner": [],
      "nlp-sentiment": []
    };
    
    $scope.tokenizerTypes = [
      {
        name: "Word Tokenize (Penn Treebank)",
        unfriendly_name: "word_tokenize_treebank",
        description: "Separates the text in each corpus into individual word tokens, using NLTK's Penn Treebank tokenizer. This is a good general purpose tokenizer to use."
      },
    ];

    $http.get('api/corpora')
    .success(function (data) {
      $scope.corpora = data;
    });
    
    /*
     * Determine if the selected analysis can either accept
     * a single corpora or multiple, and handle
     * the selection appropriately. 
     */ 
    $scope.onCorpusClick = function (e) {
      var activeCount = 0;
      var activeCorpora = [];
      
      //Keep track of the corpora that are currently active
      $scope.corpora.forEach(function(corpora) {
        if(corpora.active){
          activeCount++; 
          activeCorpora.push(corpora);
        }
      });
      
      //User selects a corpora when one is already selected
      //and analysis can only accept 1 corpora
      if(!e.corpus.active && activeCount == 1  && !$scope.selectedAnalysis.multipleCorporaAllowed) {
        e.corpus.active = true;
        //Disable previous corpora
        activeCorpora[0].active = false; 
      }
      //Any other case, user can de-select or select multiple
      else {
        e.corpus.active = !e.corpus.active;
      }
    };

    $scope.onAnalysisClick = function (e) {
      $scope.selectedAnalysis = e.analysis;
      $scope.analysis.analysisName = e.analysis.name;

      //re-enable the preprocessing tab once an analysis is clicked
      $scope.analysisNotSelected = false;
    };

    $scope.onCleanupClick = function(e) {
      e.cleanup.active = !e.cleanup.active;
    };

    $scope.onTokenizerClick = function(e) {
      $scope.selectedTokenizer = e.tokenizer;
      $scope.needTokenizer = false;
    };
    
    $scope.checkIfNoPreprocessingAvailable = function() {
      var analysisName = $scope.selectedAnalysis.unfriendly_name;
      var noCleanupTypes = $scope.cleanupTypes[analysisName].length == 0; 

      if(noCleanupTypes && !$scope.selectedAnalysis.tokenAllowed) {
          flash.info.setMessage("No preprocessing options are available for " +            $scope.selectedAnalysis.name);
          $rootScope.$emit("event:angularFlash");
      }
    }

    $scope.onPreprocessingTabClick = function(e) {
      if(!$scope.selectedAnalysis) {
        flash.danger.setMessage('Please select an analysis before selecting preprocessing options.');
        $rootScope.$emit("event:angularFlash");
      }
      $scope.checkIfNoPreprocessingAvailable();
    };

    $scope.onCorporaTabClick = function(e) {
      //Reset the corpora selected if we've chosen an analysis
      //that can only accept one corpora
      var activeCount = 0;
      $scope.corpora.forEach(function(corpus) {
        if(corpus.active === true) {
          activeCount++; 
        }
      });

      if(activeCount > 1) {
        //flush the list of selected corpora 
        $scope.corpora.forEach(function(corpus) {
          if(corpus.active) {
            corpus.active = false; 
          }
        });
        //Display a message to the user that corpora has been cleared
        flash.info.setMessage($scope.selectedAnalysis.name + "Cannot be used with multiple" + 
        " corpora. Please choose a new corpora.");

        $rootScope.$emit("event:angularFlash");
        
      }
      
      if(!$scope.selectedAnalysis) {
        flash.danger.setMessage('Please select an analysis before selecting corpora.');
        $rootScope.$emit("event:angularFlash");
      }
    };

    $scope.onCreateAnalysis = function () {
     
      if($scope.needTokenizer && $scope.selectedAnalysis.tokenizerRequired) {
        flash.info.setMessage('The selected analysis requires a tokenizer to complete.');
        $rootScope.$emit("event:angularFlash");
        return;
      }
      
      var numActive = 0;
      $scope.corpora.forEach(function(corpora) {
        if(corpora.active){numActive++;}
      });

      if(numActive == 0) {
        flash.info.setMessage('Please select a corpora before continuing.');
        $rootScope.$emit("event:angularFlash");
        return;
      }

      try {

        usSpinnerService.spin('analysisProcSpinner');

        var payload = {
          corpora_ids: _.pluck(_.where($scope.corpora, 'active'), '_id'),
          cleanup: _.map(_.where($scope.cleanupTypes[$scope.selectedAnalysis.unfriendly_name], 'active'), function (cleanupType) {
            return cleanupType.unfriendly_name;
          }),
          operation: $scope.selectedAnalysis.unfriendly_name,
          tokenizer: $scope.selectedTokenizer? $scope.selectedTokenizer.unfriendly_name: "",
          library: "",
          transaction_id: "",
          analysis_name: $scope.analysis.analysisName,
          user_id: ""
        };

        $http.post('api/analysis', payload)
        .success(function (data) {
          usSpinnerService.stop('analysisProcSpinner');
          $state.go('linguine.analysis.index');
        })
        .error(function (data) {
          usSpinnerService.stop('analysisProcSpinner');
          flash.danger.setMessage('An error occurred while trying to create your analysis.');
          $rootScope.$emit("event:angularFlash");
        });
      } catch (error) {
        usSpinnerService.stop('analysisProcSpinner');
        flash.danger.setMessage('There was a problem with your request.  Please review the options you have selected and try again.');
        $rootScope.$emit("event:angularFlash");
      }
    };
  }
})();
