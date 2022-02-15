import jwt from 'jsonwebtoken'
import TokenModel from '../models/token.model'

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '2h'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
    return {
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({userId})
    if(tokenData) {
      tokenData.refreshToken = refreshToken
      return await tokenData.save()
    }
    const token = await TokenModel.create({userId, refreshToken})
    return token
  }

  async removeToken(refreshToken) {
    const tokenData = await TokenModel.deleteOne({refreshToken})
    return tokenData
  }

  async findToken(refreshToken) {
    const tokenData = await TokenModel.findOne({refreshToken})
    return tokenData
  }

  verifyAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  verifyRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }
}

export default new TokenService