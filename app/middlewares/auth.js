const { getUserPasswordAuth, comparePassword } = require('../utils/auth.util')

module.exports = (User) => {
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
        username,
      },
    })
    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized: Invalid username or password',
      })
    }
    const isPasswordMatch = await comparePassword(password, user.password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Unauthorized: Invalid username or password',
      })
    }

    if (!user.verified) {
      return res.status(401).json({
        message: 'Unauthorized: User is not verified',
      })
    }
    req.user = user
    global.username = user.username
    next()
  }

  return authorizeToken
}
