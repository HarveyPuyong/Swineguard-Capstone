const UserDB = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const logoutController = async(req, res) => {
  // get refresh token from cookies
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.status(401).json({message: "Refresh Token not found"})

  const refreshToken = cookies.jwt;

  try{
    // find user base sa refreshToken
    const foundUser = await UserDB.findOne({refreshToken: {$in: [refreshToken]} }).exec();

    // kapag walang na find na user, aclear pa din yung jwt sa cookies
    if(!foundUser) {
      res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: process.env.NODE_ENV === 'production'});
      return res.status(403).json({message: "User not found or already logged out"});
    }

    // tagtagin yung refreshToken sa foundUser
    foundUser.refreshToken.pull(refreshToken);
    await foundUser.save();

    // a clear yung token sa cookies
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: process.env.NODE_ENV === 'production'});
    return res.status(200).json({message: 'Successfully Logout'});
  }catch(err) {
    console.log(`Error: ${err.message}`);
    return res.status(500).json({message: 'Server Error: Try again later'});
  }
}

module.exports = logoutController;