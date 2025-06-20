const express = require('express');
const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');
const router = express.Router();

router.post('/:id/verify-image', async (req, res) => {
  const { image_url } = req.body;
  const key = `verify:${image_url}`;
  const cached = await getCache(key);
  if (cached) return res.json(cached);
  const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', {
    contents: [{ parts: [{ text: `Analyze image at ${image_url} for manipulation or disaster context.` }] }]
  }, { params: { key: process.env.GOOGLE_GEMINI_API_KEY } });
  const analysis = response.data.candidates[0].content.parts[0].text;
  await setCache(key, { analysis });
  res.json({ analysis });
});
module.exports = router;