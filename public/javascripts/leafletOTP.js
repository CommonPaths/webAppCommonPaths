/* eslint-disable */

const transitMarkerCircleColor = {
  color: '#66ff00',
  fillOpacity: 0.1,
  fillColor: '#E5E5E5',
  radius: 12
};
const StartEndIcon = L.Icon.extend({
  options: {
    iconSize: [40, 60],
    shadowSize: [60, 60],
    iconAnchor: [12, 75],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  },
});
const SlopeIcon = L.Icon.extend({
  options: {
    iconSize: [20, 20],
    shadowSize: [25, 25],
    iconAnchor: [-3, 3],
    shadowAnchor: [5, 5],
    popupAnchor: [-10, -5],
  },
});
const busStopIcon = L.Icon.extend({
  options: {
    iconSize: [17, 18],

  },
});
const customLayerIconDef = L.Icon.extend({
  options: {
    iconSize: [10, 12],
    iconAnchor: [-3, 3],
    popupAnchor: [-10, -5],
  },
});

const startIcon = new StartEndIcon({ iconUrl: '/images/startB.png' });
const endIcon = new StartEndIcon({ iconUrl: '/images/EndB.png' });
const slopeNormalIcon = new SlopeIcon({ iconUrl: '/images/slopeGreen.png' });
const slopeNonADAIcon = new SlopeIcon({ iconUrl: '/images/slopeRed.png' });
const busStopYellowIcon = new busStopIcon({ iconUrl: '/images/bus_48px.png' });
const iconColorArray = ['#ff0a0a', '#0fcfff', '#0aff27', '#b60aff', '#ff9d0a', '#0a47ff', '#57595d']; // red, cyan, green, purple, orange, blue, gray
const histPicIconColorArray = ['#ff0a0a', '#0fcfff', '#0aff27', '#b60aff', '#ff9d0a', '#0a47ff', '#57595d']; // red, cyan, green, purple, orange, blue, gray 

// Get access key and ID's from settings for transport-Thunderforest and Custom Mapbox Tile Layer  
const transportTileLayerKey = document.getElementById('transportThunderforestKey').value;
const customLayermapboxAccountName = document.getElementById('mapboxAccountName').value;
const customLayermapboxAccountStyleID = document.getElementById('mapboxAccountStyleID').value;
const customLayermapboxAccountKey = document.getElementById('mapboxAccountKey').value;
const customTileLayerName = document.getElementById('customTileLayerName').value;

const OSMTile = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSMAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const transportTile = 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=' + transportTileLayerKey;
const transportThunderforestAttribution = '© <a href="https://www.thunderforest.com">Thunderforest</a>' + ', Data ' + OSMAttribution;

const customMapboxTile = 'https://api.mapbox.com/styles/v1/'+ customLayermapboxAccountName + '/'+ customLayermapboxAccountStyleID + '/tiles/256/{z}/{x}/{y}?access_token=' + customLayermapboxAccountKey;
const mapboxAttribution = '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' + OSMAttribution;

// ToDo confirm removal of the ÖPNVKarte, Hsidelil
// const ÖPNVKarteAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors. Tiles courtesy of <a href="https://memomaps.de/en/homepage/"> MeMoMaps</a>';

// Use ESRI tiles only for testing
// const satteliteESRITile = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
// const satteliteESRIAttribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

// Use Google tiles only for testing
// const satteliteGoogleHybridTile = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
// const GoogleHybridAttribution = 'Map data ©2019 Google';

const measureControlOptions = {
  position: 'topleft',            // Position to show the control. Values: 'topright', 'topleft', 'bottomright', 'bottomleft'
  unit: 'landmiles',              // Show imperial or metric distances. Values: 'metres', 'landmiles', 'nauticalmiles'
  clearMeasurementsOnStop: true,  // Clear all the measurements when the control is unselected
  showBearings: false,            // Whether bearings are displayed within the tooltips
  bearingTextIn: 'In',            // language dependend label for inbound bearings
  bearingTextOut: 'Out',          // language dependend label for outbound bearings
  tooltipTextFinish: 'Click to <b>finish line</b><br>',
  tooltipTextDelete: 'Press SHIFT-key and click to <b>delete point</b>',
  tooltipTextMove: 'Click and drag to <b>move point</b><br>',
  tooltipTextResume: '<br>Press CTRL-key and click to <b>resume line</b>',
  tooltipTextAdd: 'Press CTRL-key and click to <b>add point</b>',
                                  // language dependend labels for point's tooltips
  measureControlTitleOn: 'Turn on PolylineMeasure',   // Title for the control going to be switched on
  measureControlTitleOff: 'Turn off PolylineMeasure', // Title for the control going to be switched off
  measureControlLabel: '&#8614;', // Label of the Measure control (maybe a unicode symbol)
  measureControlClasses: [],      // Classes to apply to the Measure control
  showClearControl: false,        // Show a control to clear all the measurements
  clearControlTitle: 'Clear Measurements', // Title text to show on the clear measurements control button
  clearControlLabel: '&times',    // Label of the Clear control (maybe a unicode symbol)
  clearControlClasses: [],        // Classes to apply to clear control button
  showUnitControl: false,         // Show a control to change the units of measurements
  distanceShowSameUnit: false,    // Keep same unit in tooltips in case of distance less then 1 km/mi/nm
};

const geoSearchOptions = {
  provider: new GeoSearch.OpenStreetMapProvider(), // required
  position: 'topleft',          // 'topleft' | 'topright' | 'bottomleft' | 'bottomright'
  style: 'button',              // optional: bar|button  - default button
  autoComplete: true,           // optional: true|false  - default true
  autoCompleteDelay: 250,       // optional: number      - default 250
  showMarker: true,             // optional: true|false  - default true
  showPopup: true,              // optional: true|false  - default false
  marker: {
                                // optional: L.Marker    - default L.Icon.Default
    icon: new L.Icon.Default(),
    draggable: false,
  },
  popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
  resultFormat: ({ result }) => result.label,       // optional: function    - default returns result label
  maxMarkers: 1,                                    // optional: number      - default 1
  retainZoomLevel: false,                           // optional: true|false  - default false
  animateZoom: true,                                // optional: true|false  - default true
  autoClose: false,                                 // optional: true|false  - default false
  searchLabel: 'Enter address',                     // optional: string      - default 'Enter address'
  keepResult: false,                                // optional: true|false  - default false
  updateMap: true,                                  // optional: true|false  - default true
};

