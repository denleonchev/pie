const express = require('express');
const multer = require('multer')
const path = require('path');
const uuidv1 = require('uuid/v1');
const cookieSession = require('cookie-session')
const fs = require('file-system')

const keys = require('./config/keys')

const app = express();

const storage = multer.diskStorage({
  storage: multer.memoryStorage(),
  filename: function (req, file, cb) {
    cb(null, uuidv1() + file.originalname)
  }
})
const upload = multer({storage: storage}).fields([{ name: 'reviews', maxCount: 1 }, { name: 'purchases', maxCount: 1 }])

if (process.env.NODE_ENV === 'production') {
  fs.writeFileSync(keys.storageConfigPath, JSON.stringify(keys.storageConfig), function(err) {
    console.log(err)
  })
}

require('./routes/uploadRoute')(app, upload)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/dist'))
  const path = require('path')
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', '200.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT)