const axios = require('axios');
const state = require('../store');

async function refreshToken() {
  const response = await axios.get(
    `${process.env.VNNOX_GATEWAY_URL}/oauth/token`,
    {
      params: {
        grant_type: 'client_credentials',
        client_id: process.env.VNNOX_CLIENT_ID,
        client_secret: process.env.VNNOX_CLIENT_SECRET,
      },
    }
  );

  state.accessToken = response.data.access_token;
  // Store expiry 60 seconds early to avoid edge cases
  state.tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;

  console.log('Token refreshed, expires in', response.data.expires_in, 'seconds');
  return state.accessToken;
}

async function getValidToken() {
  if (!state.accessToken || Date.now() >= state.tokenExpiresAt) {
    await refreshToken();
  }
  return state.accessToken;
}

module.exports = { refreshToken, getValidToken };
