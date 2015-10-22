(function(){

  angular
  .module('linguine.analysis')
  .controller('AnalysisNewController', AnalysisNewController);

  function AnalysisNewController($http, $scope, $state, $rootScope, flash) {
    $scope.preprocessingActive = true;
    $scope.analysisTypes = [
      {
        name: "Part of Speech Tagging",
        unfriendly_name: "pos_tag",
        description: "Uses the TextBlob tagger to generate Part-of-Speech tags for text."
      },
      {
        name: "Sentence Tokenizer",
        unfriendly_name: "sentence_tokenize",
        description: "Uses the NLTK sentence tokenizer to break a corpus up into sentences."
      },
      // {
      //   name: "Sentiment Analysis",
      //   unfriendly_name: "sentiment_analysis",
      //   description: "Uses the Stanford CoreNLP library to analyze a corpus and visualize the positivity or negativity of the text."
      // },
      {
        name: "Term Frequency - Inverse Document Frequency",
        unfriendly_name: "tfidf",
        description: "Uses the NLTK Punkt tokenizer to separate terms. Best applied to a large set of corpora. Useful for finding the most important words in the collection of words."
      },
      {
        name: "Topic Modeling",
        unfriendly_name: "topic_model",
        description: "Uses Gensim to detect and group the similar topics in a set of corpora."
      },
      {
        name: "Word Cloud Generator",
        unfriendly_name: "wordcloudop",
        description: "This operation is identical to TF-IDF when applied to a single corpus. Uses the NLTK Punkt tokenizer to separate terms. Used for finding the most frequent words a single corpus."
      }
    ];
    $scope.cleanupTypes = [
      {
        name: "Lemmatize",
        unfriendly_name: "lemmatize_wordnet",
        description: "Convert words to their lemmas using the NLTK WordNet Lemmatizer. E.g: Walk, walking, and walked will be converted to walk, and better and good would both be converted to good."
      },
      {
        name: "Remove Capitalization (greedy)",
        unfriendly_name: "removecapsgreedy",
        description: "Convert all uppercase letters to lowercase letters."
      },
      {
        name: "Remove Capitalization (NNP)",
        unfriendly_name: "removecapsnnp",
        description: "Convert uppercase letters to lowercase letters while leaving proper nouns capitalized, using TextBlob's Part-of-Speech tagger to identify proper nouns."
      },
      {
        name: "Stem (Porter)",
        unfriendly_name: "stem_porter",
        description: "Stem words using the NLTK Porter Stemmer. Converts inflected words in the corpus to their base form. This is a good general purpose stemmer to use."
      },
      {
        name: "Stem (Lancaster)",
        unfriendly_name: "stem_lancaster",
        description: "Stem words using the NLTK Lancaster Stemmer. Converts inflected words in the corpus to their base form."
      },
      {
        name: "Stem (Snowball)",
        unfriendly_name: "stem_snowball",
        description: "Stem words using the NLTK Snowball Stemmer. Converts inflected words in the corpus to their base form."
      },
      {
        name: "Remove Punctuation",
        unfriendly_name: "removepunct",
        description: "Remove all punctuation, using NLTK's Regexp tokenizer to scan the text for patterns of punctuation marks."
      }
    ]
    $scope.tokenizerTypes = [
      {
        name: "Word Tokenize (Penn Treebank)",
        unfriendly_name: "word_tokenize_treebank",
        description: "Separates the text in each corpus into individual word tokens, using NLTK's Penn Treebank tokenizer. This is a good general purpose tokenizer to use."
      },
      {
        name: "Word Tokenize (Whitespace and Punctuation)",
        unfriendly_name: "word_tokenize_whitespace_punct",
        description: "Separates the text in each corpus into individual word tokens, splitting on whitespace and punctuation marks."
      },
      // {
      //   name: "Word Tokenize (Stanford)",
      //   unfriendly_name: "word_tokenize_stanford",
      //   description: "Separates the text in each corpus into individual word tokens, using NLTK's Stanford tokenizer."
      // },
      {
        name: "Word Tokenize (Spaces)",
        unfriendly_name: "word_tokenize_spaces",
        description: "Separates the text in each corpus into individual word tokens, splitting on spaces."
      },
      {
        name: "Word Tokenize (Tabs)",
        unfriendly_name: "word_tokenize_tabs",
        description: "Separates the text in each corpus into individual word tokens, splitting on tabs."
      }
    ]
    $http.get('/api/corpora')
    .success(function (data) {
      $scope.corpora = data;
    });

    $scope.onCorpusClick = function (e) {
      e.corpus.active = !e.corpus.active;
    };

    $scope.onAnalysisClick = function (e) {
      $scope.selectedAnalysis = e.analysis;

      //re-enable the preprocessing tab once an analysis is clicked
      $scope.preprocessingActive = false;
    };

    $scope.onCleanupClick = function(e) {
      e.cleanup.active = !e.cleanup.active
    };
    $scope.onTokenizerClick = function(e) {
      $scope.selectedTokenizer = e.tokenizer;
    }
    $scope.onPreprocessingClick = function(e) {
      console.log("preprocessing clicked");
      console.log(e);

      if(!$scope.selectedAnalysis) {
        flash.danger.setMessage('Please select an analysis before selecting preprocessing options.');
        $rootScope.$emit("event:angularFlash");
      }
    }
    $scope.onCreateAnalysis = function () {
      try {
        var payload = {
          corpora_ids: _.pluck(_.where($scope.corpora, 'active'), '_id'),
          cleanup: _.map(_.where($scope.cleanupTypes, 'active'), function (cleanupType) {
            return cleanupType.unfriendly_name
          }),
          operation: $scope.selectedAnalysis.unfriendly_name,
          tokenizer: $scope.selectedTokenizer.unfriendly_name,
          library: "",
          transaction_id: "",
          user_id: ""
        };
        
        $http.post('/api/analysis', payload)
        .success(function (data) {
          $state.go('linguine.analysis.index');
        })
        .error(function (data) {
          flash.danger.setMessage('An error occurred while trying to create your analysis.');
          $rootScope.$emit("event:angularFlash");
          console.log(data);
        });
      } catch (error) {
        flash.danger.setMessage('There was a problem with your request.  Please review the options you have selected and try again.');
        $rootScope.$emit("event:angularFlash");
        console.log(error);
      }
    };
  }
})();
