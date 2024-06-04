// Load the ArcGIS API for JavaScript modules and the Luxon library for date/time manipulation
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/config",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
], function (Map, MapView, esriConfig, Locate, Search, Graphic, GraphicsLayer) {

    // Configure the ArcGIS API key
    esriConfig.apiKey = "AAPK83337061f79941cdbcba8ea16add7f1csWFIvmrzXU7TvesGSEbfGqhfxRivSP37KmfuCDfiec8kVrxhDCre40EzzsvFCLSB";

    // Create a map using Esri's topographic basemap
    const map = new Map({
        basemap: "arcgis-nova"
    });

    // Create a map view   
    const view = new MapView({
        map: map,
        center: [-122.6784, 45.5152], // Longitude, latitude of Portland, OR
        zoom: 11, // Zoom in to Portland City Limits 
        container: "viewDiv",
        constraints: {
            snapToZoom: false
        }
    });

    //Add the basemapStyles div to the view UI.
    const updateBasemapStyle = (basemapId) => {
        view.map.basemap = basemapId;
    };

    // Get the basemap styles div and add to the top right corner of the view
    const basemapStylesDiv = document.getElementById("basemapStyles");
    view.ui.add(basemapStylesDiv, "top-right");

    //Add an event listener to watch for changes on the combobox. When the combobox value has changed, 
    //call the updateBasemapStyle function to update the basemap style.
    const styleCombobox = document.getElementById("styleCombobox");
    styleCombobox.addEventListener("calciteComboboxChange", (event) => {
        updateBasemapStyle(event.target.value);
    });

    // Add a locate button to the view
    const locateBtn = new Locate({
        view: view
    });

    // Add the locate widget to the top left corner of the view (under the zoom buttons)
    view.ui.add(locateBtn, {
        position: "top-left"
    });

    // Add a search widget to the view
    const searchWidget = new Search({
        view: view
    });

    // Adds the search widget below other elements in the top left corner of the view
    view.ui.add(searchWidget, {
        position: "top-left",
        index: 0
    });

    // Add a graphics layer to the map
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Create a point graphic at the Portland Art Museum
    const first_home = {
        type: "point",
        longitude: -122.6908,
        latitude: 45.5279
    };

    // Stylize the point graphic
    const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [0, 0, 139],  // Color of blues rock
        outline: {
            color: [255, 255, 255], // White  
            width: 1
        }
    };

    // Add the style and the geometry to the graphics layer
    const pointGraphic = new Graphic({
        geometry: first_home,
        symbol: simpleMarkerSymbol
    });

    // Add the point graphic to the graphics layer
    graphicsLayer.add(pointGraphic);


    // Wait for the map view to load
    view.when(function () {
        console.log("Map and View are ready");
    }, function (error) {
        console.error("The view failed to load: ", error);
    });
});
