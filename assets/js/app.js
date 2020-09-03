// @TODO: YOUR CODE HERE!
// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("assets/data/data.csv").then(censusdata=> {
  console.log(censusdata);
 
  // Format the data
  censusdata.forEach(data=> {
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.poverty= +data.poverty;
    data.smokes= +data.smokes;
  });

  // Create scaling functions
  var xLinearScale1 = d3.scaleLinear()
    .domain([d3.min(censusdata, d => d.poverty)*0.8,d3.max(censusdata, d => d.poverty)*1.2])
    .range([0, width]);

  var yLinearScale1 = d3.scaleLinear()
  .domain([d3.min(censusdata, d => d.healthcare)*0.8,d3.max(censusdata, d => d.healthcare)*1.2])
    .range([height, 0])
//   var yLinearScale2 = d3.scaleLinear()
//     .domain([0, d3.max(smurfData, d => d.smurf_sightings)])
//     .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale1);
  var leftAxis = d3.axisLeft(yLinearScale1);
//   var rightAxis = d3.axisRight(yLinearScale2);

// Add x-axis
chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

// Add y1-axis to the left side of the display
chartGroup.append("g")
// Define the color of the axis text
 .call(leftAxis);

  // Add y2-axis to the right side of the display
//   chartGroup.append("g")
//     // Define the color of the axis text
//     .classed("blue", true)
//     .attr("transform", `translate(${width}, 0)`)
//     .call(rightAxis);

var circlesGroup = chartGroup.selectAll("circle")
    .data(censusdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale1(d.poverty))
    .attr("cy", d => yLinearScale1(d.healthcare))
    .attr("r", "15")
    .attr("fill", "steelblue")
    .attr("stroke-width", "1")
    .attr("stroke", "black")
    
  chartGroup.selectAll("abbreviation")
    .data(censusdata)
    .enter()
    .append("text")
    .attr("x", d=>xLinearScale1(d.poverty))
    .attr("y", d=>yLinearScale1(d.healthcare))
    .text(d=> d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size","10px")
    .attr("text-anchor","middle")
    .attr("fill", "white");

//   var line2 = d3.line()
//     .x(d => xTimeScale(d.date))
//     .y(d => yLinearScale2(d.smurf_sightings));

  
//   // Append a path for line2
//   chartGroup.append("path")
//     .data([smurfData])
//     .attr("d", line2)
//     .classed("line blue", true);

  // Append axes titles
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare(%)");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
    .classed("text", true)
    .text("In Poverty (%)");
}).catch(function(error) {
  console.log(error);
});




