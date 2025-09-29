// DOCUMENTATION: https://developers.google.com/codelabs/maps-platform/maps-platform-101-js#0 \\
// const { Loader } = require('@googlemaps/js-api-loader');

// const apiOptions = {
//     api: MAPS_API_KEY,
// };

// const loader = new Loader(apiOptions);
// loader.then(() => {
//     console.log('Maps JS API loaded');
//     const map = initMap();
//     const markers = addMarkers(map);
// });

// const initMap = () => {
//     const mapOptions = {
//         center: { lat: -33.860664, lng: 151.208138 }, // example coordinates
//         zoom: 8,
//     };
//     const mapContainer = document.getElementById('map');
//     const map = new google.maps.Map(mapContainer, mapOptions);
//     return map;
// };

// const addMarkers = (map) => {
//     const locations = {
//         // example locations
//         operaHouse: { lat: -33.8567844, lng: 151.213108 },
//         tarongaZoo: { lat: -33.8472767, lng: 151.2188164 },
//         manlyBeach: { lat: -33.8209738, lng: 151.2563253 },
//         hyderPark: { lat: -33.8690081, lng: 151.2052393 },
//         theRocks: { lat: -33.8587568, lng: 151.2058246 },
//         circularQuay: { lat: -33.858761, lng: 151.2055688 },
//         harbourBridge: { lat: -33.852228, lng: 151.2038374 },
//         kingsCross: { lat: -33.8737375, lng: 151.222569 },
//         botanicGardens: { lat: -33.864167, lng: 151.216387 },
//         museumOfSydney: { lat: -33.8636005, lng: 151.2092542 },
//         maritimeMuseum: { lat: -33.869395, lng: 151.198648 },
//         kingStreetWharf: { lat: -33.8665445, lng: 151.1989808 },
//         aquarium: { lat: -33.869627, lng: 151.202146 },
//         darlingHarbour: { lat: -33.87488, lng: 151.1987113 },
//         barangaroo: { lat: -33.8605523, lng: 151.1972205 },
//     };
//     const markers = [];
//     for (const location in locations) {
//         const markerOptions = {
//             map: map,
//             position: locations[location],
//         };
//         const marker = new google.maps.Marker(markerOptions);
//         markers.push(marker);
//     }
//     return markers;
// };

// module.exports = loader;

// DOCUMENTATION: https://developers.google.com/maps/documentation/javascript/load-maps-js-api#migrate-to-dynamic \\
let map;
const position = { lat: -34.397, lng: 150.644 }; // example coordinates

const initMap = async () => {
    const { Map } = await google.maps.importLibrary('maps');
    map = new Map(document.getElementById('map'), {
        center: position,
        zoom: 8,
        mapId: 'a23b767cb32962acd3094bd2',
    });

    console.log('Maps JS API loaded');
    addMarker();
};

const addMarker = async () => {
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: 'Uluru',
    });

    console.log('Rendered marker: ', marker);
};

fetch('/config')
    .then((r) => r.json())
    .then(console.log);

const loadAPI = (apiKey) => {
    // This function is loading in the Google Map's API that I can dynamically insert the API key into, and setting up the callback
    // PURPOSE: Aids in hiding API key by adding it behind the scenes, instead of in the HTML file. Ensures the API is loaded in before rendering the map
    return new Promise((resolve, reject) => {
        // prettier-ignore
        (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
            key: apiKey,
            v: "weekly",
            // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
            // Add other bootstrap parameters as needed, using camel case.
        });
        // NOTE: This snippet is a dynamic loader that takes your key + config, injects the Maps script, wires up a hidden callback (google.maps.__ib__), and gives you a clean google.maps.importLibrary API to work with
        resolve();
    });
};

const loadGoogleMaps = async () => {
    console.log('loadGoogleMaps() called');
    try {
        const res = await fetch('/config'); // fetching the API key served by Express in the /config route
        console.log('fetch /config response:', res.status);

        const data = await res.json();

        await loadAPI(data.MAPS_API_KEY);

        console.log('Google Maps API loaded, now initializing map...');
        await initMap();
    } catch (err) {
        console.log('Failed to load API key:', err);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired, starting loader...');
    loadGoogleMaps();
});

/*
ISSUES DOCUMENTATION:
- The Google Maps JavaScript API runs in the browser, not on the server. So, the this file must be on the client-side
- I have to reference my API key in the HTML file to load the API via <script>. To hide it, I made a config route via Express to be able to send the API key from back-end to front-end w/o exposing it
- map.js is running before the Google Maps API is fetched and finished, returning a ReferenceError ('google is undefined'). So, I have to explicitly make sure the API runs before map.js via a Promise
*/
