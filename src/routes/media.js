const express = require('express');
const axios = require('axios');
const { getValidToken } = require('../services/auth');
const router = express.Router();

// GET /api/media
router.get('/', async (req, res) => {
  try {
    const token = await getValidToken();
    const { limit = 100, offset = 0, search, isComplex } = req.query;

    const params = {
      access_token: token,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };

    if (search !== undefined) params.search = search;
    if (isComplex !== undefined) params.isComplex = parseInt(isComplex);

    const response = await axios.get(
      `${process.env.VNNOX_GATEWAY_URL}/vnnox/Rest/Lite/Medias`,
      { params }
    );

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: error.message };
    res.status(status).json(data);
  }
});

module.exports = router;
