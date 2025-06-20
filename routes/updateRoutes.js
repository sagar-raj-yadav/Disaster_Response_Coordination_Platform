const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');
const router = express.Router();

router.get('/:id/official-updates', async (req, res) => {
  const key = `updates:${req.params.id}`;
  const cached = await getCache(key);
  if (cached) return res.json(cached);
  const html = await axios.get('https://www.redcross.org');
  const $ = cheerio.load(html.data);
  const updates = [];
  $('a').each((i, el) => {
    const text = $(el).text();
    const href = $(el).attr('href');
    if (text.toLowerCase().includes('relief')) updates.push({ text, href });
  });
  await setCache(key, updates);
  res.json(updates);
});
module.exports = router;
