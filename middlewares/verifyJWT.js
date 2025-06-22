
//Ito ay para lamang sa pag verify ng token at hindi maccess ng iba yung mga deatils sa database natin
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: "Unathorized you need a token" });

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // Invalid token

        console.log(decoded)
        req.user = {
            id: decoded.UserInfo.id,
            name: decoded.UserInfo.name,
            roles: decoded.UserInfo.roles
        };

        next();
    });
};

module.exports = verifyJWT;