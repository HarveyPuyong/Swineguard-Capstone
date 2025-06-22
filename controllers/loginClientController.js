const bcrypt = require('bcrypt');
const {generateAccessToken, generateRefreshToken} = require('./../utils/generateTokens.js');
const UserDB = require('./../models/userModel');


const clientLoginController = async(req, res) => {
  const {email, password} = req.body;

  if(!email || !password) return res.status(400).json({message: "Email and password are required"});


  try{
    const foundUser = await UserDB.findOne({email}).exec();
    if(!foundUser) return res.status(404).json({message: "User not Found"});

    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if(!matchPassword) return res.status(400).json({message: "Incorrect Password"});

    const userName = `${foundUser.firstName}, ${foundUser.lastName}`;

    const accessToken = generateAccessToken(process.env.ACCESS_TOKEN_SECRET,
                                            process.env.ACCESS_TOKEN_EXPIRY,
                                            foundUser._id,
                                            userName,
                                            foundUser.roles
    );

    const refreshToken = generateRefreshToken(process.env.REFRESH_TOKEN_SECRET,
                                              process.env.REFRESH_TOKEN_EXPIRY,
                                              foundUser._id,
                                              userName
    );

    if(foundUser.refreshToken.length >= 3) foundUser.refreshToken.shift();
    foundUser.refreshToken.push(refreshToken);

    await foundUser.save();

    //na store sa cookie yung refreshToken
    res.cookie('jwt', refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', //abaguhin yung NODE_ENV = production sa .env kapag naka host na
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      }
    );
    
    return res.status(200).json({message: `User ${userName} is successfully login`, accessToken});
  }catch(err){
    console.log(err.message);
    return res.status(500).json({message: "An unexpected error occurred. Please try again later"})
  }
}


module.exports = clientLoginController;