const bingKey = document.getElementById('bingMapKey').value;
const bingAerialWithLabelsBaseMap =  L.tileLayer.bing({
  bingMapsKey: bingKey,
  imagerySet: 'AerialWithLabels',
  minZoom: 5,
  maxZoom: 21
});

const OSMBaseLayer = L.tileLayer(OSMTile, {
  attribution: OSMAttribution,
  minZoom: 5,
  maxNativeZoom: 19,
  maxZoom: 21
});

const transportTileLayer = L.tileLayer(transportTile, {
  attribution: transportThunderforestAttribution,
  minZoom: 5,
  maxNativeZoom: 19,
  maxZoom: 21
});

const customTileMapboxTileLayer = L.tileLayer(customMapboxTile, {
  attribution: mapboxAttribution,
  minZoom: 5,
  maxNativeZoom: 19,
  maxZoom: 21
});

const historicPicMetaDataLayersSeattle = JSON.parse(document.getElementById('historicPicMetaDataLayersSeattle').value);
const customLayerData = JSON.parse(document.getElementById('customlayerID').value);
const customLayerNames = [];
for (let i = 0; i < customLayerData.length; i++) {
  customLayerNames.push((customLayerData[i].fileName).split('.')[0]);
}

let baseMaps = {
  'OSM-Carto': OSMBaseLayer,
  'BingAerialLabels': bingAerialWithLabelsBaseMap,
};

if (transportTileLayerKey) {
  baseMaps.Transport = transportTileLayer;
}

if (customLayermapboxAccountName &&  customLayermapboxAccountStyleID && customLayermapboxAccountKey && customTileLayerName) {
  baseMaps[customTileLayerName] = customTileMapboxTileLayer;
}

// Layers Declaration
let layerTransitStop = L.layerGroup();
let layerFieldPictures = L.markerClusterGroup();
let layerGTFSBusStops = L.markerClusterGroup();
let pathwaysLayer; // Pathway Layer
if (document.getElementById('ADAPathwayRecords').value) {
  pathwaysLayer = L.markerClusterGroup(); // For normal/default layer use to debug use: pathwaysLayer = new L.layerGroup();
}

const customLayersArray = [];
for (let i = 0; ((i < customLayerNames.length) && (i < 7)); i++) {  
  customLayersArray[i] = L.markerClusterGroup(); // For normal/default layer use to debug use: customLayersArray[i] = new L.layerGroup();
}

// used only for Seattle tenant 
const historicPictureSeattleLayerArray = [];
for (let i = 0; (i < historicPicMetaDataLayersSeattle.length) ; i++) {  
  historicPictureSeattleLayerArray[i] = L.markerClusterGroup(); // For normal/default layer use to debug use: historicPictureSeattleLayerArray[i] = new L.layerGroup();
}

// OverLays
let overlayMaps = {};
let overlayMapsHistoricAttributeLayers = {};
let overlayMapsHistoricPictureLayers = {};
overlayMaps['Transit-Stops'] = layerTransitStop;
overlayMaps['Field-Pic'] = layerFieldPictures;
overlayMaps['Bus-Stops'] = layerGTFSBusStops;
if (pathwaysLayer) {overlayMaps['Pathways'] = pathwaysLayer;}

for (let i = 0; ((i < customLayerNames.length) && (i < 7)); i++) {
  overlayMapsHistoricAttributeLayers[`<span style='color: ${iconColorArray[i]}'>${customLayerNames[i]}</span>`] = customLayersArray[i];
}

// used only for Seattle tenant 
for (let i = 0; (i < historicPicMetaDataLayersSeattle.length); i++) {
  overlayMapsHistoricPictureLayers[`<span style='color: ${histPicIconColorArray[i]}'>${Object.keys(historicPicMetaDataLayersSeattle[i])[0] + '-H-Pic'}</span>`] = historicPictureSeattleLayerArray[i];
}

// Map
const bbox = JSON.parse(document.getElementById('settingsRecordBbox').value);
let mapRenderer = L.canvas();
const map = new L.Map('map', {
  renderer: mapRenderer,
  fullscreenControl: {
    pseudoFullscreen: true // if true, fullscreen to page width and height
  },
  center: [(parseFloat(bbox[1]) + parseFloat(bbox[3]))/2, (parseFloat(bbox[0]) + parseFloat(bbox[2]))/2],
  maxBounds: [[parseFloat(bbox[1]), parseFloat(bbox[0])], [parseFloat(bbox[3]), parseFloat(bbox[2])]],
  minZoom: 5,
  maxZoom: 21,
  zoom: 9,
  layers: [OSMBaseLayer]
});

// Controls
let baseLayers = { 'BaseTiles': baseMaps };
let groupedOverlays = { 
  'Overlay-Layers': overlayMaps,
  'Custom/Historic-Layers': overlayMapsHistoricAttributeLayers,
  'Historic-Pictures': overlayMapsHistoricPictureLayers
 };
const groupedLayeroptions = {
  groupCheckboxes: true
};

let controlLayer = L.control.groupedLayers(baseMaps, groupedOverlays, groupedLayeroptions);
let measureControlLayer = L.control.polylineMeasure(measureControlOptions);
let geoSearchControlLayer = new GeoSearch.GeoSearchControl(geoSearchOptions);
let easyPrintControllerLayer = L.easyPrint({
                                            title: 'Pathway Map',
                                            position: 'topleft',
                                            sizeModes: ['A4Landscape']
});

map.addControl(controlLayer);
map.addControl(measureControlLayer);
map.addControl(geoSearchControlLayer);
map.addControl(easyPrintControllerLayer);

