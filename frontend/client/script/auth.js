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
  // All fields
  const firstField = document.querySelector('.signup-form__first-field');
  const secondField = document.querySelector('.signup-form__second-field');
  const thirdField = document.querySelector('.signup-form__third-field');
  const fourthField = document.querySelector('.signup-form__fourth-field');
  const fifthField = document.querySelector('.signup-form__fifth-field');

  // All fields Inputs
  const firstFieldInputs = document.querySelectorAll('.signup-form__first-field input, .signup-form__first-field select');
  const secondFieldInputs = document.querySelectorAll('.signup-form__second-field input, .signup-form__second-field select');
  const thirdFieldInputs = document.querySelectorAll('.signup-form__third-field select');
  const fourthFieldInputs = document.querySelectorAll('.signup-form__fourth-field input');
  
  // firstField (Name inputs)
  const nextBtn = firstField.querySelector('.signup-form__next-btn');

  // Enable/disable button on input change
  firstFieldInputs.forEach(input => {
    input.addEventListener('change', () => {
      const isAllInputsFilled = Array.from(firstFieldInputs).every(input => {
        if (input.id === 'select-suffix-name') return true;
        return input.value.trim() !== '';
      });

      if (isAllInputsFilled) {
        nextBtn.removeAttribute('disabled');
      } else {
        nextBtn.setAttribute('disabled', 'disabled');
      }
    });
  });

  // Handle next button click
  nextBtn.addEventListener('click', () => {
    const clientFirstName = document.querySelector('#client-input-firstname').value;
    const clientMiddleName = document.querySelector('#client-input-middlename').value;
    const clientLastName = document.querySelector('#client-input-lastname').value;

    if (!checkUserNameLength(clientFirstName, clientLastName, clientMiddleName)) return;

    firstField.classList.remove('show');
    secondField.classList.add('show');
  });



  // SECOND FIELD - Gender, Age, Contact
  const nextBtnSecond = secondField.querySelector('.signup-form__next-btn');
  // Enable/Disable Button on Change
  secondFieldInputs.forEach(input => {
    input.addEventListener('change', () => {
      const isAllInputsFilled = Array.from(secondFieldInputs).every(input => {
        if (input.type === 'radio') {
          const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
          return Array.from(radioGroup).some(r => r.checked);
        }
        return input.value.trim() !== '';
      });

      if (isAllInputsFilled) nextBtnSecond.removeAttribute('disabled');
      else nextBtnSecond.setAttribute('disabled', 'disabled');
    });
  });
  // Click Handler
  nextBtnSecond.addEventListener('click', () => {
    const clientBday = document.querySelector('#client-input-birthday').value;
    const clientPhone = document.querySelector('#client-contact-number').value;
    const isAllInputsFilled = Array.from(secondFieldInputs).every(input => {
      if (input.type === 'radio') {
        const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
        return Array.from(radioGroup).some(r => r.checked);
      }
      return input.value.trim() !== '';
    });

    if (!isAllInputsFilled) return;
    if (!checkUserAge(clientBday)) return;
    if(!checkPhoneNumber(clientPhone)) return;

    secondField.classList.remove('show');
    thirdField.classList.add('show');
  });



  // ThirdField (Municipality, Barangay)
  thirdFieldInputs.forEach(input => {
    input.addEventListener('change', () => {
      const isAllInputsFilled = Array.from(thirdFieldInputs).every(input => input.value.trim() !== '');

      const nextBtn = thirdField.querySelector('.signup-form__next-btn');

      if (isAllInputsFilled) nextBtn.removeAttribute('disabled');
      else nextBtn.setAttribute('disabled', 'disabled');
      
      nextBtn.addEventListener('click', () => {
        thirdField.classList.remove('show');
        fourthField.classList.add('show');
      });
    });
  });



  // Fourth Field (Email, Password, Confirm-password)
  const passwordInputEl = document.querySelector('#client-input-password');
  const confirmPasswordInputEl = document.querySelector('#client-input-confirm-password');
  const nextBtnFourth = fourthField.querySelector('.signup-form__next-btn');

  // Enable/Disable next button based on input validity
  fourthFieldInputs.forEach(input => {
    input.addEventListener('input', () => {
      const isAllInputsFilled = Array.from(fourthFieldInputs).every(input => input.value.trim() !== '');
      const isConfirmPassword = passwordInputEl.value === confirmPasswordInputEl.value;

      if (isAllInputsFilled && isConfirmPassword)
        nextBtnFourth.removeAttribute('disabled');
      else
        nextBtnFourth.setAttribute('disabled', 'disabled');
    });
  });

  // Handle click to go to next field
  nextBtnFourth.addEventListener('click', () => {
    const clientEmail = document.querySelector('#client-input-email').value.trim();
    const password = passwordInputEl.value;
    const confirmPassword = confirmPasswordInputEl.value;

    if (!checkPasswordLength(password, confirmPassword)) return;
    sendOtp(clientEmail);
    fourthField.classList.remove('show');
    fifthField.classList.add('show');
  });

  // fifthField verify otp and create an account
  const otpBtn = fifthField.querySelector('#finish-btn');
  otpBtn.addEventListener('click', () => {
    const clientEmail = document.querySelector('#client-input-email').value.trim();
    verifyOtp(clientEmail, getOTPValue());
  })

}


// ======================================
// ========== Handle Back Field in Signup Form
// ======================================
const handleBackInSignupForm = () => {
  // All fields
  const firstField = document.querySelector('.signup-form__first-field');
  const secondField = document.querySelector('.signup-form__second-field');
  const thirdField = document.querySelector('.signup-form__third-field');
  const fourthField = document.querySelector('.signup-form__fourth-field');
  const fifthField = document.querySelector('.signup-form__fifth-field');

  const backBtns = document.querySelectorAll('.signup-form__back-btn');

  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentField = btn.parentElement.parentElement.classList[0];

      if(parentField === 'signup-form__second-field'){
        secondField.classList.remove('show');
        firstField.classList.add('show');
      }
      else if(parentField === 'signup-form__third-field'){
        thirdField.classList.remove('show');
        secondField.classList.add('show');
      }
      else if(parentField === 'signup-form__fourth-field'){
        fourthField.classList.remove('show');
        thirdField.classList.add('show');
      }
      else if(parentField === 'signup-form__fifth-field'){
        fifthField.classList.remove('show');
        fourthField.classList.add('show');
      }
    });
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
  handleBackInSignupForm();
} 
