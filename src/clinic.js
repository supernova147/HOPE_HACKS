const capitalize = (input) => {
    return input
        .toLowerCase()
        .split(' ')
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
};

// TODO: Make the query dynamic by querying where query's city based on the userMarker's coordinate
const fetchFacilities = async (city) => {
    const URL = `https://services.nconemap.gov/secure/rest/services/NC1Map_Health/MapServer/2/query?where=scity%3D%27${encodeURIComponent(
        capitalize(city)
    )}%27&outFields=stype,address,scity,sstate,szip,fphone,fexten,ffax&outSR=4326&f=json`;
    try {
        const res = await fetch(URL);
        const data = await res.json();

        const facilities = data.features;
        return facilities;
    } catch (err) {
        console.log('Failed to fetch facilities:', err);
    }
};

module.exports = { fetchFacilities };
