const functions = require('firebase-functions');
const googleStorage = require('@google-cloud/storage');

const firebaseStorage = googleStorage({
  projectId: "pies-6b41e",
  keyFilename: "./storageConfig.json"
});
const bucket = firebaseStorage.bucket('pies-6b41e.appspot.com');

exports.cleanup = functions.https.onRequest((request, response) => {
  bucket.deleteFiles()
  response.send('done')
});