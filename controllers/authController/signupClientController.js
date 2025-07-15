const bcrypt =  require('bcrypt');
const ROLE_LIST = require('../../config/role_list');
const UserDB = require('../../models/userModel');
const { isValidInput, containsEmoji, hasNumber, containsSpecialChar }= require('./../../utils/inputChecker');
const {generateAccessToken, generateRefreshToken} = require('../../utils/generateTokens'); //na import yung generate tokens sa utils folder

const signupController = async (req, res) => {
  // nakuha yung json laman ng req.body
  const {firstName, middleName,lastName, suffix, sex, birthday,
         municipality, barangay, contactNum,
         email, password, confirmPassword } = req.body;

  // Check for Emojis
  if (containsEmoji(firstName) || containsEmoji(middleName) || containsEmoji(lastName)) {
    return res.status(400).json({ message: 'Emoji are not allowed for service name.'});
  }

  // Check for Numbers
  if (hasNumber(firstName) || hasNumber(middleName) || hasNumber(lastName)) {
    return res.status(400).json({ message: 'Numbers are not allowed in names'});
  }

  // Check for Special Chracters
  if (containsSpecialChar(firstName) || containsSpecialChar(middleName) || containsSpecialChar(lastName)) {
    return res.status(400).json({ message: 'Special characters are not allowed.'});
  }

  // Check for length
  if (!isValidInput(firstName) || !isValidInput(middleName) || !isValidInput(lastName)) {
    return res.status(400).json({ message: 'Name are too short'});
  }

  if (birthday) {
    const birthdayDate = new Date(birthday);
    const today = new Date();

    const ageInYears = today.getFullYear() - birthdayDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthdayDate.getMonth() ||
      (today.getMonth() === birthdayDate.getMonth() && today.getDate() >= birthdayDate.getDate());

    const isAtLeast18 = ageInYears > 18 || (ageInYears === 18 && hasHadBirthdayThisYear);
    const isFutureDate = birthdayDate > today;

    if (isFutureDate || !isAtLeast18) {
      return res.status(400).json({
        message: 'Birthday cannot be in the future and must be at least 18 years old.',
      });
    }
  }
 
  //na check yung contact number kung 09 ang una at naka 11digits, baka kasi mag lagay ng maling number yung client
  const contactPattern = /^09\d{9}$/;
  if (!contactPattern.test(contactNum)) return res.status(400).json({message : 'Contact number must start with "09" and be 11 digits long'});

  //na check kung yung password at confirmPassword ay tama
  if(password.trim() !== confirmPassword.trim()) return res.status(400).json({message: 'Passowords does not match'});
  

  try{
    const [duplicateFullname, duplicateEmail] = await Promise.all([
      UserDB.findOne({ firstName, middleName, lastName, suffix }).exec(), //binuo ko pala yung fullname hahahha
      UserDB.findOne({email}).exec(),
    ]);

    //kapag may duplicate na fullname at email ga error meesage
    if(duplicateFullname) return res.status(409).json({message: "Full name already in use. Try changing the first, middle, or last name"});
    if(duplicateEmail) return res.status(409).json({message: 'Email already in use'});

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //a create yung newUser sa usersCollection. kupal, ano mas okay na naming userDB o usersCollection?
    const newUser = new UserDB(
      {
        "firstName": firstName,
        "middleName": middleName,
        "lastName": lastName,
        "suffix": suffix,
        "sex": sex,
        "birthday": birthday,
        "municipality":municipality,
        "barangay": barangay,
        "contactNum": contactNum,
        "email": email,
        "password": hashPassword,
        "roles": [ROLE_LIST.User]
      }
    );

    // gumawa ako ng userName para lang alagay ko sa tokens
    const userName = `${newUser.firstName}, ${newUser.lastName}`;

    //nasa utils folder pala ngani yung generateAccessToke function, don ko nalagay yung mga reuseable functions
    const accessToken = generateAccessToken(process.env.ACCESS_TOKEN_SECRET,
                                            process.env.ACCESS_TOKEN_EXPIRY,
                                            newUser._id,
                                            userName,
                                            newUser.roles
    );
    
    //ito din nasa utils folder magkasama sila ng generate access token sa generateTokens.js
    const refreshToken = generateRefreshToken(process.env.REFRESH_TOKEN_SECRET,
                                              process.env.REFRESH_TOKEN_EXPIRY,
                                              newUser._id, 
                                              userName,
    );

    // na store yung generated refrechToken sa newUser
    newUser.refreshToken = [refreshToken];
    await newUser.save();

    //na store sa cookie yung refreshToken
    res.cookie('jwt', refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', //abaguhin yung NODE_ENV = production sa .env kapag naka host na
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      }
    );

    //kapag successfull na yung pag create ng client ay ga messsage tapos a asama na din yung accessToken sa response
    return res.status(201).json({message: `Successfully created user ${userName}`, accessToken});

  } catch(err){ //kapag may error sa try, alam mo na ito
    console.error(`Error: ${err}`); 
    console.log(`Cause of error: ${err.message}`);

    return res.status(500).json({
      message: 'Something went wrong while creating the user.',
    });
  }
}

 module.exports = signupController;