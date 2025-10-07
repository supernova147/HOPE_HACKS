// //js
// // clinic.js
// // Data-access layer for the NC OneMap Health Clinics layer
// //single-file that contains the express server + route

// const BASE = "https://services.nconemap.gov/secure/rest/services/NC1Map_Health/MapServer/2";

// const SERVICE_TAGS = {
//     hospice: 'Hospice',
//     rehab: 'Rehab', 
//     homecare: 'Home Care',
//     respite: 'Respite', 
//     nsgsvcs: 'Skilled Nursing', 
//     ivsv: 'IV Therapy', 
//     aidesv: 'Aide Services', 
//     swsv: 'Social Work', 
//     ptsv: 'Physical Therapy', 
//     otsv: 'Occupational Therapy', 
//     spsv: 'Speech Therapy', 
//     pmsv: 'Palliative/Medical', 
//     dmesv: 'DME', 
//     splysv: 'Medical Supplies', 
// };

// const OUT_FIELDS = [
//     'facility', 
//     'faddr1',
//     'fadder2',
//     'fcity',
//     'fstate',
//     'fzip',
//     'address',
//     'scity',
//     'sstate',
//     'szip',
//     'fphone',
//     'fexten',
//     ...Object.keys(SERVICE_TAGS)
// ].join(',');

// function safeSql(s = ''){
//     return String(s).replace(/'/g,"''");
// }

// function buildWhere({nameLike, county, services, matchMode}){
//     const parts = ['1=1']; //default filtering
//     if (nameLike) parts.push(`UPPER(facility) LIKE UPPER ('%${safeSql(nameLike)}%')`);
//     if (county) parts.push(`UPPER(fcounty) LIKE UPPER ('%${safeSql(county)}%')`);
//     if (services?.length){
//         const checks = services.map(f => `UPPER(${f})= 'Y'`);
//         parts.push(`${checks.join(matchMode == 'all' ? 'AND' : 'OR')})`);
//     }
//     return parts.join('AND');
// }

// async function getClinics({nameLike, county, services = [], matchMode = 'any', limit = 200, offset = 0}){
    
//     const where = buildWhere({nameLike, county, services, matchMode});

//     const params = new URLSearchParams({
//         f: 'json', 
//         where, 
//         outFields: OUT_FIELDS,
//         outSR: '4326',
//         returnGeometry: 'true',
//         resultRecordCount: String(limit),
//         resultOffset: String(offset), 
//         orderByFields: 'facility ASC',
//     });

//     const res = await fetch(`${BASE}/query?${params.toString()}`);
//     if (!res.ok) throw new Error(`ArcGIS HTTP ${res.status}`);
//     const data = await res.json();
//     if (data.error) throw new Error(data.error.message);

//     const items = (data.features || []).map(({attributes: a, geometry: g}) => ({
//         facility: a.facility ?? null, 
//         siteAddress: {
//             line1: a.faddr ?? null, 
//             line2: a.faddr ?? null, 
//             city: a.fcity ?? null, 
//             state: a.fstate ?? null, 
//             zip: a.fzip ?? null,
//         },
//         mailingAddress: {
//             line1: a.address ?? null,
//             city: a.scity ?? null, 
//             state: a.sstate ?? null, 
//             zip: a.szip ?? null,
//         },
//         phone: a.fexten ? `${a.fphone} x${a.fexten}` : (a.fphone ?? null), 
//         typeOfCare: Object.entries(SERVICE_TAGS).filter(([field])=> {
//             const v = a[field];
//             return v === 'Y' || v === 'Yes' || v === 1 || v === true || (typeof v === 'string' && v.trim() !== '')        
//         }).map(([, label]) => label),
//             services: Object.fromEntries(Object.keys(SERVICE_TAGS).map(k => [k, a[k] ?? null])),
//             location: g ? {longitude: g.x, latitude: g.y} : null,
//     }));

//     return {count: items.length, exceededTransferLimit: Boolean(data.exceededTransferLimit), items};
// }

// module.exports= {getClinics};


