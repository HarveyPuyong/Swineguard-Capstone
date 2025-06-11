const jwt = require('jsonwebtoken');

// generate tokens functions, para reuseable 

// generate accessToken
const generateAccessToken = (accessToken, tokenExpiry, userId, userName, roles) => {
  return jwt.sign(
          {
            UserInfo: {"id": userId, "name": userName,"roles": roles}
          },
          accessToken,
          {expiresIn: tokenExpiry}
        );
} 

// generate refreshToken
const generateRefreshToken = (refreshToken, tokenExpiry, userId, userName) => {
  return jwt.sign(
    {"id": userId, "username":userName},
    refreshToken, 
    {expiresIn: tokenExpiry}
  );
}


module.exports = {generateAccessToken, generateRefreshToken}