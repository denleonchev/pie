const keys = require('../config/keys')

module.exports = (app) => {
  app.post('/api/login', (req, res) => {
    if(req.body.pass === keys.pass) {
      req.session.auth = true
      res.send({ authed: true })
    } else {
      res.statusMessage = 'Wrong password'
      res.status(401)
      res.send({ authed: false })
      
    }
  })

  app.post('/api/logout', (req, res) => {
    req.session.auth = false
    res.send({ authed: false })
  })

  app.get('/api/auth', (req, res) => {
    if(req.session.auth) {
      res.send({ authed: true })
    } else {
      res.send({ authed: false })
    }
  })
}