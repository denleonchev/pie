const app = require('express')();
const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, './upload'))
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage}).fields([{ name: 'single', maxCount: 1 }, { name: '2', maxCount: 1 }])

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/200.html'));
})

app.post('/', upload, (req, res) => {
  console.log(req.files)
  res.sendFile(path.resolve(__dirname, '../dist/200.html'));

})

module.exports = app