(function(){

  angular
  .module('linguine.analysis')
  .controller('AnalysisShowController', AnalysisShowController);

  function AnalysisShowController ($http, $scope, $state, $stateParams, $window) {

    $scope.back = function () {
      $window.history.back();
    };

    $http.get('api/analysis/' + $stateParams.id)
    .success(function (data) {
      $scope.analysis = data;
      $scope.defaultView();
      $scope.visualize();
    })

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

    $scope.defaultView = function() {
      $scope.results = $scope.analysis.result;
      // create the editor
      var container = document.getElementById("jsoneditor");
      var editor = new JSONEditor(container);
      editor.set($scope.results);
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
                    $scope.analysis.result.forEach(function (node) {
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
            $scope.analysis.result.forEach(function (node) {

                classes.push({text: node.term, frequency: node.frequency});
                count++;
            });
            return {children: classes};
        }

        /* Initialize tooltip */

        var fill = d3.scale.category20(); // color scheme for words
        var words = getWords().children;

        // setup for the word cloud
        d3.layout.cloud().size([1000, 400])// width, height
            .words(words)
            .rotate(function() {
                return ~~(Math.random() * 2) * 90;
            })
            .font("Impact")
            .fontSize(function(d) {
                return 3*(d.frequency)
            })
            .on("end", draw)
            .start();


        // draw the word cloud out
        function draw(words) {
            var cloud = d3.select("#graph")
                        .append("svg")
                        .attr("class", "cloud")
                        .attr("viewBox", "0 0 400 400")
                        .attr("width", 1000)
                        .attr("height", 400)
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
        
      //Move this to a listener when supporting multiple sentences
      //#TODO: Make this not a single sentence
        data = convertData($scope.results[0].sentiment_json);
        renderTree();

        //Converts results from flat to heirarchical
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
            var tree = d3.layout.tree().nodeSize([100, 50]);
    
            tree.separation(function (a, b) {
                var w1 = a.value.length;
                var w2 = b.value.length;
    
                var scale = 0.13;
    
                return Math.ceil((w1 * scale) + (w2 * scale) / 2);
            });
    
            var svg = d3.select("#graph").append('svg')
              .attr('class', 'svg-container')
              .style('width', 1500)
              .style('height', 1500)
              .style('overflow', 'auto');
    
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
            if(sentiment){
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
              .style('font-size', '12px')
              .style('font-weight', 500)
              .style('fill', '#666')
              .text(function (d) {
                  switch(d.tag){
                    case 0:
                      return "--";
                    case 1:
                      return "-";
                    case 3:
                      return "+";
                    case 4:
                      return "++";
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
    

    $scope.visualize = function(){
      if ($scope.analysis.analysis === "tfidf" ) {
        $scope.visualizeTfidf();
      } else if  ($scope.analysis.analysis == "wordcloudop") {
        $scope.visualizeWordcloud();
      } else if  ($scope.analysis.analysis == "nlp-parse"){
        $scope.visualizeParseTree(false);
      } else if  ($scope.analysis.analysis == "nlp-sentiment"){
        $scope.visualizeParseTree(true);
      }
    }

  }
})();
