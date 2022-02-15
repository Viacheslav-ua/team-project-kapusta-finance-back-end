import ApiError from "../exceptions/api.error";

export default function(err, req, res, next) {
  console.log(err);
  res.status(err.status).json({message: err.message, errors: err.errors})
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors})
  }
  return res.status(500).json({
    message: 'Не предвиденная ошибка сервера',
    errorMessage: err.message,
  })
}