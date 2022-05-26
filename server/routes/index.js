import express from 'express';
import fetch from 'node-fetch';
import jsonwebtoken from 'jsonwebtoken';

import db from './queries.js';

const router = express.Router();

const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;
const SIGNATURE = process.env.JWT_SIGNATURE;

router.get('/', (req, res) => {
  res.send('hello world');
});

// redirects to discord oauth2
router.get('/login', (req, res) => {
  const redirect = encodeURIComponent('http://localhost:8000/login/callback');
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}&state=${req.query.origin}`);
});

// discord oauth callback, redirects back to client site
router.get('/login/callback', async (req, res) => {
  if (!req.query.code) {
    res.status(400).send('No auth code provided');
    return;
  }
  const { code } = req.query;
  const response = await fetch(
    'https://discordapp.com/api/oauth2/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:8000/login/callback',
      }),
    },
  );

  // contains access token and refresh token
  const discordToken = await response.json();

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${discordToken.token_type} ${discordToken.access_token}`,
    },
  });
  const discordUser = await userResponse.json();

  if (!discordUser.id) {
    res.status(500).send();
    return;
  }
  const userData = await db.getOrCreateUser(discordUser.id);

  const payload = {
    userId: userData.user_id, // database id not discord id
    accessToken: discordToken.access_token, // do we really want to send this
    refreshToken: discordToken.refresh_token,
  };

  const token = jsonwebtoken.sign(payload, SIGNATURE, { expiresIn: discordToken.expires_in });

  res.cookie('auth', token);
  res.cookie('user', discordUser.username);

  res.redirect(`http://localhost:3000${req.query.state}`);
});

// todo: refresh token
router.get('/refresh', async (req, res) => {
  const cookie = jsonwebtoken.verify(req.cookies.auth, SIGNATURE);

  const response = await fetch('https://discord.com/api/oauth2/token', {
    headers: {
      method: 'POST',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: cookie.refreshToken,
    }),
  });
});

// revokes tokens
router.get('/logout', async (req, res) => {
  if (req.cookies.auth) {
    console.log(SIGNATURE)
    const cookie = jsonwebtoken.verify(req.cookies.auth, SIGNATURE);
    await fetch('https://discord.com/api/oauth2/revoke', {
      headers: {
        method: 'POST',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        token: cookie.accessToken,
      }),
    });
  }

  res.cookie('auth', null);
  res.cookie('user', null);
  res.redirect(req.originalUrl);
});

export default router;
