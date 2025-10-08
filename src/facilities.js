const capitalize = (input) => {
    return input
        .toLowerCase()
        .split(' ')
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
};

const standardizeJSON = (data) => {
    data.forEach((e) => {
        const attributes = e.attributes;

        if (attributes.icf === 'T')
            attributes.icf = ['T', 'Provides intermediate care services'];
        else if (attributes.icf === 'F')
            attributes.icf = [
                'F',
                'Does not provide intermediate care services',
            ];

        if (attributes.saeligible === 'T')
            attributes.saeligible = [
                'T',
                'Provides special assistance for adult care services',
            ];
        else if (attributes.saeligible === 'F')
            attributes.saeligible = [
                'F',
                'Does not provide special assistance for adult care',
            ];

        if (attributes.stype === 'Nursing Home Facilit')
            attributes.stype = 'Nursing Home Facility';

        if (attributes.stype === 'Cardiac Rehabilitati')
            attributes.stype = 'Cardiac Rehabilitation';

        if (attributes.stype === 'Mental Health Hospit')
            attributes.stype = 'Mental Health Hospital';

        if (attributes.fphone === ' ')
            attributes.fphone = 'No phone number listed';

        if (attributes.address === ' ')
            attributes.address = 'No address listed';

        if (attributes.szip === 0) attributes.szip = '';
    });

    return data;
};

const fetchFacilities = async (city) => {
    const URL = `https://services.nconemap.gov/secure/rest/services/NC1Map_Health/MapServer/2/query?where=scity%3D%27${encodeURIComponent(
        capitalize(city)
    )}%27&outFields=stype,address,scity,sstate,szip,fphone,fcounty,saeligible,facility,rehab,hospice,homecare,concare,adcp,nsgsvcs,ptsv,otsv,spsv,swsv,icf,alzlic,hivlic,hagenlic&outSR=4326&f=json`;
    try {
        const res = await fetch(URL);
        const data = await res.json();

        const facilities = data.features;

        return standardizeJSON(facilities);
    } catch (err) {
        console.log('Failed to fetch facilities:', err);
    }
};

module.exports = fetchFacilities;
