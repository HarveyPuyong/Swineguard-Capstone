const jwt = require('jsonwebtoken');

// Middleware to verify access token
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized: Missing or invalid authorization header" });
  }

  const accessToken = authHeader.split(' ')[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
      console.log(decoded)

      req.user = {
        id: decoded.UserInfo.id,
        name: decoded.UserInfo.name,
        roles: decoded.UserInfo.roles
      };

      next();
    }
  );
};

module.exports = verifyJWT;
