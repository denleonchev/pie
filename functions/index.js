const functions = require('firebase-functions');
const app = require('./app')

exports.server = functions.https.onRequest(app);
