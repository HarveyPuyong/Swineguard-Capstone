import { setupSignUpFormAddresses, 
         checkUserAge, 
         checkPhoneNumber,
         checkUserNameLength,
         checkPasswordLength} from "./auth/setup-signup.js";
         
import createAccount from "./auth/sigup.js";
import popupAlert from "../../admin/utils/popupAlert.js";
import sendOtp from "./auth/send-otp.js";

  let clientInfo = []; // Data where they are pre-stored

  //Forms
  const loginForm = document.querySelector('#login-form');
  const nameFields = document.querySelector('#signup-form');
  const emailFields = document.querySelector('#signup-form-email');
  const otpFields = document.querySelector('#signup-form-otp');


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
// ========== Handle Client Information
// ======================================
const handleNextInSignupForm = () => {
  const firstField = document.querySelector('.signup-form__first-field');
  const secondField = document.querySelector('.signup-form__second-field');
  const thirdField = document.querySelector('.signup-form__third-field');
  const fourthField = document.querySelector('.signup-form__fourth-field');

  const firstFieldInputs = document.querySelectorAll('.signup-form__first-field input, .signup-form__first-field select');
  const secondFieldInputs = document.querySelectorAll('.signup-form__second-field input, .signup-form__second-field select');
  const thirdFieldInputs = document.querySelectorAll('.signup-form__third-field select');

  // ================= First Field (Name Inputs)
  const firstNextBtn = firstField.querySelector('.signup-form__next-btn');
  firstFieldInputs.forEach(input => {
    input.addEventListener('input', () => {
      const isAllInputsFilled = Array.from(firstFieldInputs).every(input => {
        if (input.id === 'select-suffix-name') return true;
        return input.value.trim() !== '';
      });

      firstNextBtn.disabled = !isAllInputsFilled;
    });
  });

  firstNextBtn.addEventListener('click', () => {
    const firstNameInput = document.querySelector('#client-input-firstname').value;
    const lastNameInput = document.querySelector('#client-input-lastname').value;
    const middleNameInput = document.querySelector('#client-input-middlename').value;

    const isValidInputName = checkUserNameLength(firstNameInput, lastNameInput, middleNameInput);
    if (!isValidInputName) return;

    firstField.classList.remove('show');
    secondField.classList.add('show');
  });

  // ================= Second Field (Gender, Age, Contact)
  const secondNextBtn = secondField.querySelector('.signup-form__next-btn');
  secondFieldInputs.forEach(input => {
    input.addEventListener('input', () => {
      const isAllInputsFilled = Array.from(secondFieldInputs).every(input => {
        if (input.type === 'radio') {
          const radios = document.querySelectorAll(`input[name="${input.name}"]`);
          return Array.from(radios).some(radio => radio.checked);
        }
        return input.value.trim() !== '';
      });

      secondNextBtn.disabled = !isAllInputsFilled;
    });
  });

  secondNextBtn.addEventListener('click', () => {
    const birthdayInput = document.querySelector('#input-birthday');
    const phoneInput = document.querySelector('#client-contact-number');

    const isValidAge = checkUserAge(birthdayInput.value);
    const isValidPhone = checkPhoneNumber(phoneInput.value);

    if (!isValidAge || !isValidPhone) return;

    secondField.classList.remove('show');
    thirdField.classList.add('show');
  });

  // ================= Third Field (Address)
  const thirdNextBtn = thirdField.querySelector('.signup-form__next-btn');
  thirdFieldInputs.forEach(input => {
    input.addEventListener('input', () => {
      const isAllInputsFilled = Array.from(thirdFieldInputs).every(input => input.value.trim() !== '');
      thirdNextBtn.disabled = !isAllInputsFilled;
    });
  });

  thirdNextBtn.addEventListener('click', () => {
    const firstName = document.querySelector('#client-input-firstname').value.trim();
    const middleName = document.querySelector('#client-input-middlename').value.trim();
    const lastName = document.querySelector('#client-input-lastname').value.trim();
    const suffix = document.querySelector('#select-suffix-name').value;
    const sex = document.querySelector('input[name="gender"]:checked').value;
    const birthday = document.querySelector('#input-birthday').value.trim();
    const contactNum = document.querySelector('#client-contact-number').value.trim();
    const municipality = document.querySelector('#select-municipality').value;
    const barangay = document.querySelector('#select-barangay').value;

    clientInfo = [{
      firstName, middleName, lastName, suffix,
      sex, birthday, contactNum, municipality, barangay
    }];

    console.log('Client Info:', clientInfo);

    thirdField.classList.remove('show');
    nameFields.classList.remove('show');
    nameFields.classList.add('hide');
    emailFields.classList.add('show');  // change this as needed
  });
};



// ======================================
// ========== Handle Email Forms
// ======================================
const emailFormNextBtn = () => {
  const emailFieldsNextBtn = document.querySelector('#signup-form-email .signup-form__next-btn');

  emailFieldsNextBtn.addEventListener('click', () => {
    // ✅ Move value access inside the event listener
    const clientEmailInputs = document.querySelector('#client-input-email').value.trim();
    const clientPasswordInputs = document.querySelector('#client-input-password').value.trim();
    const clientConfirmPasswordInputs = document.querySelector('#client-input-confirm-password').value.trim();

    // ✅ Fix condition: use ! to check all
    if (!clientEmailInputs || !clientPasswordInputs || !clientConfirmPasswordInputs) {
      popupAlert('error', 'Error', 'Please fill in all fields.');
      return;
    }

    if (!checkPasswordLength(clientPasswordInputs, clientConfirmPasswordInputs)) return;

    // ✅ Update clientInfo array
    clientInfo[0] = {
      ...clientInfo[0],
      email: clientEmailInputs,
      password: clientPasswordInputs,
      confirmPassword: clientConfirmPasswordInputs,
    };

    console.log('clientInfo updated:', clientInfo);
    sendOtp(clientEmailInputs);

    // ✅ Transition to OTP step
    emailFields.classList.remove('show');  
    emailFields.classList.add('hide'); 
    otpFields.classList.add('show');
  });
};

const otpFormSendBtn = () => {
  //const otpFieldSendBtn = document.querySelector('#signup-form-otp .signup-form__next-btn');
  otpFields.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const clientOtp = [
      document.querySelector('#first-digit').value,
      document.querySelector('#second-digit').value,
      document.querySelector('#third-digit').value,
      document.querySelector('#forth-digit').value
    ].join('');

    if (!clientOtp) { return };

    clientInfo[0] = {
      ...clientInfo[0],
      otp: clientOtp
    };
    console.log('OTP added to clientInfo:', clientInfo);

    createAccount(clientInfo);
  });

}




// ======================================
// ========== Handle Back Field in Signup Form
// ======================================
const handleBackInSignupForm = () => {
  // All fields
  const firstField = document.querySelector('.signup-form__first-field');
  const secondField = document.querySelector('.signup-form__second-field');
  const thirdField = document.querySelector('.signup-form__third-field');
  // const fourthField = document.querySelector('.signup-form__fourth-field');
  // const fifthField = document.querySelector('.signup-form__fifth-field');
  // const sixthField = document.querySelector('.signup-form__sixth-field');

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
  handleChangeForm();
  handleNextInSignupForm();
  handleTogglePasswordVisibility();
  handleBackInSignupForm();
  setupSignUpFormAddresses();
  emailFormNextBtn();
  otpFormSendBtn();
} 
