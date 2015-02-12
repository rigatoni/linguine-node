(function(){

  angular
    .module('linguine.analysis')
    .controller('AnalysisShowController', AnalysisShowController);

  function AnalysisShowController ($http, $scope, $state, $stateParams, $window) {

    $scope.back = function () {
      $window.history.back();
    };

    $http.get('/api/analysis/' + $stateParams.id)
      .success(function (data) {
        $scope.analysis = data;
        $scope.visualize();
      })

    $http.get('/api/corpora')
      .success(function (data) {
        $scope.corpora = data;
      });

    $scope.delete = function () {
      $http.delete('/api/analysis/' + $stateParams.id)
        .success(function (data) {
          $state.go('linguine.analysis.index')
        })
        .error(function (data) {
          flash.danger.setMessage("An error occured.");
        })
    };

    $scope.findCorpus = function (id) {
      return _.find($scope.corpora, {'_id': id});
    }

    $scope.visualize = function () {
      if ($scope.analysis.analysis === "tfidf") {

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
            classes.push({packageName: "", className: node.term, value: Math.log(node.importance) * -1});
          });
          return {children: classes};
        }

        d3.select(self.frameElement).style("height", diameter + "px");

      }
    }

  }
})();
