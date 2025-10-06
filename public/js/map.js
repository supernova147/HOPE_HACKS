// DOCUMENTATION: https://developers.google.com/maps/documentation/javascript/load-maps-js-api#migrate-to-dynamic \\
let map;
const defaultCoor = { lat: 35.227085, lng: -80.843124 }; // default center coordinates: Charlotte, NC
const NCbounds = {
    north: 36.59,
    south: 33.85,
    west: -84.33,
    east: -75.46,
};
let markers = [];
let userMarker;
let openedInfoWindow;
// NOTE: markers[0] will always house the user marker as it is the first marker rendered

const initMap = async () => {
    const { Map } = await google.maps.importLibrary('maps');
    map = new Map(document.getElementById('map'), {
        center: defaultCoor,
        zoom: 12,
        restriction: {
            latLngBounds: NCbounds,
            strictBounds: true,
        },
        mapId: 'a23b767cb32962acd3094bd2',
    });

    console.log('Maps JS API loaded');
    userMarker = await addUserMarker(defaultCoor);
    markers.push(await renderFacilities('Charlotte'));
};

const addUserMarker = async (coor) => {
    const { AdvancedMarkerElement, PinElement } =
        await google.maps.importLibrary('marker');

    const personImg = document.createElement('img');
    personImg.src = new URL('../img/person.png', import.meta.url).href;
    // IMG ATTRIBUTION: <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by juicy_fish - Flaticon</a>

    const userPin = new PinElement({
        glyph: personImg,
    });
    // NOTICE! Change z-index to be on top of other markers
    const userMarker = new AdvancedMarkerElement({
        map,
        position: coor,
        content: personImg,
        title: 'Marker',
    });
    // console.log('Rendered marker: ', userMarker.position);
    return userMarker;
};

const addFacilityMarker = async (coor) => {
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    const facilityMarker = new AdvancedMarkerElement({
        map,
        position: coor,
        collisionBehavior:
            google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
        title: 'Marker',
    });

    // console.log('Rendered marker: ', facilityMarker.position);
    return facilityMarker;
};

const addInfoBox = async (feature, marker) => {
    const { InfoWindow } = await google.maps.importLibrary('maps');
    const attributes = feature.attributes;

    const contentString = `<h1 class="info-window__name">${attributes.facility}</h1>
    <p class="info-window__type">${attributes.stype}</p>
    <div class="info-window__contact>
        <p class="info-window__contact-phone">Phone Number: ${attributes.fphone}</p>
    </div>
    <div class="info-window__location>
        <p class="info-window__location-address">${attributes.address}</p>
        <p class="info-window__location-city-state-zip">${attributes.scity} ${attributes.sstate} ${attributes.szip}</p>
    </div>
    <div class="info-window__services">
        <p class="info-window__services-icf">${attributes.icf[1]}</p>
        <p class="info-window__services-saeligible">${attributes.saeligible[1]}</p>
    </div>`;

    const infoWindow = new InfoWindow({
        content: contentString,
        ariaLabel: marker.attributes.facility,
    });

    marker.addEventListener('click', () => {
        if (openedInfoWindow) openedInfoWindow.close();
        infoWindow.open({
            anchor: marker,
            map,
        });
        openedInfoWindow = infoWindow;
    });
};

// DOCUMENTATION: https://developers.google.com/maps/documentation/javascript/reference/geocoder \\
const geocode = async (address, userFilters = null) => {
    const { Geocoder } = await google.maps.importLibrary('geocoding');
    const geocoder = new Geocoder();

    // ISSUE: The API expects a callback, so have to make it promise-based
    const res = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, async (res, stat) => {
            if (stat === google.maps.GeocoderStatus.OK) resolve(res);
            else reject(`Geocode failed: ${stat}`);
        });
    });

    const location = res[0];
    const coor = {
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng(),
    };

    userMarker.position = coor;
    map.setCenter(coor);

    const locationType = location.geometry.location_type;
    let city;
    if (locationType === 'ROOFTOP') {
        city = location.address_components[2].long_name;
    } else if (locationType === 'APPROXIMATE') {
        city = location.address_components[0].long_name;
    }

    await renderFacilities(city, userFilters);
};

const renderFacilities = async (city, userFilters = null) => {
    try {
        const fetchedFacilities = await fetch('/clinics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city, userFilters }),
        });
        const facilities = await fetchedFacilities.json();

        markers.forEach((marker) => marker.setMap(null));
        markers = [];

        // Add markers for the filtered facilities
        for (const facility of facilities) {
            const { x: lng, y: lat } = facility.geometry;
            const marker = await addFacilityMarker({ lat, lng });
            await addInfoBox(facility, marker);
            markers.push(marker);
        }
    } catch (err) {
        console.error('Failed to get facilities:', err);
    }
};

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
    try {
        const res = await fetch('/config'); // fetching the API key served by Express in the /config route
        console.log('fetch /config response:', res.status);

        const config = await res.json();

        await loadAPI(config.MAPS_API_KEY);

        console.log('Google Maps API loaded, now initializing map...');
        await initMap();
    } catch (err) {
        console.log('Failed to load API key:', err);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    loadGoogleMaps();

    // Filtering Functionality
    const filterForm = document.getElementById('map__filter-form');
    const facilityTypeSelect = document.getElementById('facility-type__select');
    const icfCheckbox = document.getElementById('icf__checkbox');
    const saeligibleCheckbox = document.getElementById('saeligible__checkbox');

    filterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userQuery =
            document.getElementById('map__inputBar').value || 'Charlotte';

        const userFilters = {
            stype: facilityTypeSelect.value || undefined,
            icf: icfCheckbox.checked ? 'T' : undefined,
            saeligible: saeligibleCheckbox.checked ? 'T' : undefined,
        };

        console.log(userFilters);

        await geocode(userQuery, userFilters); // Passing the address to geocode() and deciding whether to pass the filters or null, which makes filters optional and avoids sending an empty object to the backend
    });

    // Search Bar Functionality
    const searchForm = document.getElementById('map__searchForm');
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userQuery =
            document.getElementById('map__inputBar').value || 'Charlotte';
        await geocode(userQuery);
    });

    console.log(markers);
});

/*
ISSUES DOCUMENTATION:
- The Google Maps JavaScript API runs in the browser, not on the server. So, the this file must be on the client-side
- I have to reference my API key in the HTML file to load the API via <script>. To hide it, I made a config route via Express to be able to send the API key from back-end to front-end w/o exposing it
- map.js is running before the Google Maps API is fetched and finished, returning a ReferenceError ('google is undefined'). So, I have to explicitly make sure the API runs before map.js via a Promise

- Normally for deployment, would have a build process that'll call secrets, such as API keys (production link)---can store it in GitHub
*/
