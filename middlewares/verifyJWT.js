
//Ito ay para lamang sa pag verify ng token at hindi maccess ng iba yung mga details sa database natin
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: "Unathorized you need a token" });

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // Invalid token

        req.user = {
            id: decoded.id,
            roles: decoded.roles,
            name: decoded.userName
        };

        next();
    });
};

module.exports = verifyJWT;