// GTFS Bus Stops Layer Methods
function popupMessageBusStops(busStopsRecord) {
  const privateOSMURL = document.getElementById('osmEndpoint').value;
  const popupURL = privateOSMURL + '/#map=19/' + busStopsRecord.lat + '/' + busStopsRecord.lon + '&layers=ND';
  return `<a href=${popupURL} target="_blank">OSM</a>` + 
    '<table border = "1"><tr>' +
    `<tr><td>BUS-StopID</td><td>${busStopsRecord.id}</td></tr>` + 
    `<tr><td>Address</td><td>${busStopsRecord.name}</td></tr>` +  
    '</tr></table>';
}

function addLayerGTFSBusStops(layerGTFSBusStopsParam, busStopsRecord) {
  layerGTFSBusStopsParam.addLayer(
    L.circleMarker([busStopsRecord.lat, busStopsRecord.lon],
      {
        color: iconColorArray[1],
        fillOpacity: 0.3,
        fillColor: iconColorArray[0],
      },
    ).bindTooltip('GTFS-Bus-Stop').bindPopup(popupMessageBusStops(busStopsRecord))
  );
}

async function drawAllGTFSBusStops(layerGTFSBusStopsParam) {
  let OTPendpoint = document.getElementById('otpEndpoint').value;
  const busStopsEndpoint = `${OTPendpoint.split('/plan')[0]}/index/stops`;
  let busStopsDataset;
  let response;
  
  response = await fetch(busStopsEndpoint);
  if (response.ok) {
    busStopsDataset = await response.json();

    for (let i = 0; i < busStopsDataset.length; i++) {
      addLayerGTFSBusStops(layerGTFSBusStopsParam, busStopsDataset[i]);
    } 

  } else{
    window.alert('An error occured fetching, from OTP-Endpoint BUS Stops: ' + response.status);
    busStopsData = [];
  } 

}

drawAllGTFSBusStops(layerGTFSBusStops);

// Pathway Layer Methods
async function drawPathways(pathwayRecords, mode, colorParam) {

  let clusterMarkersPathwaysList = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true
  });

  function popupMessagePathway(positionName, pathwayRecordParam) {
    return `<a href=${window.location.origin}/pathwayItinerary/update?tripRequestId=${pathwayRecordParam.tripRequestsId} ><b>${positionName}</b></a>` +
      '<table border = "1"><tr>' +
      `<tr><td>PathwayID</td><td>${pathwayRecordParam.id}</td></tr>` + 
      `<tr><td>TripH.ID</td><td>${pathwayRecordParam.tripRequestsId}</td></tr>` + 
      `<tr><td>ClientID</td><td>${pathwayRecordParam.TripRequestModel.ClientProfileModel.clientId}</td></tr>` + 
      `<tr><td>Status</td><td>${(pathwayRecordParam.TripRequestModel.status ? pathwayRecordParam.TripRequestModel.status : ' -')}</td></tr>` + 
      `<tr><td>DateAdded</td><td>${pathwayRecordParam.TripRequestModel.DateAdded}</td></tr>` + 
      `<tr><td>DateComp.</td><td>${(pathwayRecordParam.TripRequestModel.dateCompleted ? pathwayRecordParam.TripRequestModel.dateCompleted : ' -') }</td></tr>` + 
      `<tr><td>Officer</td><td>${pathwayRecordParam.TripRequestModel.OfficerModel.lastName}, ${pathwayRecordParam.TripRequestModel.OfficerModel.firstName}</td></tr>` + 
      '</tr></table>';
  }

  function drawMarkerOriginDestination(pLat, pLon, dLat, dLon, pathwayRecordParam, mode, colorParam) {
    if (mode == 'addToLayer') {
      pathwaysLayer.addLayer(
        L.circleMarker([pLat, pLon],
          {
            color: colorParam,
            fillOpacity: 0.3,
            fillColor: '#ff0000',
          },
        ).bindTooltip(`Pathways, PID: ${pathwayRecordParam.id}`).bindPopup(popupMessagePathway('Origin', pathwayRecordParam))
      );
      pathwaysLayer.addLayer(L.circleMarker([dLat, dLon],
          {
            color: colorParam,
            fillOpacity: 0.3,
            fillColor: '#0000ff',
          },
        ).bindTooltip(`Pathways, PID: ${pathwayRecordParam.id}`).bindPopup(popupMessagePathway('Destination', pathwayRecordParam))
      );
    } else if (mode == 'addToMap') {
      clusterMarkersPathwaysList.addLayer(
        L.circleMarker([pLat, pLon],
        {
          color: colorParam,
          fillOpacity: 0.3,
          fillColor: '#ff0000',
        },
      ).bindTooltip(`Pathways, PID: ${pathwayRecordParam.id}`).bindPopup(popupMessagePathway('Origin', pathwayRecordParam))).addTo(map);
      
      clusterMarkersPathwaysList.addLayer(
        L.circleMarker([dLat, dLon],
          {
            color: colorParam,
            fillOpacity: 0.3,
            fillColor: '#0000ff',
          },
        ).bindTooltip(`Pathways, PID: ${pathwayRecordParam.id}`).bindPopup(popupMessagePathway('Destination', pathwayRecordParam))).addTo(map);
    }
  }

  function markPathwayRecordsOriginDestination(pathwayRecordParam, mode, colorParam) {
    let pathwayItineraryRecord = JSON.parse(pathwayRecordParam.pathwayItinerary);
    if (pathwayItineraryRecord) {
      drawMarkerOriginDestination(pathwayItineraryRecord.plan.from.lat, pathwayItineraryRecord.plan.from.lon,
        pathwayItineraryRecord.plan.to.lat, pathwayItineraryRecord.plan.to.lon, 
        pathwayRecordParam, 
        mode,
        colorParam
      );
    } else {
        if ((pathwayRecordParam.TripRequestModel.pLat) && 
            (pathwayRecordParam.TripRequestModel.pLon) && 
            (pathwayRecordParam.TripRequestModel.dLat) &&
            (pathwayRecordParam.TripRequestModel.dLon)
          ) {
            drawMarkerOriginDestination(pathwayRecordParam.TripRequestModel.pLat,
                                        pathwayRecordParam.TripRequestModel.pLon,
                                        pathwayRecordParam.TripRequestModel.dLat,
                                        pathwayRecordParam.TripRequestModel.dLon,
                                        pathwayRecordParam, 
                                        mode,
                                        colorParam
                                      );
          }
          // ToDo Hsidelil only use for troubleshooting, exception case where lat lon is missing. Add to logging.
          // else {
          //     console.log('lat and lon not found for both Origin/Destination');
          // }
    }

  }

  function drawRouteLinesForPathways(pathwayRecordParam, mode, colorParam) {
    let pathwayItineraryRecord = JSON.parse(pathwayRecordParam.pathwayItinerary);
    let itin;
    let geojson;
    if (pathwayItineraryRecord) {
      itin = pathwayItineraryRecord.plan.itineraries[pathwayRecordParam.selectedItinNumber];
      for (let i = 0; i < itin.legs.length; i++) {
        const leg = itin.legs[i].legGeometry.points;
        const geomLeg = polyline.toGeoJSON(leg);
        // Mark walk route only with dotted line
        if (itin.legs[i].mode === 'WALK') {
          geojson = L.geoJSON(geomLeg, {
            style: function(feature) { return {color: colorParam, weight: 7, opacity: 0.7, dashArray: '5, 10', lineCap: 'square',}},
            onEachFeature: function (feature, layer) {
              layer.bindTooltip(`Pathways, PID: ${pathwayRecordParam.id}`).bindPopup(popupMessagePathway('Walk Way', pathwayRecordParam));
            }
          });
          if (mode == 'addToLayer') { pathwaysLayer.addLayer(geojson); }
          else if (mode == 'addToMap') { clusterMarkersPathwaysList.addLayer(geojson).addTo(map); }
        }
      }
    } 
    // ToDo Hsidelil only use for troubleshooting, note all PRT data does not have lines geometry, 
    // else {
    //   console.log('no pathway itinerary line geometry');
    // }
  }

  function drawAllPathways(pathwayRecordsParam, mode, colorParam) {
    for (let i = 0; (i < pathwayRecordsParam.length) ; i++) {   
      markPathwayRecordsOriginDestination(pathwayRecordsParam[i], mode, colorParam);
      drawRouteLinesForPathways(pathwayRecordsParam[i], mode, colorParam);
    } 
  }

  await Promise.resolve(drawAllPathways(pathwayRecords, mode, colorParam));
    
}

