const express = require('express');
const session = require('express-session');
const path = require('path');
const { Client } = require('discord.js');
const DiscordOAuth2 = require('discord-oauth2'); // ✔ الصح
const config = require('./config.json');

const app = express();

// Discord OAuth2 Client
const oauth = new DiscordOAuth2({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  redirectUri: config.redirectUri
});
module.exports.oauth = oauth;

// Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Session
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.use('/', require('./routes/index'));

// Start server
app.listen(3000, () =>
  console.log("🌐 Dashboard is running: http://localhost:3000")
);
