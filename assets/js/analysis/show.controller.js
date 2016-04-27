(function(){

  angular
  .module('linguine.analysis')
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
  }])
  .controller('AnalysisShowController', AnalysisShowController);

  function AnalysisShowController ($http, $scope, $state, $stateParams, $window) {

    $scope.sentenceIndex = 0;
    $scope.corefEntities = [];

    $scope.setSentence = function(index) {
        if(index != $scope.sentenceIndex) {
            $scope.sentenceIndex = index;
            $scope.sentenceData = $scope.analysis.result.sentences[$scope.sentenceIndex];
            $scope.sentimentTreeData = $scope.analysis.result.sentences[$scope.sentenceIndex].sentiment_json;
            $scope.depsTreeData = $scope.analysis.result.sentences[$scope.sentenceIndex].deps_json;
            $scope.visualize();
        }
    };

    $scope.back = function () {
      $window.history.back();
    };

    $http.get('api/analysis/' + $stateParams.id)
    .success(function (data) {
      $scope.analysis = data;
      var blob = new Blob([JSON.stringify(data.result)], {type: 'text/plain'});
      var url = $window.URL || $window.webkitURL;
      $scope.fileUrl = url.createObjectURL(blob);
      $scope.defaultView();
      $scope.visualize();
    });

    $http.get('api/corpora')
    .success(function (data) {
      $scope.corpora = data;
    });

    $scope.delete = function () {
      $http.delete('api/analysis/' + $stateParams.id)
      .success(function (data) {
        $state.go('linguine.analysis.index')
      })
      .error(function (data) {
        flash.danger.setMessage("An error occured.");
      })
    };

    $scope.findCorpus = function (id) {
      return _.find($scope.corpora, {'_id': id});
    };

    $scope.joinTokens = function(tokens) {
      var tokenString = '';
      var tokenStringLength = tokens.length < 20? tokens.length : 20;

      for(var i = 0; i < tokenStringLength; i++) {
        tokenString += ' ' + tokens[i].token;     
      }

      tokenString += tokens.length >= 20? '...' : '';
      return tokenString;
    }

    $scope.showTimeCreated = function(analysis) {
      var d = new Date(analysis.time_created); 
      return d.toLocaleDateString() + " " + d.toLocaleTimeString()
    };

    $scope.defaultView = function() {
      $scope.results = angular.copy($scope.analysis.result);
        
      $scope.sentenceData = $scope.analysis.result.sentences[$scope.sentenceIndex];
      $scope.sentimentTreeData = $scope.analysis.result.sentences[$scope.sentenceIndex].sentiment_json;
      $scope.depsTreeData = $scope.analysis.result.sentences[$scope.sentenceIndex].deps_json;

      for(var i = 0; i < $scope.results.length; i++) {
        $scope.results[i].deps_json = []; 
        $scope.results[i].sentiment_json = []; 
      }

      // create the editor

      var container = document.getElementById("jsoneditor");
      var editor = new JSONEditor(container);
      editor.set($scope.results);

      //The JSON viewer 'expand all' operation is too intensive on large analyses
      var expandBtn = document.getElementsByClassName('expand-all')[0];
      expandBtn.parentNode.removeChild(expandBtn);

    };

    $scope.getText = function(id)
    {
       var temp = {};
       var defer = $q.defer();
       $http.get('api/corpora/' + id).success(function(data){
          temp = data.contents;
          defer.resolve(data.contents);

       });
       return defer.promise;
    };
    $scope.visualizeTfidf = function() {
      var diameter = 100,
        format = d3.format(".3"),
          color = d3.scale.category20c()
          shift = 0.1;

          var bubble = d3.layout.pack().sort(null).size([diameter, diameter]).padding(1.5),
            svg = d3.select("#graph").append("svg").attr("class", "bubble").attr("viewBox", "0 0 100 100");

            var node = svg.selectAll(".node")
            .data(bubble.nodes(classes())
                  .filter(function(d) { return !d.children; }))
                  .enter().append("g")
                  .attr("class", "node")
                  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                  node.append("title")
                  .text(function(d) { return d.className + ": " + format(d.value - shift); });

                  node.append("circle")
                  .attr("r", function(d) { return d.r; })
                  // Should really do this:
                  // .style("fill", function(d) { return color(d.packageName); });
                  .style("fill", "#F36E21");

                  node.append("text")
                  .attr("dy", ".3em")
                  .style("text-anchor", "middle")
                  .attr("fill", "white")
                  .attr("font-size", function (d) {
                    return ((0.2 * d.className.length) + (0.5 * d.r)) + "px";
                  })
                  .text(function(d) { return d.className; });

                  // Returns a flattened hierarchy containing all leaf nodes under the root.
                  function classes() {
                    var classes = [];
                    $scope.analysis.result.sentences.forEach(function (node) {
                      var scalar;
                      scalar = Math.log(Math.abs(node.importance))*-1;

                      classes.push({packageName: "", className: node.term, value: scalar + shift});
                    });
                    return {children: classes};
                  }

                  d3.select(self.frameElement).style("height", diameter + "px");
    };

    $scope.visualizeWordcloud = function() {

        // parses the list of words from the analysis results
        function getWords() {
            var count = 0;
            var classes = [];
            $scope.analysis.result.sentences.forEach(function (node) {

                classes.push({text: node.term, frequency: node.frequency});
                count++;
            });
            return {children: classes};
        }

        /* Initialize tooltip */

        var fill = d3.scale.category20(); // color scheme for words
        var words = getWords().children;

        // setup for the word cloud
        d3.layout.cloud().size([1000, 600])// width, height
            .words(words)
            .rotate(function() {
                return (~~(Math.random() * 6) - 3) * 30;
            })
            .font("Impact")
            .fontSize(function(d) {
                return 8* Math.sqrt(d.frequency);
            })
            .on("end", draw)
            .start();


        // draw the word cloud out
        function draw(words) {
            var cloud = d3.select("#graph").style('overflow', 'scroll').style('width', '1140px').style('height', '600px')
                        .append("svg")
                        .attr("class", "cloud")
                        .attr("viewBox", "0 0 500 400")
                        .attr("width", '110%')
                        .attr("height", '130%')
                        .append("g")
                        .attr("transform", "translate(150,150)")
                        // individual text
                        .selectAll("text")
                        .data(words)
                        .enter().append("text")
                        .attr("class", "word")
                        .style("font-size", function(d) {
                            return d.size + "px";
                        })
                        .style("font-family", "Impact")
                        .style("fill", function(d, i) {
                            return fill(i);
                        })
                        .attr("text-anchor", "middle")
                        .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .text(function(d) {
                            return d.text;
                        })
                        //append a tooltip
                        .append("title")
                        .text(function(d) { return d.text + ": " + d.frequency; })

          d3.select(self.frameElement).style("height", 50 + "px");
        }
    };

    $scope.visualizeParseTree = function(sentiment) {

      d3.select(".svg-container").remove();
        
        var dataToConvert = angular.copy(sentiment? $scope.sentimentTreeData : $scope.depsTreeData);

        data = convertData(dataToConvert);
        renderTree();

        //Converts results from flat to hierarchical
        function convertData(words) {
 
            var rootNode = { 'id': 0, 'value': 'root', 'pos': 'root' };
            words.push(rootNode);
    
            var dataMap = words.reduce(function(map, node) {
                map[node.id] = node;
                return map;
            }, {});
    
            var treeData = [];
            words.forEach(function(node) {
    
                var head = dataMap[node.head];
       
                if (head)
                    (head.children || (head.children = [])).push(node);
                else
                    treeData.push(node);
            });
    
            return treeData;
        }

        //Builds canvas and creates root
        function renderTree() {
            var tree = d3.layout.tree().nodeSize([50, 50]);
    
            tree.separation(function (a, b) {
                var w1 = a.value.length;
                var w2 = b.value.length;
    
                var scale = 0.13;
    
                return Math.ceil((w1 * scale) + (w2 * scale) / 2);
            });

            /*
                 The #graph (or #sentgraph) div is acting as a container for the .svg-container div (which holds the tree).
                 To make it scrollable, 2 things that must happen:
                   1. the #graph div must have overflow set to scroll
                   2. the svg-container div must have width & height greater than the width & height of #graph
                 Note: right now the width/height percentages are arbitrary and I need to figure out a better way
            */

            var svg = d3.select("#graph").style('overflow', 'scroll').style('width', '  width:1140px').style('height', '1200px')
              .append('svg')
              .attr('class', 'svg-container')
              .style('width', '200%')
              .style('height', '150%');

            var canvas = svg.append('g')
              .attr('class', 'canvas');
    
            canvas.append('g')
              .attr('transform', 'translate(500 , 10) scale(.75)');
    
            var root = data[0];
    
            update(root, tree, svg);
    
            return this;
        }

        //Draws the tree from the root
        function update(source, tree, svg) {
    
            var diagonal = d3.svg.diagonal()
              .projection(function (d) {
                return [d.x, d.y];
              });
    
            var nodes = tree(source).reverse(),
              links = tree.links(nodes);
    
            nodes.forEach(function (d) {
              d.y = d.depth * 100;
            });
    
            var node = svg.select('.canvas g')
              .selectAll('g.node')
              .data(nodes, function (d, i) {
                  return d.id || (d.id = ++i);
              });
    
            var nodeEnter = node.enter()
              .append('g')
              .attr('class', 'node')
              .attr('transform', function (d) {
                  return 'translate(' + source.x + ', ' + source.y + ')';
              });
    
            nodeEnter.append('circle')
              .attr('r', 10)
              .style('stroke', '#000')
              .style('stroke-width', '3px')
              .style('fill', '#FFF');
    
            nodeEnter.append('text')
              .attr('y', function (d, i) {
                return (d.pos == 'root') ? -30 : 15;
              })
              .attr('dy', '14px')
              .attr('text-anchor', 'middle')
              .text(function (d) {
                  return d.value;
               })
              .style('fill', function (d, i) {
                  return (d.pos == 'root') ? '#CCC' : '#333';
              })
              .style('font-size', '18px')
              .style('fill-opacity', 1);
            if(!sentiment){
            nodeEnter.append('text')
              .attr('y', function (d, i) {
                  return (d.pos == 'root') ? 0 : -30;
              })
              .attr('dy', '12px')
              .attr('text-anchor', 'middle')
              .attr('class', 'label')
              .style('font-size', '12px')
              .style('font-weight', 500)
              .style('fill', '#666')
              .text(function (d) {
                  return d.tag;
              });
            }else{
                nodeEnter.append('text')
              .attr('y', function (d, i) {
                  return (d.pos == 'root') ? 0 : -30;
              })
              .attr('dy', '12px')
              .attr('text-anchor', 'middle')
              .attr('class', 'label')
              .style('font-size', '35px')
              .style('font-weight', 500)
              .style('fill', '#666')
              .text(function (d) {
                  switch(d.tag){
                    case 0:
                      return "- -";
                    case 1:
                      return "-";
                    case 3:
                      return "+";
                    case 4:
                      return "+ +";
                    default:
                      return "";
                  };
              });
            }
    
            var nodeUpdate = node.transition()
              .duration(500)
              .attr('transform', function (d) {
                  return 'translate(' + d.x + ', ' + d.y + ')';
              });
    
            var link = svg.select('.canvas g')
              .selectAll('path.link')
              .data(links, function (d) {
                return d.target.id;
              });
    
            link.enter()
              .insert('path', 'g')
              .attr('class', 'link')
              .style('stroke', '#CCC')
              .style('stroke-width', '2px')
              .style('fill', 'none')
              .attr('d', function (d) {
                  var o = {
                      x: source.x,
                      y: source.y
                  };
    
                  return diagonal({
                      source: o,
                      target: o
                  });
              });
    
            link.transition()
              .duration(500)
              .attr('d', diagonal);
    
            nodes.forEach(function (d, i) {
              d.x0 = d.x;
              d.y0 = d.y;
            });
        }
    };

    $scope.visualizeSentimentText = function()
    {
        // clear any existing text & sentiment data when dropdown is changed
        d3.select(".sentiment-text").remove();
        d3.select(".VeryNegative").remove();
        d3.select(".Negative").remove();
        d3.select(".Neutral").remove();
        d3.select(".Positive").remove();
        d3.select(".VeryPositive").remove();

        // get the selected sentence & update the visual. Default sentence is index 0 of result
        var results = $scope.sentenceData;
        updateSentence(results);

        function updateSentence(results)
        {
            var sentDiv = document.getElementById("senttext");
            if(sentDiv != null)
            {
                var textNode =  document.createElement('div');
                textNode.setAttribute("class", "sentiment-text");
                var tokens = [];
                results.tokens.forEach(function(word){
                    tokens.push(word);
                });
                var sentimentTitle = document.createElement('span');
                sentimentTitle.setAttribute("title", results.parse);
                sentimentTitle.innerHTML = "Sentence Sentiment: " + results.sentiment + "<br />";

                if(results.sentiment == "Very negative")
                {
                    sentimentTitle.setAttribute("class", "VeryNegative");
                }
                else if(results.sentiment == "Very positive")
                {
                    sentimentTitle.setAttribute("class", "VeryPositive");
                }
                else
                {
                    sentimentTitle.setAttribute("class", results.sentiment);
                }

                tokens.forEach(function(word){
                    var wordspace = document.createElement('span');
                    wordspace.setAttribute("title", word.token + "- Sentiment: " + word.sentiment + ", Value: " + word.sentimentValue);
                    wordspace.innerHTML += word.token + " ";
                    textNode.appendChild(wordspace);
                });
                sentDiv.appendChild(sentimentTitle);
                sentDiv.appendChild( textNode );
            }
        }
    };

  $scope.visualizeNER = function() {
    $scope.renderPlainText('ner');
  }

  $scope.renderPlainText = function(type) {
			var canvas = document.getElementById('plaintext-canvas');
   		if(canvas){canvas.remove(); }

      // Create a new div under the #graph div
      var textDiv = document.getElementById("graph");
      var textNode =  document.createElement('div');
      textNode.setAttribute("class", "ner-text");
      textNode.setAttribute("id", "plaintext-canvas");

      var tokens = {};
      $scope.analysis.result.sentences.forEach(function(obj, sentenceIndex){
					tokens[sentenceIndex] = {}; 
          obj.tokens.forEach(function(word, tokenIndex){
					  tokens[sentenceIndex][tokenIndex] = word;
          })
      });

      Object.keys(tokens).forEach(function(sk){
				 Object.keys(tokens[sk]).forEach(function(wk) {
					 var corefCount = 0;
					 var word = tokens[sk][wk];
					 var wordspace = document.createElement('span');

					 if(type == 'ner') { wordspace.setAttribute("title", word.token + ": " + word.ner); }
					 wordspace.innerHTML += word.token + " ";

					 if(type == 'ner' && word.ner !== "O")
					 {
							 wordspace.style.fontWeight = 'bold';
							 wordspace.setAttribute("class", word.ner.toLowerCase());
           }

           if(type == 'relation') {
             var relationTitle = '';

             $scope.analysis.result.sentences[sk].relations.forEach(function(relation) {
               var startInd = relation.subject.start;
               var endInd = relation.object.end - 1;
               
               if(wk >= startInd && wk <= endInd) {
                 wordspace.style.fontWeight = 'bold';
                 wordspace.style.textDecoration = 'underline';
                 relationTitle += JSON.stringify(relation, null, 2) + '\n';
               }
             });

             wordspace.setAttribute('title', relationTitle);
           }

					 if(type == 'coref' && 
					 $scope.selectedEntity.sentence == sk &&
			     wk >= $scope.selectedEntity.startInd && 
					 wk <= $scope.selectedEntity.endInd) {
							 wordspace.style.fontWeight = 'bold';
					 		 wordspace.setAttribute("title", word.token + ": " + JSON.stringify($scope.analysis.result.entities[sk].mentions[corefCount], null, 2));
							 wordspace.setAttribute("class", 'organization');
							 corefCount++;
					 }

						textNode.appendChild(wordspace);
			    });
      });
      textDiv.appendChild( textNode );
  }

  $scope.visualizeCoref = function() {
    var sentences = $scope.analysis.result.sentences;
    $scope.analysis.result.entities.forEach(function(entity) {
      entity.mentions.forEach(function(mention) {
        
        //Grab every token that has been mentioned by a given entity 
        var tokenString = sentences[mention.sentence]
        .tokens.slice(mention.tokspan_in_sentence[0], mention.tokspan_in_sentence[1] + 1);
        
        //Grab the text from every token and append together
        //to populate the dropdwn list
        var tokenText = tokenString.reduce(function(prev, cur) {
          return prev.token? prev.token + ' ' + cur.token : prev + ' ' + cur.token;
        });

        $scope.corefEntities.push({
				  'text': tokenText, 
					'sentence': mention.sentence, 
					'startInd': mention.tokspan_in_sentence[0],
					'endInd': mention.tokspan_in_sentence[1]
				});

      });
    });
 	
    $scope.selectedEntity = $scope.corefEntities[0];    

    //Render text in document to highlight with entities 
    $scope.renderPlainText('coref');
  }

  $scope.setEntity = function(index) {
		$scope.selectedEntity = $scope.corefEntities[index];
		$scope.renderPlainText('coref');
  }

  $scope.visualizeRelation = function() {
    $scope.renderPlainText('relation');
  }

  $scope.visualize = function(){
      switch($scope.analysis.analysis) {
        case "tfidf":
          $scope.visualizeTfidf();
          break;
        case "wordcloudop":
          $scope.visualizeWordcloud();
          break;
        case "nlp-pos":
          $scope.visualizeParseTree(false);
          break;
        case "nlp-sentiment":
          $scope.visualizeParseTree(true);
          $scope.visualizeSentimentText();
          break;
        case "nlp-ner":
          $scope.visualizeNER($scope.text);
          break;
        case "nlp-coref":
          $scope.visualizeCoref();
          break;
        case "nlp-relation":
          $scope.visualizeRelation();
          break;
        default:
          break;
    }
  };
  }
})();
