const uuidv1 = require('uuid/v1')
const fs = require('file-system')
const Papa = require('papaparse')
const os = require('os')
const googleStorage = require('@google-cloud/storage')

const getColumn = require('../utils/getColumn')
const keys = require('../config/keys')
const requireAuth = require('../middlewares/requireAuth')

module.exports = (app, upload) => {
  app.post('/api/upload', upload, requireAuth, (req, res) => {
    const firebaseStorage = googleStorage({
      projectId: keys.firebaseProjectId,
      keyFilename: keys.storageConfigPath
    });

    const bucket = firebaseStorage.bucket(keys.storageBucket);

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

    if (!req.files) {
      res.statusMessage = 'No files were attached!'
      res
        .status(500)
        .end()
      return
    }

    if (!req.files.reviews || !req.files.purchases) {
      res.statusMessage = 'You forgot to attach the second file'
      res
        .status(500)
        .end()
      return
    }

    if (req.files.reviews[0].originalname.split('.')[1] !== 'csv' || req.files.purchases[0].originalname.split('.')[1] !== 'csv') {
      res.statusMessage = 'The both files should be correctly formed and in CSV format!'
      res
        .status(500)
        .end()
      return
    }

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
          if (reviewsProductCol === -1 || reviewsEmailCol === -1 || purchasesProductCol === -1 || purchasesEmailCol === -1) {
            res.statusMessage = 'You forgot to name the columns "Product ID" and "Email" properly'
            res
              .status(500)
              .end()
            return
          }
  
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
                  console.error(err)
                  return
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
}