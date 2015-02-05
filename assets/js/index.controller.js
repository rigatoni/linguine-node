(function(){

  angular
    .module('linguine')
    .controller('IndexController', IndexController);

  function IndexController ($scope) {

    var diameter = 100,
    format = d3.format(",d"),
    color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#graph").append("svg")
        .attr("class", "bubble")
        .attr("viewBox", "0 0 100 100");

    var root = {"name": "foo",
                "children": [
                  {
                    name: "the",
                    size: "20"
                  }, {
                    name: "quick",
                    size: "30"
                  }, {
                    name: "brown",
                    size: "10"
                  }, {
                    name: "fox",
                    size: "40"
                  }, {
                    name: "jumps",
                    size: "50"
                  }, {
                    name: "over",
                    size: "20"
                  }, {
                    name: "lazy",
                    size: "30"
                  }, {
                    name: "dog",
                    size: "10"
                  }
               ]};

    var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(root))
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });

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
    function classes(root) {
      var classes = [];

      function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
        else classes.push({packageName: name, className: node.name, value: node.size});
      }

      recurse(null, root);
      return {children: classes};
    }

    d3.select(self.frameElement).style("height", diameter + "px");

  }
})();
