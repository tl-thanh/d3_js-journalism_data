var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("data.csv", function(err, myData) {
  if (err) throw err;

  myData.forEach(function(data) {
    data.college = +data.college;
    data.income = +data.income;
  });

  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  xLinearScale.domain([10, d3.max(myData, function(data) {
    return +data.college;
  })]);
  yLinearScale.domain([0, d3.max(myData, function(data) {
    return +data.income;
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var state = data.state;
      var collegeData = +data.college;
      var incomeData = +data.income;
      return (state + "<br> College: " + collegeData + "<br> Income: " + incomeData);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(myData)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        console.log(data.college);
        return xLinearScale(data.college);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.income);
      })
      .attr("r", "10")
      .attr("fill", "lightblue")
      .attr('stroke','black')
      .on("click", function(data) {
        toolTip.show(data);
      })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height - 120))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income $50K and Above (%)");

  chart.append("text")
    .attr("transform", "translate(" + (width - 480) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("College Level and Above (%)");
});