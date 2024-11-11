// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.find(meta => meta.id === parseInt(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        panel.append("p").text(`${key}: ${value}`);
      });
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.find(s => s.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = result.otu_ids;
    const otuLabels = result.otu_labels;
    const sampleValues = result.sample_values;

    // Build a Bubble Chart
    const bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker:{
        size: sampleValues,
        color:otuIds,
        colorscale: "Earth"
      }
    }];

    // Render the Bubble Chart
      const bubbleLayout = {
        title: "OTU Sample Values",
        xaxis: {title: "OTU ID"},
        hovermode: "closest"
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      const yticks = otuIds.slice(0,10).reverse().map(id => `OTU ${id}`);
      const barValues = sampleValues.slice(0,10).reverse();
      const barLabels = otuLabels.slice(0,10).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
      const barData = [{
        x: barValues,
        y: yticks,
        text: barLabels,
        type: "bar",
        orientation: "h"
      }];

    // Render the Bar Chart
      const barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {t: 30, l:150}
      };

      Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();