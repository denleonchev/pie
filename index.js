const express = require('express');
const multer = require('multer')
const path = require('path');
const uuidv1 = require('uuid/v1');
const cookieSession = require('cookie-session')
const fs = require('file-system')
const Papa = require('papaparse')
const getColumn = require('./utils/getColumn')
const del = require('del')
const Buffer = require('buffer').Buffer
const googleStorage = require('@google-cloud/storage');
const format = require('util').format
const os = require('os')

const keys = require('./config/keys')

const app = express();

const filesFolder = './tmp'
const storage = multer.diskStorage({
  storage: multer.memoryStorage(),
  filename: function (req, file, cb) {
    cb(null, uuidv1() + file.originalname)
  }
}) 

if (process.env.NODE_ENV === 'production') {
  fs.writeFileSync(keys.storageConfigPath, JSON.stringify(keys.storageConfig), function(err) {
    console.log(err)
  })
}

const firebaseStorage = googleStorage({
  projectId: keys.firebaseProjectId,
  keyFilename: keys.storageConfigPath
});

const bucket = firebaseStorage.bucket(keys.storageBucket);

const upload = multer({storage: storage}).fields([{ name: 'reviews', maxCount: 1 }, { name: 'purchases', maxCount: 1 }])

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/dist'))

  const path = require('path')
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', '200.html'))
  })
}


app.post('/api/upload', upload, (req, res) => {

  const readFileWithPromise = (filePath) => (
    new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        }
        Papa.parse(data, {
          complete: function (parsed) {
            resolve(parsed)
          },
          error: function (err) {
            reject(err)
          }
        })
      })
    })
  )
  const reviewsPath = req.files.reviews[0].path
  const purchasesPath = req.files.purchases[0].path

  Promise.all([readFileWithPromise(reviewsPath), readFileWithPromise(purchasesPath)])
    .then(
      (results) => {
        const reviews = results[0]
        const purchases = results[1]
        const productReg = /.*product.?id/
        const emailReg = /.*email.*/
        const reviewsHeader = reviews.data[0]
        const purchasesHeader = purchases.data[0]
        const reviewsProductCol = getColumn(reviewsHeader, productReg)
        const reviewsEmailCol = getColumn(reviewsHeader, emailReg)
        const purchasesProductCol = getColumn(purchasesHeader, productReg)
        const purchasesEmailCol = getColumn(purchasesHeader, emailReg)

        reviewsHeader.splice(reviewsProductCol, 0, 'Calculated Product ID')
        
        const result = []
        reviews.data.forEach((reviewArr, reviewIndex) => {
          if (!reviewIndex) {
            return
          }
          const reviewEmail = reviewArr[reviewsEmailCol]
          const foundPurchases = purchases.data.filter((purchaseRow, purchaseIndex) => {
            return purchaseRow[purchasesEmailCol] === reviewEmail
          })
          if(!foundPurchases.length) {
            reviewArr.splice(reviewsProductCol, 0, reviewArr[reviewsProductCol])
          } else {
            reviewArr.splice(reviewsProductCol, 0, foundPurchases.map((item) => (item[[purchasesProductCol]])).join(', '))
          }
          result.push(reviewArr)
          
        })

        const csv = Papa.unparse({
          fields: reviewsHeader,
          data: result
        })
        const fileName = `reviews_report_${uuidv1()}.csv`

        fs.writeFile(os.tmpdir() + '/' + fileName , csv, function(err) {})

        bucket.upload(os.tmpdir() + '/' + fileName, {
          destination: `reviews_report_${uuidv1()}.csv`,
          metadata: {
            contentType: 'text/csv'
          }
        })
          .then(
          (data) => {
            let file = data[0]
            file.getSignedUrl({
              action: 'read',
              expires: '03-17-2025'
            }, 
            (err, url) => {
              if (err) {
                console.error(err);
                return;
              }
              res.send({ path: url })
            })
          })

      },
      (err) => {
        if(err) {
          console.log(err)
        }
      }
    )
})

const PORT = process.env.PORT || 5000
app.listen(PORT)