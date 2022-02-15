import bcrypt from 'bcrypt'
import UserModel from '../models/user.model'
import ApiError from '../exceptions/api.error'
import tokenService from './token.service'

class UserService {

  async registration(email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw ApiError.Conflict(`Пользователь с адрессом ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await UserModel.create({email, password: hashPassword})
    const payload = {id: user._id, email: user.email}
    const tokens = tokenService.generateTokens(payload)
    await tokenService.saveToken(user._id, tokens.refreshToken)
    return {...tokens, user: payload}
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.BadRequest('Ошибка авторизации')
    }
    const isEquals = await bcrypt.compare(password, user.password)
    if(!isEquals) {
      throw ApiError.BadRequest('Ошибка авторизации')
    }
    const payload = {id: user._id, email: user.email}
    const tokens = tokenService.generateTokens(payload)
    await tokenService.saveToken(user._id, tokens.refreshToken)
    return {...tokens, user: payload}
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.verifyRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }
    const user = await UserModel.findById(userData.id)
    const payload = {id: user._id, email: user.email}
    const tokens = tokenService.generateTokens(payload)
    await tokenService.saveToken(user._id, tokens.refreshToken)
    return {...tokens, user: payload}
  }

  async googleLoginTokens(email) {
    if(!email) {
      throw ApiError.UnauthorizedError()
    }
     const candidate = await UserModel.findOne({ email })
    if (!candidate) {
      const user = await UserModel.create({email})
      await user.save()
      const payload = {id: user._id, email: user.email}
      const tokens = tokenService.generateTokens(payload)
      await tokenService.saveToken(user._id, tokens.refreshToken)
      return tokens
    }
    const payload = {id: candidate._id, email: candidate.email}
    const tokens = tokenService.generateTokens(payload)
    return tokens
  }

  async setBalance(userId, balance) {
    const user = await UserModel.findOneAndUpdate({ _id: userId }, {balance}, { new: true })
    return user
  }

  async saveNewToken(user) {
    const payload = {id: user._id, email: user.email}
    const tokens = tokenService.generateTokens(payload)
    await tokenService.saveToken(user._id, tokens.refreshToken)
    return {...tokens, user: payload}
  }

}

export default new UserService