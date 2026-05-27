const express = require('express');
const { refreshToken } = require('../services/auth');
const state = require('../store');
const router = express.Router();

// GET /api/auth/token
router.get('/token', async (req, res) => {
  try {
    await refreshToken();
    res.json({
      message: 'Token obtained successfully',
      expiresAt: new Date(state.tokenExpiresAt).toISOString(),
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: error.message };
    res.status(status).json(data);
  }
});

// GET /api/auth/status
router.get('/status', (req, res) => {
  res.json({
    hasToken: !!state.accessToken,
    tokenPreview: state.accessToken ? state.accessToken.substring(0, 20) + '...' : null,
    expiresAt: state.tokenExpiresAt ? new Date(state.tokenExpiresAt).toISOString() : null,
    isExpired: state.tokenExpiresAt ? Date.now() >= state.tokenExpiresAt : true,
  });
});

module.exports = router;
