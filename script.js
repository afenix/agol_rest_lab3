// Load the ArcGIS API for JavaScript modules and the Luxon library for date/time manipulation
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/config",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "esri/layers/FeatureLayer"
], function (Map, MapView, esriConfig, Locate, Search, Graphic, GraphicsLayer, Polyline, Polygon, FeatureLayer) {

    const token = "AAPK83337061f79941cdbcba8ea16add7f1csWFIvmrzXU7TvesGSEbfGqhfxRivSP37KmfuCDfiec8kVrxhDCre40EzzsvFCLSB";

    // Configure the ArcGIS API key
    esriConfig.apiKey = token;

    // Create a map using Esri's topographic basemap
    const map = new Map({
        basemap: "arcgis-nova"
    });

    // Create a map view   
    const view = new MapView({
        map: map,
        center: [-122.6784, 45.5152], // Longitude, latitude of Portland, OR
        zoom: 10, // Zoom in to Portland City Limits 
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
    const st_johns_bridge = {
        type: "point",
        longitude: -122.76477,
        latitude: 45.58508
    };

    // Stylize the point graphic
    const simpleMarkerSymbol = {
        type: "picture-marker",
        url: "icons8-bridge-64.png",
        width: "24px", // Adjust size as needed
        height: "24px"
    };

    // Create a popup template for the point graphic
    const popupTemplate = {
        title: "{Name}",
        content: `<img src="https://insightpestnorthwest.com/wp-content/uploads/2020/08/St-Johns-Bridge.jpg" alt="St. Johns Bridge" style="width:100%;height:auto;" /><br>{Description}`
    };

    // Create an attributes object for the point graphic
    const attributes = {
        Name: "St. Johns Bridge",
        Description: "An iconic steel suspension bridge spanning the Willamette River in Portland. Completed in 1931, it's known for its Gothic Revival towers and distinctive green color. A beloved landmark and popular spot for walkers and cyclists."
    }

    // Add the style and the geometry to the graphics layer
    const pointGraphic = new Graphic({
        geometry: st_johns_bridge,
        symbol: simpleMarkerSymbol,
        attributes: attributes,
        popupTemplate: popupTemplate
    });

    // Add the point graphic to the graphics layer
    graphicsLayer.add(pointGraphic);

    // Add a polyline that highlights the Burnside Bridge
    let paths = [
        [ // Burnside Bridge Path
            [-122.67039543081786, 45.52318900563338], // West end of Burnside Bridge
            [-122.66539491991392, 45.523072223490665]  // East end of Burnside Bridge
        ]
    ];

    // Create a polyline geometry for the path
    const polyline = {
        type: "polyline",
        paths: paths
    };

    // Create a simple line symbol for rendering the polyline
    const lineSymbol = {
        type: "simple-line",
        color: [226, 119, 40], // Orange color
        width: 4
    };

    // Create a graphic for the polyline
    const polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: lineSymbol
    });

    // Add the polyline graphic to the map's graphics layer
    graphicsLayer.add(polylineGraphic);

    // Define the polygon rings for the Portland City Limits
    const rings = [
        [ // first ring
            [-122.6765, 45.5231], // Vertice 1
            [-122.6760, 45.5235], // Vertice 2
            [-122.6755, 45.5230], // Vertice 3
            [-122.6760, 45.5225], // Vertice 4
            [-122.6765, 45.5231]  // Closing the ring (same as Vertice 1)
        ]
    ];

    // Create the polygon geometry
    const polygon = new Polygon({
        hasZ: false,
        hasM: false,
        rings: rings,
        spatialReference: { wkid: 4326 }
    });

    // Create a simple fill symbol for the polygon
    const fillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.8], // Orange fill color with transparency
        outline: {
            color: [255, 255, 255],
            width: 1
        }
    };

    // Create a graphic for the polygon
    const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: fillSymbol
    });

    // Add the polygon graphic to the graphics layer
    graphicsLayer.add(polygonGraphic);


    // Add a feature layer to the map from Living Atlas
    const bridge_inventory = new FeatureLayer({
        url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/National_Bridge_Inventory_v1/FeatureServer",
    });

    // Add the feature layer to the map
    map.add(bridge_inventory);

    // Wait for the map view to load
    view.when(function () {
        console.log("Map and View are ready");
    }, function (error) {
        console.error("The view failed to load: ", error);
    });
});
