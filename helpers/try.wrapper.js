export default (cb) => (req, res, next) => {
  return cb(req, res, next).catch((e) => next(e))
}