(function(){

  angular
    .module('linguine')
    .controller('IndexController', IndexController);

  function IndexController ($scope) {


      var words = [{
          text: "the",
          frequency: 20
      }, {
          text: "quick",
          frequency: 10
      }, {
          text: "brown",
          frequency: 10
      }, {
          text: "fox",
          frequency: 10
      }, {
          text: "jumps",
          frequency: 10
      }, {
          text: "over",
          frequency: 10
      }, {
          text: "lazy",
          frequency: 10
      }, {
          text: "dog",
          frequency: 10
      }]

      var fill = d3.scale.ordinal().range(["#ff7f0e","aec7e8","#ffbb78","#2ca02c","#ff9896","#9467bd","#17becf","#d62728","#d62728"]);

      d3.layout.cloud().size([450, 450])
          .words(words)
          .rotate(function() {
              return ~~(Math.random() * 2) * 90;
          })
          .font("Impact")
          .fontSize(function(d) {
              return 4*(d.frequency)
          })
          .on("end", draw)
          .start();


      function draw(words) {
          d3.select("#graph").append("svg")
              .attr("width", 400)
              .attr("height", 400)
              .append("g")
              .attr("transform", "translate(150,150)")
              .selectAll("text")
              .data(words)
              .enter().append("text")
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
              });
      }
  }
})();
