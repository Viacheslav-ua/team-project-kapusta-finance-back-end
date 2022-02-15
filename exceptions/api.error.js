export default class ApiError extends Error {
  status
  errors

  constructor(status, massage, errors = []) {
    super(massage)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользоатель не авторизован')
  }
  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors)
  }
  static Conflict(message = 'Конфликт', errors = []) {
    return new ApiError(409, message, errors)
  }
  static NotImplemented(message = 'Hе реализовано', errors = []) {
    return new ApiError(501, message, errors)
  }
}