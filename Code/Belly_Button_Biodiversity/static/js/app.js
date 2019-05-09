function buildMetadata(sample) {

  // @TODO: function to build metadata panel Use `d3.json` to fetch the metadata for a sample @app.route("/metadata/<sample>")
  const metadataUrl = "/metadata/" + sample; 

  // Use d3 to select the panel with id of `#sample-metadata`
  const metadataSample = d3.select('#sample-metadata')
 
  // clear existing metadata
  metadataSample.html("")

  // Use `Object.entries` to add each key and value pair to the panel Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
  
  async function getPanel() {
    let jsonMeta = await d3.json(metadataUrl);
    //Object.entries() method returns an array of a given object's own enumerable string-keyed property [key, value] pairs, in the same order as that provided
    let metaArray = Object.entries(jsonMeta);
    metaArray.map(([key, value]) => {metadataSample
      .append("h6")
      .html(`<b>${key}</b>  :  ${value}`) // how to append multi w/o literal?
      });
    }
  getPanel();
}

function pieChart(data) {

  // TODO otu_ids to something intelligible 
  // dataSort = data.sort((first, second) => second - first);
  
  let trace = {
    values: data.sample_values.slice(0, 10),
    labels: data.otu_ids.slice(0, 10),
    hovertext: data.otu_labels.slice(0, 10),
    type: "pie"
  }

  let layout = {
    title: "<b>Top 10 Microbes in Belly Button</b>"
  }

  let pieData = [trace]

  Plotly.newPlot("pie", pieData, layout);
}
// TODO add AXIS Labels!
function bubbleChart(data) {
  var trace1 = {
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode: 'markers',
    marker: {
      color: data.otu_ids,
      size: data.sample_values // TODO set min and max sizes if possible?
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: '<b>Biodiversity Bubble Chart</b>',
    showlegend: false,
    height: 600,
    width: 1000
  };
  
  Plotly.newPlot('bubble', data, layout);
}
async function buildCharts(sample) {

  // @TODO: Use `d3.s` to fetch the sample data for the plots
  const chartUrl = "/samples/" + sample;
  const data = await d3.json(chartUrl)

  pieChart(data);
  bubbleChart(data);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