if (document.getElementById('ADAPathwayRecords').value) {
  drawPathways(JSON.parse(document.getElementById('ADAPathwayRecords').value),'addToLayer' , iconColorArray[2]);
}

// custom/historic Layers Methods
async function addCustomLayer(layerCustomName, layerCustom, iconColor, geoData) {
  const circleColorOption = {
    color: iconColor,
    fillOpacity: 0.1,
    fillColor: '#E5E5E5',
    radius: 14
  };
  let popupMessage = '';
  const OSMEndPoint = document.getElementById('osmEndpoint').value;
  let fullURL = '';
  await Promise.resolve(layerCustom.addLayer(L.geoJson(geoData ,{
      pointToLayer: function (feature, latLng) {
        fullURL = OSMEndPoint + '/#map=19/' + latLng.lat + '/' + latLng.lng + '&layers=ND';
        return L.circleMarker(latLng, circleColorOption);
      },
      onEachFeature: function(feature, featureLayer) {
        popupMessage = `<a href=${fullURL} target="_blank">OSM</a><table border = "1"><tr>`;
        Object.keys(feature.properties).forEach(function(subKey) {
        if ((feature.properties[subKey] !== null) && (feature.properties[subKey] !== '') && (subKey !== 'Lat') && (subKey !== 'Lon')) { 
          popupMessage = popupMessage + '<tr>' + '<td>' + subKey + '</td>' + '<td>' + feature.properties[subKey] + '</td>' + '</tr>'; 
        }
        })
        popupMessage = popupMessage + '</tr></table>';
        featureLayer.bindTooltip(layerCustomName).bindPopup(popupMessage);
        popupMessage = '';
      },
      style: function (feature) { return { color: iconColor };}
    }))
  );
}

for (let i = 0; ((i < customLayerNames.length) && (i < 7)); i++) {  
  addCustomLayer(customLayerNames[i], customLayersArray[i], iconColorArray[i], customLayerData[i].fileData);
}

// Field Pictures Layer Methods
async function addFieldPicLayer(layerFieldPicturesParm, fieldReviewRecords) {
  let latLon;
  const fieldPicTriangleOption = {
    renderer: mapRenderer,    // canvas renderer (default: L.canvas())
    color: '#ffff00',         // Yellow color
    rotation: 0,             // triangle rotation in degrees (default: 0)
    width: 14,              // width of the base of triangle (default: 24)
    height: 16,             // height of triangle (default: 24)
  };

  function initAWS(regionAWSAcc, accessKeyIdAWSAcc, secretAccessKeyAWSAcc) {
    AWS.config.region = regionAWSAcc;
    AWS.config.update({
            accessKeyId: accessKeyIdAWSAcc,
            secretAccessKey: secretAccessKeyAWSAcc
    });
    return new AWS.S3();
  }

  function getPicURL(s3APIObj, bucketNameS3, fileNameS3, expTime) {
    return s3APIObj.getSignedUrl('getObject', {
        Bucket: bucketNameS3,
        Key: fileNameS3,
        Expires: expTime
    });
  }

  function buildPicMsg(picMeta) {
    const regionAWS = document.getElementById('cognitoRegion').value; 
    const accessKeyIdAWS = document.getElementById('s3AccessKeyId').value;
    const secretAccessKeyAWS = document.getElementById('s3SecretAccessKey').value;
    const bucketName = document.getElementById('s3BucketName').value;
    const OSMEndPoint = document.getElementById('osmEndpoint').value;
    const signedUrlExpSecs = 60 * 60 ; // in-seconds 

    let s3 = initAWS(regionAWS, accessKeyIdAWS, secretAccessKeyAWS);
    const OSMURL = OSMEndPoint + '/#map=19/' + picMeta.latLng[0] + '/' + picMeta.latLng[1] + '&layers=ND';
    let urlPic = getPicURL(s3, bucketName, picMeta.fileName, signedUrlExpSecs);
    let picMsg = '<figure><a href="' + OSMURL + '" target="_blank">OSM</a>' + 
      '<a href="'+ urlPic + '" target="_blank"><img src=' + '"' + urlPic + 
      '"' + ' alt="loading Picture" style="width:auto; max-width:200px;max-height:200px;">' + 
      '<figcaption>' + 'FR_ID:' + picMeta.fieldReviewID + ', ' + picMeta.pictureDate +
      '</figcaption></a><figure>';
    return picMsg;
  }
  
  if (fieldReviewRecords) {
    for (let i = 0; (i < fieldReviewRecords.length); i++) {
      if (fieldReviewRecords[i].fieldPicturesMeta) {
        for (let j = 0; (j < fieldReviewRecords[i].fieldPicturesMeta.length); j++) {
          latLon = fieldReviewRecords[i].fieldPicturesMeta[j].latLng;
          if (latLon[0] !==0 && latLon[1] !==0 ) {
            await Promise.resolve(
              layerFieldPicturesParm.addLayer(
                L.triangleMarker(latLon,
                  fieldPicTriangleOption).bindTooltip('Field-Pic').bindPopup(
                    buildPicMsg(fieldReviewRecords[i].fieldPicturesMeta[j]),
                    { maxWidth: "auto" }
                )
              )
            );
          }
        }
      }
    }
  } else { return; }
}
addFieldPicLayer(layerFieldPictures, JSON.parse(document.getElementById('fieldReviewRecords').value));

