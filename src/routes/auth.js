const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const state = require('../store');
const router = express.Router();

// POST /api/auth/token
router.post('/token', async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.VNNOX_BASE_URL}/v1/oauth/token`,
      qs.stringify({
        username: process.env.VNNOX_USERNAME,
        password: process.env.VNNOX_PASSWORD,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          username: process.env.VNNOX_USERNAME,
        },
      }
    );

    state.logid = response.data.logid;
    state.accessToken = response.data.data?.token || null;
    state.tokenExpire = response.data.data?.expire || null;

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: error.message };
    res.status(status).json(data);
  }
});

// GET /api/auth/logid
router.get('/logid', (req, res) => {
  if (!state.logid) {
    return res.status(404).json({ message: 'No logid stored. Call POST /api/auth/token first.' });
  }
  res.json({
    logid: state.logid,
    accessToken: state.accessToken,
    expire: state.tokenExpire,
  });
});

module.exports = router;
