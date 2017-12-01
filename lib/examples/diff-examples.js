module.exports = [{
  name: 'Text',
  left: `Oh there once was a swagman camped in the billabong
Under the shade of a Coolibah tree
And he sang as he looked at the old billy boiling
Who'll come a waltzing Matilda with me?

Waltzing Matilda, waltzing Matilda
You'll come a-waltzing Matilda, with me
And he sang as he watched and waited till his billy boiled:
"You'll come a-waltzing Matilda, with me."`,
  right: `Oh there once was a swagman camped in the billabong
Under the shade of the coolibah tree
And he sang as he looked at his old billy boiling
Who'll come a waltzing Matilda with me?

Waltzing Matilda, waltzing Matilda
Who'll come a-waltzing Matilda, with me?
And he sang as he watched and waited till his billy boiled:
"You'll come a-waltzing Matilda, with me."`
},
{
  name: 'Code',
  left: `'use strict';

// Load env variables from .env
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const twitter = require('./twitter');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/get', (req, res) => {
  console.log('dd');
  if (!req.body.tweetUrl || !req.body.usernames
    || !req.body.tweetUrl.startsWith('https://twitter.com')) {
    return res.sendStatus(400);
  }
  const tweetUrl = req.body.tweetUrl;
  const usernames = req.body.usernames.split(' ');

  twitter.getTweets(tweetUrl, usernames)
    .then(tree => {
      return res.json(tree);
    });
});

app.get('/', (req, res) => {
  res.sendfile('public/index.html');
});

app.listen(8080, () => {
  console.log('Listening on port 8080!');
});
`,
  right: `'use strict';

// Load env variables from .env
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const twitter = require('./twitter');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/get', (req, res) => {
  if (!req.body.tweetUrl || !req.body.tweetUrl.startsWith('https://twitter.com')) {
    return res.sendStatus(400);
  }
  const tweetUrl = req.body.tweetUrl;
  let usernames = [];
  if (req.body.usernames.length) {
    usernames = req.body.usernames.split(' ');
  }

  twitter.getTweets(tweetUrl, usernames)
    .then(tree => {
      return res.json(tree);
    });
});

app.get('/', (req, res) => {
  res.sendfile('public/index.html');
});

app.listen(8080, () => {
  console.log('Listening on port 8080!');
});
`
},
{
  name: 'JSON',
  left: '{"email":"johndoe@gmail.com","email_verified":true,"updated_at":"2017-11-23T05:34:23.248Z","picture":"https://s.gravatar.com/avatar/86ce735f59af85b35fa7416c4b330452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fth.png","user_id":"auth0|571dfc872f1d5e56026702f6","name":"johndoe@gmail.com","nickname":"johndoe","identities":[{"user_id":"571dfc872f1d5e56026702f6","provider":"auth0","connection":"Username-Password-Authentication","isSocial":false},{"provider":"google-oauth2","user_id":"google-oauth2|107929228185700012492","connection":"google-oauth2"},{"provider":"twitter","user_id":"twitter|35197594","connection":"twitter"}],"created_at":"2016-04-25T11:16:23.031Z","last_password_reset":"2017-09-21T02:31:16.253Z","user_metadata":{"foo":"bar","hey":"there"},"multifactor":["google-authenticator"],"blocked":false,"app_metadata":{"roles":["admin","boss"],"authorization":{"groups":[]}},"last_ip":"112.134.177.209","last_login":"2017-11-23T05:34:23.248Z","logins_count":769,"blocked_for":[],"guardian_enrollments":[]}',
  right: '{"email":"johndoe@gmail.com","email_verified":false,"updated_at":"2017-11-23T05:34:23.248Z","picture":"https://s.gravatar.com/avatar/86ce735f59af85b35fa7416c4b330452?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fth.png","user_id":"auth0|571dfc872f1d5e56026702f6","name":"johndoe@gmail.com","nickname":"johndoe","identities":[{"user_id":"571dfc872f1d5e56026702f6","provider":"auth0","connection":"Username-Password-Authentication","isSocial":false},{"provider":"google-oauth2","user_id":"google-oauth2|107929228185700012492","connection":"google-oauth2"},{"provider":"twitter","user_id":"twitter|35197594","connection":"twitter"}],"created_at":"2016-04-25T11:16:23.031Z","user_metadata":{"foo":"barz","hey":"there"},"multifactor":["google-authenticator"],"blocked":false,"app_metadata":{"roles":["admin","boss"],"authorization":{"groups":[]}},"last_ip":"112.134.177.209","last_login":"2017-11-23T05:21:55.352Z","logins_count":764,"blocked_for":[],"guardian_enrollments":[]}'
}
]
