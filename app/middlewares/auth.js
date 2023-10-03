const { getUserPasswordAuth, comparePassword } = require('../utils/auth.util')

const db = require('../models/index')

const User = db.users

module.exports = () => {
  const authorizeToken = async (req, res, next) => {

    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        message: 'Missing authorization header',
      })
    }

    const { username, password } = getUserPasswordAuth(authHeader)
   
    const user = await User.findOne({
      where: {
        email:username,
      },
    })

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized: User does not exists',
      })
    }
    const isPasswordMatch = await comparePassword(password, user.password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Unauthorized: Incorrect password',
      })
    }
    req.user = user

    global.username = user.email
    next()
  }

  return authorizeToken
}
