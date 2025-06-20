const express = require('express');
const router = express.Router();
const { geocodeLocation } = require('../services/geocodeService');

router.post('/', async (req, res) => {
  const { description } = req.body;
  const result = await geocodeLocation(description);
  res.json(result);
});
module.exports = router;