// Historic Pictures Layers only for KCM Tenant Methods
async function historicPicLayerAddSeattle(mapLayer, layerColor, histPicMetaData) {
  const triangleOption = {
    renderer: mapRenderer,    // canvas renderer (default: L.canvas())
    color: layerColor,
    rotation: 0,              // triangle rotation in degrees (default: 0)
    width: 14,                // width of the base of triangle (default: 24)
    height: 18,               // height of triangle (default: 24)
  };
  const histPicPath = '/images/historicPictures/';
  
  function displayHistPicLayer(layerName, layerMetaData) {
    let slideshowContent;
    const layerTag = '-H-Pic';
    for (let i = 0; (i < layerMetaData.length); i++) {
      for (let j = 0; (j < layerMetaData[i].file_names.length); j++) {
        slideshowContent += '<div class="image' + (j === 0 ? ' active' : '') + '">' +
        '<a href="'+ histPicPath + layerName + '/' + layerMetaData[i].dir_name + '/' + layerMetaData[i].file_names[j] + '" target="_blank">' +
          '<img src="' + histPicPath + layerName + '/' + layerMetaData[i].dir_name + '/' + layerMetaData[i].file_names[j] + '"' +
          ' alt="loading Picture" style="width:auto; max-width:200px;max-height:200px;"></a>' +
          '<div class="caption">' + layerName + layerTag + ': ' + (j+1) + '/' + layerMetaData[i].file_names.length + '</div>' +
        '</div>';
      }
      let popupContent =  '<div id="' + layerName + '" class="popup">' +
      '<div class="slideshow">' +
          slideshowContent +
      '</div>' +
      '<div class="cycle">' +
          '<a href="#" class="prev">&laquo; Previous</a>' +
          '<a href="#" class="next">Next &raquo;</a>' +
      '</div>'
      '</div>';
      mapLayer.addLayer(L.triangleMarker([layerMetaData[i].lat, layerMetaData[i].lon],
        triangleOption).bindTooltip(layerName + layerTag).bindPopup( popupContent, { maxWidth: "auto" } )
      );
      slideshowContent = '';
      popupContent = '';
    }
  }
  
  await Promise.resolve(displayHistPicLayer(Object.keys(histPicMetaData)[0], Object.values(histPicMetaData)[0]));

  await Promise.resolve(
    $('#map').on('click', '.popup .cycle a', function() {
      var $slideshow = $('.slideshow'),
          $newSlide;

      if ($(this).hasClass('prev')) {
          $newSlide = $slideshow.find('.active').prev();
          if ($newSlide.index() < 0) {
              $newSlide = $('.image').last();
          }
      } else {
          $newSlide = $slideshow.find('.active').next();
          if ($newSlide.index() < 0) {
              $newSlide = $('.image').first();
          }
      }

      $slideshow.find('.active').removeClass('active').hide();
      $newSlide.addClass('active').show();
      return false;
    })
  );
}

for (let i = 0; (i < historicPicMetaDataLayersSeattle.length); i++) {
  historicPicLayerAddSeattle(historicPictureSeattleLayerArray[i], histPicIconColorArray[i], historicPicMetaDataLayersSeattle[i]);
}

// Export to GeoJSON map control methods
function getDateTimeString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day =`${date.getDate()}`.padStart(2, '0');
  const hour =`${date.getHours()}`.padStart(2, '0');
  const minute =`${date.getMinutes()}`.padStart(2, '0');
  const second =`${date.getSeconds()}`.padStart(2, '0');
  return `${year}_${month}_${day}T${hour}${minute}${second}`;
}

function createExportFile(data, fileName) {
  let exportElement;
  exportElement = document.createElement('a');
  exportElement.id = 'export';
  exportElement.style.display = 'none';
  exportElement.setAttribute('href', 'data:' + data);
  exportElement.setAttribute('download', fileName);
  document.body.appendChild(exportElement);
  exportElement.click();
  document.body.removeChild(exportElement);
}

function addLayersFeatureGroup() {
  let allLayersFeatureGroup = L.featureGroup();
  map.eachLayer((layer) => {
    allLayersFeatureGroup.addLayer(layer);
  });
  
  return allLayersFeatureGroup;
}

function countLayers() {
  let layercount = 0;
  map.eachLayer((layer) => {
    layercount+=1;
  });
  
  return layercount;
}

