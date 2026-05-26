const express = require('express');
const axios = require('axios');
const state = require('../store');
const router = express.Router();

// GET /api/media
router.get('/', async (req, res) => {
  if (!state.accessToken) {
    return res.status(401).json({ message: 'No access token. Call POST /api/auth/token first.' });
  }

  const { limit = 100, offset = 0, search, isComplex } = req.query;

  const params = {
    access_token: state.accessToken,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };

  if (search !== undefined) params.search = search;
  if (isComplex !== undefined) params.isComplex = parseInt(isComplex);

  try {
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
