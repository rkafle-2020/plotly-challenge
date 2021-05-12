//call the data

function bellyButtonData(sample){
    d3.json("samples.json").then((data) => {
        // console.log(data);
        var metadata = data.metadata;
        var recordArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var record = recordArray[0];
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(record).forEach(([key,val])=>{
            PANEL.append("h6").text(`${key.toUpperCase()}: ${val}`);
        });
    });
}

// build plots

function buildPlot(sample) {
    d3.json("samples.json").then((data)=> {
        var samples = data.samples;
        var recordArray = samples.filter(sampleObject => sampleObject.id == sample);
        var record =recordArray[0];
        var sample_values = record.sample_values;
        var otu_ids = record.otu_ids;
        var otu_labels = record.otu_labels;
        
        var barTrace = {
            type: "bar",
            text: otu_labels.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            x: sample_values.slice(0,10).reverse(),
            orientation: 'h'
          };
      
          var barData = [barTrace];
      
          var barLayout = {
            title: "Top Ten OTUs",
            margin: {t: 50,l:150}
          };
      
          Plotly.newPlot("bar", barData, barLayout);

        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids          
            }
        }];

        var bubbleLayout = {
            hovermode: "closest",
            xaxis: {title:"Otu ID"}
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// This function is called when a dropdown menu item is selected
function init() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    d3.json("samples.json").then((data)=> {
        var names = data.names;
        names.forEach((sample)=>{
            dropdownMenu.append("option").text(sample).property("value",sample);
        });
        var defaultSample = names[0];
        buildPlot(defaultSample);
        bellyButtonData(defaultSample);
    });
}

function updateData(bellyButton_sample){
    buildPlot(bellyButton_sample);
    bellyButtonData(bellyButton_sample);  
}
init();