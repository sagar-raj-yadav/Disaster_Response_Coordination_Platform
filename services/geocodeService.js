const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');

exports.geocodeLocation = async (description) => {
  const cacheKey = `geocode:${description}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;
  const geminiPrompt = `Extract location from: ${description}`;
  const geminiResp = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    contents: [{ parts: [{ text: geminiPrompt }] }]
  }, { params: { key: process.env.GOOGLE_GEMINI_API_KEY } });

  const locationName = geminiResp.data.candidates[0].content.parts[0].text;
  const mapsResp = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
    params: { address: locationName, key: process.env.GOOGLE_MAPS_API_KEY }
  });
  const latlng = mapsResp.data.results[0].geometry.location;
  const result = { locationName, latlng };
  await setCache(cacheKey, result);
  return result;
};
