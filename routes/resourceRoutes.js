const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

module.exports = (io) => {
  router.get('/:id/resources', async (req, res) => {
    const { lat, lon } = req.query;
    const { data, error } = await supabase.rpc('get_nearby_resources', {
      lat_input: parseFloat(lat),
      lon_input: parseFloat(lon),
      radius_km: 10
    });
    if (error) return res.status(500).json({ error });
    io.emit('resources_updated', data);
    res.json(data);
  });
  return router;
};