function exportGeoJSON() {
  
  let geoJSONLayersData;
  let convertedDataURI;
  
  const exportFileName = `commonPathsMapDataExport${getDateTimeString()}.geojson`;
  const allLayersFeatureGroup = addLayersFeatureGroup();

  geoJSONLayersData = allLayersFeatureGroup.toGeoJSON();
  convertedDataURI = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJSONLayersData));

  createExportFile(convertedDataURI, exportFileName);

}

L.easyButton('fa-download', function(btn, map){
  if (countLayers() != 1) {
    if (window.confirm('Download the selected layer(s) geomerty?')) {
      exportGeoJSON();
    }
  } else {
    window.alert('No layer(s) selected, cannot export geometry');
  }
}, 'Download GeoJSON').addTo(map);

function isFloat(val) {
  const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
  if (!floatRegex.test(val))
      return false;

  val = parseFloat(val);
  if (isNaN(val))
      return false;
  return true;
}

// On map Click to get coordinates for OTP formulation
map.on('click', (e) => {	  
  let latlng = e.latlng;
  if (document.getElementById('fromAddress') && document.getElementById('toAddress')) {
    if (document.getElementById('fromAddress').value === '') {
      $('#fromAddress').val(`${latlng.lat},${latlng.lng}`);
    } else if (document.getElementById('toAddress').value === '') {
      $('#toAddress').val(`${latlng.lat},${latlng.lng}`);
    }
  }
});

// Generic GeoCoding Method
async function geocodeAddressOnly(address) {
  map.spin(true);
  const geocoderURL = document.getElementById('geocoderEndpoint').value;
  const apiData = {
      format: 'json',
      addressdetails: 1,
      q: address,
      limit: 1,
  };

  return [await new Promise((resolve, reject) => {
      $.ajax({
      url: geocoderURL,
      type: 'GET',
      dataType: 'json',
      data: apiData,
      success: (pointCoor) => {resolve(pointCoor); map.spin(false);},
      error: (err) => {reject(err);  map.spin(false);},
      });
  })];
}

//GeoCoding for OTP API Method
async function geocodeFromToAddress(address) {
  const geocoderURL = document.getElementById('geocoderEndpoint').value;
  const apiData = {
    format: 'json',
    addressdetails: 1,
    q: address,
    limit: 1,
  };
  return await new Promise((resolve, reject) => {
    $.ajax({
      url: geocoderURL,
      type: 'GET',
      dataType: 'json',
      data: apiData,
      success: (pointCoor) => {resolve(pointCoor);},
      error: (err) => {reject(err);},
    });
  });
}

// OTP API Methods
function formulateRoute() {
  const fromAddress = document.getElementById('fromAddress').value;
  const toAddress = document.getElementById('toAddress').value;

  isFromToCoordinateORAddress = (isFloat(fromAddress.split(',')[0]) && isFloat(toAddress.split(',')[0]));
  isFromCoordinateANDToAddress = (isFloat(fromAddress.split(',')[0]));
  isToCoordinateANDFromAddress = (isFloat(toAddress.split(',')[0]));

  if (isFromToCoordinateORAddress) {
    calculateRoute(fromAddress, toAddress);
  } else if (!isFromToCoordinateORAddress) {
    Promise.all([geocodeFromToAddress(fromAddress), geocodeFromToAddress(toAddress)]).then(function(values) {
      calculateRoute(`${values[0][0].lat},${values[0][0].lon}`, `${values[1][0].lat},${values[1][0].lon}`);
    }).catch(function(err) {
      alert('geocoding error' + err);
    });
  } else if (isFromCoordinateANDToAddress) {
    Promise.all([geocodeFromToAddress(toAddress)]).then(function(values) {
      calculateRoute(fromAddress, `${values[0][0].lat},${values[0][0].lon}`);
    }).catch(function(err) {
      alert('geocoding error' + err);
    });
  } else if (isToCoordinateANDFromAddress) {
    Promise.all([geocodeFromToAddress(fromAddress)]).then(function(values) {
      calculateRoute(`${values[0][0].lat},${values[0][0].lon}`, toAddress);
    }).catch(function(err) {
      alert('geocoding error: ' + err);
    });
  } else {alert('Error Empty From and To');} 
}

