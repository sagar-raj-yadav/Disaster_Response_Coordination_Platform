const express = require('express');
const router = express.Router();

module.exports = (io) => {
  router.get('/:id/social-media', (req, res) => {
    const data = [
      { post: '#floodrelief Need food in NYC', user: 'citizen1' },
      { post: 'SOS stuck on roof', user: 'citizen2' }
    ];
    io.emit('social_media_updated', data);
    res.json(data);
  });
  return router;
};
