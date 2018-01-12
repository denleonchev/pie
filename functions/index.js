const functions = require('firebase-functions')
const googleStorage = require('@google-cloud/storage')

const config = require('./config')

const firebaseStorage = googleStorage({
  projectId: config.firebaseProjectId,
  keyFilename: config.storageConfigPath
});
const bucket = firebaseStorage.bucket(config.storageBucket)

exports.cleanup = functions.https.onRequest((request, response) => {
  bucket.deleteFiles()
  response.send('done')
});