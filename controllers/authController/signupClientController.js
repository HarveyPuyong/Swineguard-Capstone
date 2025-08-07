const bcrypt = require('bcrypt');
const ROLE_LIST = require('../../config/role_list');
const UserDB = require('../../models/userModel');
const { isValidInput, containsEmoji, hasNumber, containsSpecialChar } = require('./../../utils/inputChecker');
const { generateAccessToken, generateRefreshToken } = require('../../utils/generateTokens');

exports.signupClientController = async (req, res) => {
  const {
    firstName, middleName, lastName, suffix,
    sex, birthday, municipality, barangay, contactNum,
    email, password, confirmPassword
  } = req.body;

  // Name validations
  if ([firstName, middleName, lastName].some(containsEmoji)) {
    return res.status(400).json({ message: 'Emojis are not allowed in names.' });
  }

  if ([firstName, middleName, lastName].some(hasNumber)) {
    return res.status(400).json({ message: 'Numbers are not allowed in names.' });
  }

  if ([firstName, middleName, lastName].some(containsSpecialChar)) {
    return res.status(400).json({ message: 'Special characters are not allowed in names.' });
  }

  if ([firstName, middleName, lastName].some(name => !isValidInput(name))) {
    return res.status(400).json({ message: 'Names are too short.' });
  }

  // Birthday validation
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

  // Contact number validation
  const contactPattern = /^09\d{9}$/;
  if (!contactPattern.test(contactNum)) {
    return res.status(400).json({ message: 'Contact number must start with "09" and be 11 digits long.' });
  }

  // Password match
  if (password.trim() !== confirmPassword.trim()) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    const existingUser = await UserDB.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'OTP verification required before signup.' });
    }

    // ✅ Prevent duplicate registration
    if (existingUser.password) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }
    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Update user info
    existingUser.firstName = firstName;
    existingUser.middleName = middleName;
    existingUser.lastName = lastName;
    existingUser.suffix = suffix;
    existingUser.sex = sex;
    existingUser.birthday = birthday;
    existingUser.contactNum = contactNum;
    existingUser.municipality = municipality;
    existingUser.barangay = barangay;
    existingUser.password = hashedPassword;
    existingUser.roles = [ROLE_LIST.User];

    const userName = `${firstName}, ${lastName}`;

    const accessToken = generateAccessToken(
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRY,
      existingUser._id,
      userName,
      existingUser.roles
    );

    const refreshToken = generateRefreshToken(
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRY,
      existingUser._id,
      userName
    );

    existingUser.refreshToken = [refreshToken];
    await existingUser.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      message: `Successfully created user ${userName}`,
      accessToken
    });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      message: 'Something went wrong while creating the user.'
    });
  }
};
