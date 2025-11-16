const express = require('express');
const router = express.Router();
const { oauth } = require('../server');
const config = require('../config.json');

// صفحة تسجيل الدخول
router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login', {
    clientId: config.clientId,
    redirectUri: config.redirectUri
  });
});

// كولباك OAuth2
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect('/');

  try {
    const token = await oauth.tokenRequest({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      code,
      scope: 'identify guilds',
      grantType: 'authorization_code',
      redirectUri: config.redirectUri
    });

    const user = await oauth.getUser(token.access_token);
    const guilds = await oauth.getUserGuilds(token.access_token);

    req.session.user = user;
    req.session.guilds = guilds;

    res.redirect('/dashboard');
  } catch (e) {
    console.error(e);
    res.redirect('/');
  }
});

// لوحة التحكم
router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.render('dashboard', { user: req.session.user, guilds: req.session.guilds });
});


// تسجيل الخروج
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
