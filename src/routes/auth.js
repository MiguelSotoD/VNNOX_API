const express = require('express');
const axios = require('axios');
const router = express.Router();

let logid = null;

// POST /api/auth/token
router.post('/token', async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.VNNOX_BASE_URL}/v1/oauth/token`,
      {
        username: process.env.VNNOX_USERNAME,
        password: process.env.VNNOX_PASSWORD,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          username: process.env.VNNOX_USERNAME,
        },
      }
    );

    logid = response.data.logid;

    res.json({
      logid,
      status: response.data.status,
      errmsg: response.data.errmsg,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: error.message };
    res.status(status).json(data);
  }
});

// GET /api/auth/logid — returns the stored logid
router.get('/logid', (req, res) => {
  if (!logid) {
    return res.status(404).json({ message: 'No logid stored. Call POST /api/auth/token first.' });
  }
  res.json({ logid });
});

module.exports = router;