function calculateRoute(fromPoint, toPoint) {
  const attributes = {
    fromPlace: fromPoint,
    toPlace: toPoint,
    arriveBy: $('#arriveBy').val(),
    date: $('#date').val(),
    maxTransfers: parseInt($('#maxTransfers').val()),
    maxWalkDistance: 0.3048 * parseFloat($('#maxWalkDistance').val()),
    mode: JSON.stringify($('#mode').val()).replace(/[[\]"]+/g, ''),
    wheelchair: $('#wheelchair').val(),
    numItineraries: 3,
    geoidElevation: true,
    maxSlope: parseFloat($('#maxSlope').val()),
    showIntermediateStops: false,
    optimize: $('#optimize').val(),
  };
  makeRoutingQuery(
    attributes,
  );
}

function setHeader(xhr) {
  xhr.setRequestHeader('Accept', 'application/json');
}

function makeRoutingQuery(attributes) {
  $.ajax({
    url: document.getElementById('otpEndpoint').value,
    type: 'GET',
    dataType: 'json',
    data: attributes,
    success: drawRoute,
    error: calculateRouteError,
    beforeSend: setHeader,
  });
}

function createRouteInstruction(data, numItin) {
  if (!data) { return []; }
  const itin = data.plan.itineraries[numItin];
  let routeInstruction = [];
  let routeInstructionJSON = {};
  let slopes;
  let checkSlopeADACompliant ;
  let SlopeValue;
  let averageRange;
  for (let i = 0; i < itin.legs.length; i++) {
    routeInstructionJSON['from'] = itin.legs[i].from.name;
    routeInstructionJSON['mode'] = itin.legs[i].mode;
    if (itin.legs[i].mode === 'WALK') {
      routeInstructionJSON['walkDistance'] = Math.round(3.28084 * parseFloat(itin.legs[i].distance));
      routeInstructionJSON['steps'] = [];
      for (let s = 0; s < itin.legs[i].steps.length; s++) {
        slopes = calculateSlopes(itin.legs[i].steps[s]);
        averageRange = slopeAverageRange(calculateMean(slopes), standardDeviation(slopes));
        checkSlopeADACompliant  = ((Math.abs(averageRange[0]) >= 7) || (Math.abs(averageRange[1]) >= 7));
        SlopeValue = (averageRange[0]).toString() + ' ~ ' +
         (averageRange[1]).toString() + ' %';

        routeInstructionJSON.steps.push({
          streetName:itin.legs[i].steps[s].streetName, 
          relativeDirection:itin.legs[i].steps[s].relativeDirection,
          absoluteDirection:itin.legs[i].steps[s].absoluteDirection,
          distance: Math.round(3.28084 * parseFloat(itin.legs[i].steps[s].distance)),
          slope: SlopeValue,
          isSlopeADACompliant: !checkSlopeADACompliant ,
          barriers: '',
          notes:''
        });
      }
    } 
    else {
      routeInstructionJSON['busNumber'] = itin.legs[i].route;
      routeInstructionJSON['busStopFrom'] = {name: itin.legs[i].from.stopId, shelter: '', bench: '', light: '', barriers: '', notes: ''};
      routeInstructionJSON['busStopTo'] = {name: itin.legs[i].to.stopId, shelter: '', bench: '', light: '', barriers: '', notes: ''};
    }
    routeInstructionJSON['to'] = itin.legs[i].to.name;
    routeInstruction[i] = routeInstructionJSON;
    routeInstructionJSON = {};
  }
  return routeInstruction;
}

function saveItinerary(data, url) {
  if (data[0] === undefined) { 
    window.alert('No Map Data to Save/Update'); 
    return;
  } else {
    $.post(url, {pathwayData: data[0],
      selectedItinNumber: data[1],
      routeInstruction: data[2],
      ADAPathwayId: data[3],
      tripDurationTime: data[4],
    },function(data, status, xhr) {
        window.alert(data.s_status + ": " + status + ' , Reloading page ...');
        window.location.reload();
      });
  }
}

function markerURL(e) {
  const OSMEndPoint = document.getElementById('osmEndpoint').value;
  const fullURL = OSMEndPoint + '/#map=19/' + e.latlng.lat + '/' + e.latlng.lng + '&layers=ND';
  window.open(fullURL);
}

// Clear all mapped layers except first tile layer and set zoom level
function clearMap() {
  map.eachLayer((layer) => {
    map.removeLayer(layer);
  });
  baseMaps['OSM-Carto'].addTo(map);
  map.setView([(parseFloat(bbox[1]) + parseFloat(bbox[3]))/2, (parseFloat(bbox[0]) + parseFloat(bbox[2]))/2], 9);
  if (document.body.contains(document.getElementById('instructionId'))) {
    document.getElementById("instructionId").remove();
}
}

function drawCircleAndPopup(stopId, busId, lat, lon) {
  let messageStopValue = `<br>${stopId}</br><br>Bus:${busId}</br>`;
  layerTransitStop.addLayer(L.circleMarker([lat, lon],
    transitMarkerCircleColor).bindTooltip(messageStopValue).on('click', markerURL).addTo(map));
  layerTransitStop.addLayer(L.marker([lat, lon], { icon: busStopYellowIcon })
  .bindPopup(messageStopValue).bindTooltip(messageStopValue).on('click', markerURL).addTo(map));
  layerTransitStop.addLayer(L.popup({ closeButton: true, closeOnClick: false, maxWidth: 100, minWidth: 20 })
    .setLatLng([lat, lon])
    .setContent(messageStopValue));
}

// Condition of the pathway itinirary where there is a busId change on the same stopId
function busChangeWithoutWalkSameStop(i, itin) {
  return ((i !== 0) && (i !== (itin.legs.length - 1)
          && (itin.legs[i - 1].route !== '') && (itin.legs[i - 1].route !== itin.legs[i].route)
          && (itin.legs[i].mode !== 'WALK')));
}

function drawPathwayMarkerPopup (itin) {
  let latLon;
  let busId;
  let stopId;
  for (let i = 0; i < itin.legs.length; i++) {
    if (i === 0) {
      if (Object.keys(itin.legs[i].from).includes('stopId')) {
        latLon = [itin.legs[i].from.lat, itin.legs[i].from.lon];
        busId = itin.legs[i].route;
        stopId = itin.legs[i].to.stopId;
      } else if (itin.legs[i].mode === 'WALK') {
        latLon = [itin.legs[i].to.lat, itin.legs[i].to.lon];
        busId = itin.legs[i + 1].route;
        stopId = itin.legs[i].to.stopId;
      }
      drawCircleAndPopup(stopId, busId, latLon[0], latLon[1]);
    } else if ((i !== 0) && (i !== (itin.legs.length - 1) && (itin.legs[i].mode === 'WALK'))) {
      drawCircleAndPopup(itin.legs[i].from.stopId, itin.legs[i - 1].route,
        itin.legs[i].from.lat, itin.legs[i].from.lon);
      drawCircleAndPopup(itin.legs[i].to.stopId, itin.legs[i + 1].route,
        itin.legs[i].to.lat, itin.legs[i].to.lon);
    } else if (busChangeWithoutWalkSameStop(i, itin)) {
      drawCircleAndPopup(itin.legs[i].from.stopId, itin.legs[i].route,
        itin.legs[i].from.lat, itin.legs[i].from.lon);
      drawCircleAndPopup(itin.legs[i].to.stopId, itin.legs[i].route,
        itin.legs[i].to.lat, itin.legs[i].to.lon);
    } else if (i === (itin.legs.length - 1)) {
      if ((Object.keys(itin.legs[i].from).includes('stopId')) && (itin.legs[i].mode === 'WALK')) {
        latLon = [itin.legs[i].from.lat, itin.legs[i].from.lon];
        busId = itin.legs[i - 1].route;
        stopId = itin.legs[i].from.stopId;
      } else {
        latLon = [itin.legs[i].to.lat, itin.legs[i].to.lon];
        busId = itin.legs[i].route;
        stopId = itin.legs[i].from.stopId;
      }
      drawCircleAndPopup(stopId, busId, latLon[0], latLon[1]);
      // TODO: hsidelil convert the exception case to be logged
    } else {console.log('Found exception case displaying markers and popup'); } // TODO: hsidelil turn this to be logged
  }

}

function drawPathwayRouteLines(itin) {
  for (let i = 0; i < itin.legs.length; i++) {
    const leg = itin.legs[i].legGeometry.points;
    const geomLeg = polyline.toGeoJSON(leg);
    // Mark route solid for transit and dotted for walk
    L.geoJSON(geomLeg, {
      style(feature) {
        if (itin.legs[i].mode === 'WALK') {
          return {
            color: '#ff00d9', weight: 7, opacity: 0.7, dashArray: '5, 10', lineCap: 'square',
          };
        }
        return { color: '#ae00ff', weight: 7, opacity: 0.5 }; // bright darker blue #0000ff
      },
    }).addTo(map);
  }
}

function markOriginDestination(data) {
  L.marker([data.plan.from.lat, data.plan.from.lon], { icon: startIcon })
  .bindPopup('Origin').bindTooltip('Origin').addTo(map);
  L.circleMarker([data.plan.from.lat, data.plan.from.lon],
    {
      color: '#000000',
      fillOpacity: 0.3,
      fillColor: '#ff0000',
    },
  ).bindTooltip('Origin').on('click', markerURL).addTo(map);
  L.popup({ closeButton: true, closeOnClick: false })
    .setLatLng([data.plan.from.lat, data.plan.from.lon])
    .setContent('Origin').addTo(map);

  L.marker([data.plan.to.lat, data.plan.to.lon], { icon: endIcon })
    .bindPopup('Destination').bindTooltip('Destination').addTo(map);
  L.circleMarker([data.plan.to.lat, data.plan.to.lon],
    {
      color: '#000000',
      fillOpacity: 0.3,
      fillColor: '#0000ff',
    },
  ).bindTooltip('Destination').on('click', markerURL).addTo(map);
  L.popup({ closeButton: true, closeOnClick: false })
    .setLatLng([data.plan.to.lat, data.plan.to.lon])
    .setContent('Destination').addTo(map);
}

function calculateMean(slopes) {
  let total = 0;
  for(let i = 0; i < slopes.length; i++) {
      total += parseFloat(slopes[i]);
  }
  return Math.round(total / slopes.length);
}

function standardDeviation(slopes) {
  let diff = 0;
  for(let i = 0; i < slopes.length; i++) 
     diff += Math.pow((parseFloat(slopes[i]) - calculateMean(slopes)),2);
  return Math.round((Math.sqrt(diff/slopes.length)));
}

function slopeAverageRange(slopeMean, standardDeviation) {
  return [(slopeMean - standardDeviation), (slopeMean + standardDeviation)];
}

function calculateSlopes(steps) {
  let slopes = [];
  // handle when elevation array is zero , in the future assgin neighborhood slope average
  if (steps.elevation.length === 0){
    slopes[0] = 0;
  }
  for (let e = 0; e < steps.elevation.length; e++) {
    if (e !== ((steps.elevation.length - 1)) && ((parseFloat(steps.elevation[e + 1].first) - parseFloat(steps.elevation[e].first)) !== 0)) {
      slopes.push(((parseFloat(steps.elevation[e + 1].second) - parseFloat(steps.elevation[e].second)) /
        (parseFloat(steps.elevation[e + 1].first) - parseFloat(steps.elevation[e].first))) * 100);  
    } 
  }
  return slopes;
}

function walkPathwaySlopeMarkerPopup(itin) {
  let slopes;
  let messageSlopeValue;
  let checkSlopeADA;
  let averegeRange;
  for (let i = 0; i < itin.legs.length; i++) {
    if (itin.legs[i].mode === 'WALK') {
      for (let s = 0; s < itin.legs[i].steps.length; s++) {
        slopes = calculateSlopes(itin.legs[i].steps[s]);
        averegeRange = slopeAverageRange(calculateMean(slopes), standardDeviation(slopes));
        checkSlopeADA = ((Math.abs(averegeRange[0]) >= 7) || (Math.abs(averegeRange[1]) >= 7));
        messageSlopeValue = `<br>${averegeRange[0]}~ ${averegeRange[1]}%</br>`;
        
        L.marker([itin.legs[i].steps[s].lat, itin.legs[i].steps[s].lon], 
          { icon: checkSlopeADA === true ? slopeNonADAIcon : slopeNormalIcon }
          ).bindPopup(messageSlopeValue).bindTooltip(messageSlopeValue).on('click', markerURL).addTo(map);
      }
    }
  }
}

function drawRoute(data) {

  if (data == undefined || data === null) {
    window.alert('No Map data');
    return;
  } else if (data.error) {
    alert(data.error.msg);
    return;
  }

  clearMap();
  
  // Send raw route data for ADA Pathway Itinerary Save/Update
  document.getElementById('itinData').value = JSON.stringify(data);

  const numItin = $('#numItin').val();
  //console.log('numItin', numItin, 'drawRoute', data); // only enable for debugging issues or testing

  const itin = data.plan.itineraries[numItin];
  
  // Draw the route of the OTP itinerary
  drawPathwayRouteLines(itin);

  // Marking circles and popups with bus StopID and route/bus number
  if ((!data.requestParameters.mode.includes('CAR')) && (!data.requestParameters.mode.includes('BICYCLE'))) {
    drawPathwayMarkerPopup (itin);
  }
  
  // Calculate and mark slope for walking pathways
  walkPathwaySlopeMarkerPopup(itin)

  // Show Origin and Destination points/markers
  markOriginDestination(data);

  // Zoom to show the full pathway
  map.fitBounds(L.latLngBounds([data.plan.from.lat, data.plan.from.lon],
    [data.plan.to.lat, data.plan.to.lon]));
}

function calculateRouteError(error) {
  alert('Error during route calculation :'+ error);
  // add console.log('Routing error', error); to print error
  // TODO: hsidelil turn this to be logged
}