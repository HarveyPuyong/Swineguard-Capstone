
//Ito ay para lamang sa pag verify ng token at hindi maccess ng iba yung mga details sa database natin
const jwt = require('jsonwebtoken');

// verifyAccessToken
const verifyJWT = (req, res, next) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
  
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message : "Unauthorized: Invalid or missing authorization header" });

  // get the access token from header bearer
  const accessToken = authHeader.split(' ')[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if(err) return res.status(403).json({ message: "Invalid access token" });
      console.log(decoded)
        req.user = {
            id: decoded.UserInfo.id,
            name: decoded.UserInfo.name,
            roles: decoded.UserInfo.roles
        };

      next();
    }
   );
}

module.exports = verifyJWT;