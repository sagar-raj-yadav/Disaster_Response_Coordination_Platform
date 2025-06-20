const express = require('express');
const { getDisasters, createDisaster, updateDisaster, deleteDisaster } = require('../controllers/disasterController');
module.exports = (io) => {
  const router = express.Router();
  router.get('/', getDisasters);
  router.post('/', (req, res) => createDisaster(req, res, io));
  router.put('/:id', (req, res) => updateDisaster(req, res, io));
  router.delete('/:id', (req, res) => deleteDisaster(req, res, io));
  return router;
};