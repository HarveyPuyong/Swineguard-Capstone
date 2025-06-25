const UserDB = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const {generateAccessToken} = require('./../utils/generateTokens');


const refreshTokenController = async(req, res) => {
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.status(400).json({message: "Refresh token not found"});

  const refreshToken = cookies.jwt;

  try{
    const foundUser = await UserDB.findOne({refreshToken: {$in: [refreshToken]} });
    if(!foundUser) return res.status(400).json({message: "User not found"});

    const userName = `${foundUser.firstName} ${foundUser.lastName}`;

    jwt.verify(refreshToken,
               process.env.REFRESH_TOKEN_SECRET,
              (err, decoded) => {
                if(err) return res.status(403).json({message: "Invalid Token"});

                const decodedId = decoded.id;
                const foundUserId = String(foundUser._id);

                if(decodedId !== foundUserId) return res.status(403).json({message: "User id does not match in token id"});
                
                const accessToken = generateAccessToken(process.env.ACCESS_TOKEN_SECRET,
                                                        process.env.ACCESS_TOKEN_EXPIRY,
                                                        foundUser._id,
                                                        userName,
                                                        foundUser.roles

                );

                return res.status(200).json({message: "Access token refreshed successfully", accessToken});
              } 
    );

  }catch(err){
    console.log(`Error to send accessToken: ${err.message}`);
    return res.status(500).json({message: "Failed to send a new access token"});
  }
};


module.exports = refreshTokenController;