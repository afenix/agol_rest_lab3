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
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer"
], function (Map, MapView, esriConfig, Locate, Search, Graphic, GraphicsLayer, Polyline, Polygon, FeatureLayer, SimpleRenderer) {

    const token = "AAPK83337061f79941cdbcba8ea16add7f1csWFIvmrzXU7TvesGSEbfGqhfxRivSP37KmfuCDfiec8kVrxhDCre40EzzsvFCLSB";

    // Configure the ArcGIS API key
    esriConfig.apiKey = token;

    // Create a map and set the default base map to Esri's midcentury basemap
    const map = new Map({
        basemap: "arcgis-topographic"
    });

    // Create a map view centered on Seattle, WA
    const view = new MapView({
        map: map,
        center: [-122.302439, 47.529974], // Longitude, latitude of Seattle, WA
        zoom: 11,
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

    // Add an event listener to watch for changes on the combobox. When the combobox value has changed, 
    // call the updateBasemapStyle function to update the basemap style.
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
        content: `<img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Lacey_V._Murrow_Bridge_construction.jpg" alt="Lacey V. Murrow Memorial Bridge" style="width:100%;height:auto;" /><br>{Description}`
    };

    // Create an attributes object for the point graphic
    const attributes = {
        Name: "Lacey V. Murrow Memorial Bridge",
        Description: "The Lacey V. Murrow Memorial Bridge is a floating bridge in the Seattle metropolitan area of the U.S. state of Washington. It is one of the Interstate 90 floating bridges that carries the eastbound lanes of Interstate 90 across Lake Washington from Seattle to Mercer Island. Westbound traffic is carried by the adjacent Homer M. Hadley Memorial Bridge. ~ <a href='https://en.wikipedia.org/wiki/Lacey_V._Murrow_Memorial_Bridge' target='_blank'>https://en.wikipedia.org/wiki/Lacey_V._Murrow_Memorial_Bridge</a>"
    };

    // Add the style and the geometry to the graphics layer
    const pointGraphic = new Graphic({
        geometry: LaceyVMurrowBridge,
        symbol: simpleMarkerSymbol,
        attributes: attributes,
        popupTemplate: popupTemplate
    });

    // Add the point graphic to the graphics layer
    graphicsLayer.add(pointGraphic);

    // Add a line that covers Lacey V. Murrow Memorial Bridge Path
    let paths = [
        [
            [-122.286080, 47.590134],  // West end of Lacey V. Murrow Bridge
            [-122.253894, 47.589528]   // East end of Lacey V. Murrow Bridge
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

    // Define the polygon rings for the Lacey V. Murrow Memorial Bridge
    const rings = [
        [ // First ring (square around the bridge)
            [-122.288080, 47.592134],  // Northwest corner (slightly adjusted for buffer)
            [-122.251894, 47.592134],  // Northeast corner
            [-122.251894, 47.587528],  // Southeast corner
            [-122.288080, 47.587528],  // Southwest corner
            [-122.288080, 47.592134]   // Close the ring (same as Northwest corner)
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


    // Define a pop-up for usaeduLayer
    const popup_natl_bridges = {
        "title": "<b>Bridge Name: {BRIDGE_NAME}</b>, {STATE}",
        "content": "This bridge is in <b>{BRIDGE_CONDITION_FULL}</b> condition. It was built in <b> {YEAR_BUILT_FORMATTED}</b>, making it <b>{BRIDGE_AGE}</b> years old and supports, on average, <b>{ADT_029}</b> crossings a day."
    }

    // Add a feature layer to the map from AGOL's Living Atlas
    const bridge_inventory = new FeatureLayer({
        url: "https://services3.arcgis.com/88ZQImArDzAVfCZ9/arcgis/rest/services/experience_builder_bridges_data/FeatureServer",
        // Add popupTemplate to the feature layer
        outFields: ["BRIDGE_NAME", "BRIDGE_CONDITION", "YEAR_BUILT_FORMATTED", "BRIDGE_AGE", "BRIDGE_CONDITION_FULL"],
        popupTemplate: popup_natl_bridges,
        definitionExpression: "(BRIDGE_CONDITION_FULL = 'poor' OR BRIDGE_CONDITION_FULL = 'fair') AND ADT_029 > 100000" // Only show bridges that are in poor condition with high traffic using SQL filter
    });

    // Add the bridge feature layer to the map
    map.add(bridge_inventory);

    // Create a simple picture marker symbol for the airports
    const airportRenderer = {
        "type": "simple",
        "symbol": {
            "type": "picture-marker",
            "url": "https://raw.githubusercontent.com/afenix/agol-test/main/local_airport_24dp.png",
            "width": "18px",
            "height": "18px"
        }
    }

    // Add AGOL hosted feature layer of US airports to the map
    const us_airports = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/US_Airports_Fenix/FeatureServer",
        // Add airport symbol renderer to the feature layer
        renderer: airportRenderer,
        definitionExpression: "Fac_Type = 'AIRPORT'" // Only show airports using sql to filter
    });

    // Add the us_airports feature layer to the map
    map.add(us_airports);



    // Wait for the map view to load
    view.when(function () {
        console.log("Map and View are ready");
    }, function (error) {
        console.error("The view failed to load: ", error);
    });
});
