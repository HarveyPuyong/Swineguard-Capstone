import {   
  setupSignUpFormAddresses,
  checkUserAge,
  checkPhoneNumber,
  checkUserNameLength, 
  checkPasswordLength,
  getOTPValue } from './auth/setup-signup.js';

import { sendOtp, verifyOtp } from './auth/handle-otp.js';


// ======================================
// ========== Handle Change Form
// ======================================
const handleChangeForm = () => {
  const loginForm = document.querySelector('#login-form');
  const signupForm = document.querySelector('#signup-form');

  // change to signup
  document.querySelector('.change-to-signup-btn').
    addEventListener('click', () => {
      loginForm.classList.remove('show');
      signupForm.classList.add('show');
  });

  // change to login
  document.querySelector('.change-to-login-btn').
    addEventListener('click', () => {
      loginForm.classList.add('show');
      signupForm.classList.remove('show');
  });
}


// ======================================
// ========== Handle Next Field in Singup Form
// ======================================
const handleNextInSignupForm = () => {

  // All fields Inputs
  const userDetailsContainer = document.querySelector('.signup-form__input-field');
  const userOTPContainer = document.querySelector('.signup-form__otp-field');
  const backBtn = document.querySelector('.signup-form__back-btn');
  
  // firstField (Name inputs)
  const nextBtn = document.querySelector('.signup-form__next-btn');
  const userEmail = document.querySelector('#client-input-email');

  // Enable/disable button on input change
  nextBtn.addEventListener('click', async() => {

    // Client Name:
    const firstName = document.querySelector('#client-input-firstname').value;
    const middleName = document.querySelector('#client-input-middlename').value;
    const lastName = document.querySelector('#client-input-lastname').value;

    //Birthday & Phone
    const birthdayValue = document.querySelector('#client-input-birthday').value;
    const phoneValue = document.querySelector('#client-contact-number').value;

    const passwordInput = document.querySelector('#client-input-password').value;
    const confirmPasswordInput = document.querySelector('#client-input-confirm-password').value;

    const isAgeValid = checkUserAge(birthdayValue);
    const isPhoneValid = checkPhoneNumber(phoneValue);
    const isNameValid = checkUserNameLength(firstName, lastName, middleName);
    const isPasswordValid = checkPasswordLength(passwordInput, confirmPasswordInput);

    // ❗ Stop if any validation is false
    if (!isAgeValid || !isPhoneValid || !isNameValid || !isPasswordValid) {
      return;
    }
    
    userOTPContainer.classList.add('show');
    userDetailsContainer.classList.remove('show');
    await sendOtp(userEmail.value);
  });



  // Auto move OTP inputs
  const otpInputs = document.querySelectorAll(".otp-container input");

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      // Allow only numbers
      input.value = input.value.replace(/\D/g, "");

      if (input.value.length === 1) {
        // Move to next input if exists
        if (index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "") {
        // Move to previous input
        if (index > 0) {
          otpInputs[index - 1].focus();
        }
      }
    });
  });


  //Back Button
  backBtn.addEventListener('click', () => {
    userOTPContainer.classList.remove('show');
    userDetailsContainer.classList.add('show');
  })

  const submitBtn = document.querySelector('.signup-form__submit-btn');
  submitBtn.addEventListener('click', async() => {
    const otp = getOTPValue(); // <-- NOW it's correct

    const isVerified = await verifyOtp(userEmail.value, otp);

    if (!isVerified) return;

  });

}





// ======================================
// ========== Handle Toggle Password Visibility
// ======================================
const handleTogglePasswordVisibility = () => {
  const passwordInputContainer = document.querySelectorAll('.password-input-container');
  
  passwordInputContainer.forEach(container => {
    const passwordEye = container.querySelector('.password-eye-icon');
    const eyeSlash = container.querySelector('.eye-slash');
    const input = container.querySelector('input[type="password"]')

    passwordEye.addEventListener('click', () => {
      console.log(eyeSlash)
      eyeSlash.classList.toggle('active');

      if(eyeSlash.classList.contains('active')){
        input.setAttribute('type', 'text');
      }else{
        input.setAttribute('type', 'password');
      }
    });
  });

  
}


// ======================================
// ========== Main Function 
// ======================================
export function authMain() {
  setupSignUpFormAddresses();
  handleChangeForm();
  handleNextInSignupForm();
  handleTogglePasswordVisibility();

} 
