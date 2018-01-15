module.exports = (req, res, next) => {
  if (!req.session.auth) {
    res.statusMessage = 'Your session has expired! Please log in'
    return res.status(401).end()
  }
  next()
}