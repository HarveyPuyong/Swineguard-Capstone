const bcrypt = require('bcrypt');
const UserDB = require('../../models/userModel');
const ROLE_LIST = require('../../config/role_list');
const {generateAccessToken, generateRefreshToken} = require('../../utils/generateTokens');

const adminLoginController = async(req, res) => {
  const {email, password} = req.body;
  if(!email || !password) return res.status(400).json({message: 'Email and password are required'});

  try{
    // find user
     const foundUser = await UserDB.findOne({email}).exec();
     if(!foundUser) return res.status(401).json({message: 'Admin not found'});

    //  na match yung password
     const matchPassword = await bcrypt.compare(password, foundUser.password);
     if(!matchPassword) return res.status(401).json({message: 'Incorrect email or password'});

    //  na set yung mga allowed roles para mga admins lang ang maka access ng page
     const allowedRoles = [ROLE_LIST.Admin,
                           ROLE_LIST.AppointmentCoordinator,
                           ROLE_LIST.InventoryCoordinator,
                           ROLE_LIST.Technician,
                           ROLE_LIST.Veterinarian];

    // condition para hindi makapasok yung mga hindi admin
     const hasAccess = allowedRoles.some(role => foundUser.roles.includes(role));
     if(!hasAccess) return res.status(403).json({message: "Access denied: Admins Only"});

     const userName = `${foundUser.firstName} ${foundUser.lastName}`;

    //  generate accesstoken
     const accessToken = generateAccessToken(process.env.ACCESS_TOKEN_SECRET,
                                             process.env.ACCESS_TOKEN_EXPIRY,
                                             foundUser._id,
                                             userName,
                                             foundUser.roles
                                             
     );

    //  generate refreshToken
     const refreshToken = generateRefreshToken(process.env.REFRESH_TOKEN_SECRET,
                                               process.env.REFRESH_TOKEN_EXPIRY,
                                               foundUser._id,
                                               userName
     );

     foundUser.refreshToken.push(refreshToken);

     await foundUser.save();
    
     res.cookie('jwt', refreshToken,
       {httpOnly: true,
        secure: process.env.NODE_ENV === 'production', //abaguhin yung NODE_ENV = production sa .env kapag naka host na
        sameSite: 'Lax', //change sa 'None' kapag naka host na
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
     );

     return res.status(200).json({message: 'Successfully login',
                                  accessToken,
                                  roles: foundUser.roles});
  }catch(err) {
    console.log( `Error: ${err.message}`);
    return res.status(500).json({message: "An unexpected error occurred. Please try again later"})
  }
}


module.exports = adminLoginController;