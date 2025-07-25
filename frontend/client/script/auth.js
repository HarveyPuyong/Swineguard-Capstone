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
  const termsAndConditionCheckbox = document.querySelector('.signup-form__fifth-field #terms-and-condition-checkbox');
  
  // firstField (Name inputs)
  firstFieldInputs.forEach(input => {
    input.addEventListener('change', () => {
      const isAllInputsFilled = Array.from(firstFieldInputs).every(input => {
        if (input.id === 'select-suffix-name') return true; 
        return input.value.trim() !== '';
      });

      const nextBtn = firstField.querySelector('.signup-form__next-btn');
    
      if (isAllInputsFilled) nextBtn.removeAttribute('disabled');
      else nextBtn.setAttribute('disabled', 'disabled');
      
      nextBtn.addEventListener('click', () => {
        firstField.classList.remove('show');
        secondField.classList.add('show');
      })
    });
  });

  // SecondField (Gender, Age, Contact)
  secondFieldInputs.forEach(input => {
    input.addEventListener('change', () => {
      const isAllInputsFilled = Array.from(secondFieldInputs).every(input => {
        if (input.type === 'radio') {
          const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
          const isChecked = Array.from(radioGroup).some(radio => radio.checked);
          return isChecked;
        }
        return input.value.trim() !== '';
      });

      const nextBtn = secondField.querySelector('.signup-form__next-btn');

      if (isAllInputsFilled) nextBtn.removeAttribute('disabled');
      else nextBtn.setAttribute('disabled', 'disabled');
      
      nextBtn.addEventListener('click', () => {
        secondField.classList.remove('show');
        thirdField.classList.add('show');
      });
    });
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

  // fourthField (Email, Password, Confirm-password)
  fourthFieldInputs.forEach(input => {
    input.addEventListener('change', () => {
      const passwordInput = document.querySelector('#signup-form #input-password');
      const confirmPasswordInput = document.querySelector('#signup-form #input-confirm-password');

      const isAllInputsFilled = Array.from(fourthFieldInputs).every(input => input.value.trim() !== '');
      const isConfirmPassword = passwordInput.value === confirmPasswordInput.value;

      const nextBtn = fourthField.querySelector('.signup-form__next-btn');

      if (isAllInputsFilled && isConfirmPassword)
         nextBtn.removeAttribute('disabled');
      else 
         nextBtn.setAttribute('disabled', 'disabled');
      

      nextBtn.addEventListener('click', () => {
        fourthField.classList.remove('show');
        fifthField.classList.add('show');
      });
    });
  });

  // fifthField (Terms and conditions)
  const finishBtn = fifthField.querySelector('.signup-form__finish-btn');

  termsAndConditionCheckbox.addEventListener('change', () => {
    if(termsAndConditionCheckbox.checked){
      finishBtn.removeAttribute('disabled');
    } else {
      finishBtn.setAttribute('disabled', 'disabled');
    }
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
function authMain() {
  handleChangeForm();
  handleNextInSignupForm();
  handleTogglePasswordVisibility();
} 

authMain()