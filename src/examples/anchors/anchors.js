looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "hello_world",
  label: "Hello World",
  options: {
    font_size: {
      type: "string",
      label: "Font Size",
      values: [
        {"Large": "large"},
        {"Small": "small"}
      ],
      display: "radio",
      default: "large"
    }
  },
  // Set up the initial state of the visualization
  create: function(element, config) {

    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
        .anchors-vis {
          /* Vertical centering */
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }
        .anchors-large {
          font-size: 72px;
        }
        .anchors-small {
          font-size: 18px;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    var container = element.appendChild(document.createElement("div"));
    container.className = "anchors-vis";

    // Create an element to contain the text.
    this._visElement = container.appendChild(document.createElement("div"));

  },
  // Render in response to the data or settings changing
  updateAsync: function(data, element, config, queryResponse, details, done) {

    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
      return;
    }

    // Grab the first cell of the data
    var firstRow = data[0];
    var firstCell = firstRow[queryResponse.fields.dimensions[0].name];

    // Insert the data into the page
    this._visElement.innerHTML += '<div class="cell-content">' + LookerCharts.Utils.htmlForCell(firstCell) + '</div>';
    this._visElement.innerHTML += `<div class="button-location-href">
      <button onclick="document.location.href='https://google.com'>Location HREF</button>
    </div>`;

    const openInNewWindow = function() { 
      window.open('https://google.com', '_blank') 
    };
    this._visElement.innerHTML += `<div class="button-window-open">
      <button onclick="${openInNewWindow}">Window Open</button>
    </div>`;
    
    this._visElement.innerHTML += `<div class="anchor-without-target">
      <a href="https://google.com">Anchor Without Target</button>
    </div>`;

    this._visElement.innerHTML += `<div class="anchor-with-blank-target">
      <a href="https://google.com" target="_blank">Anchor With _blank Target</button>
    </div>`;
    
    // Set the size to the user-selected size
    if (config.font_size == "small") {
      this._visElement.className = "anchors-small";
    } else {
      this._visElement.className = "anchors-large";
    }

    // We are done rendering! Let Looker know.
    done()
  }
});
