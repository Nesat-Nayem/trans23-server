const fetch = require('node-fetch');

async function getCoordinatesFromPincode(pincode) {
  const opencageApiKey = process.env.OPENCHAGE;
  const opencageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&countrycode=in&limit=1&key=${opencageApiKey}`;

  try {
    const opencageResponse = await fetch(opencageUrl);
    const opencageData = await opencageResponse.json();

    if (opencageData.status.code !== 200) {
      console.error('OpenCageData error:', opencageData.status.message);
      throw new Error('Error fetching pincode data');
    }

    const mainData = opencageData.results[0].geometry;
    const { lat, lng } = mainData;

    return { lat, lng };
  } catch (error) {
    throw new Error('Error fetching pincode data');
  }
}

module.exports = { getCoordinatesFromPincode };
