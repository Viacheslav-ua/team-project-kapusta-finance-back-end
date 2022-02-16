import queryString from 'query-string'
import axios from 'axios'
// import Url from 'url'



import userService from "../service/user.service"

class UserController {

  async registration(req, res) {
      const {email, password} = req.body
      const userData = await userService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 2592000000, httpOnly: true})
      return res.status(201).json(userData)
  }

  async login(req, res) {
      const {email, password} = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 2592000000, httpOnly: true})
      return res.status(200).json(userData)
  }

  async logout(req, res) {
      const { refreshToken } = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.status(200).json(token)
  }

  async refresh(req, res) {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 2592000000, httpOnly: true})
      return res.status(200).json(userData)
  }

  async resetBalance(req, res) {
    const { balance } = req.body
    const userId = req.user.id
    const user = await userService.setBalance(userId, balance)
    const response = {
      userId: user._id,
      email: user.email,
      balance: user.balance,
    }
    res.status(200).json(response)
  }

  async googleAuth(req, res) {
        const strParams = queryString.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
      scope: [
         "https://www.googleapis.com/auth/userinfo.email",
         "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),

      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
     })
     return res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${strParams}`
    )
  }

  async googleRedirect(req, res) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const urlObj = new URL(fullUrl)
    const urlParams = queryString.parse(urlObj.search)
    const code = urlParams.code
            
    const tokenData = await axios({
      url: 'https://oauth2.googleapis.com/token',
      method: 'post',
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
        grant_type: 'authorization_code',
        code,
      },
    })
      
    const userData = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
         Authorization: `Bearer ${tokenData.data.access_token}`
      }
    })

    const tokens = await userService.googleLoginTokens(userData.data.email)
    res.cookie('refreshToken', tokens.refreshToken, {maxAge: 2592000000, httpOnly: true})

    return res.redirect(
      `${process.env.CLIENT_URL}/google-redirect`
    )
      
  }
}

export default new UserController 