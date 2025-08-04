import addressesData from '../../../admin/static-data/addresses.js';
import popupAlert from '../../../admin/utils/popupAlert.js'


// ======================================
// ========== Setup sign-up address
// ======================================
const setupSignUpFormAddresses = () => {

  //Add municipilaties and barangay option to select tags
  const municipalitySelect = document.querySelector("#select-municipality");
  const barangaySelect = document.querySelector("#select-barangay");

  if(!municipalitySelect || !barangaySelect) return;

  const municipals = Object.keys(addressesData);

  municipals.forEach(municipal => {
      const option = document.createElement("option");
      option.value = municipal;
      option.textContent = municipal;
      municipalitySelect.appendChild(option);
  });

  municipalitySelect.addEventListener("change", () => {
    const selectedMunicipality = municipalitySelect.value;

    // ✅ Clear previous barangay options
    barangaySelect.innerHTML = '<option value="">Select barangay</option>';

    if (selectedMunicipality && addressesData[selectedMunicipality]) {
      addressesData[selectedMunicipality].forEach(barangay => {
        const option = document.createElement("option");
        option.value = barangay;
        option.textContent = barangay;
        barangaySelect.appendChild(option);
      });
      barangaySelect.disabled = false;
    } else {
      barangaySelect.disabled = true;
    }
  });
};

// ======================================
// ========== Setup age accept only above 18+
// ======================================
const checkUserAge = (birthdayValue) => {
  const birthDate = new Date(birthdayValue);
  const currentDate = new Date();

  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();

  if (birthDate > currentDate) {
    popupAlert('error', 'Error', 'Birthday cannot be in the future.');
    return false;
  } else if (
    age < 18 ||
    (age === 18 && monthDiff < 0) ||
    (age === 18 && monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    popupAlert('warning', 'Warning', 'Age must be 18 and above to register.');
    return false;
  }

  return true;
};

// ======================================
// ========== Setup age accept only above 18+
// ======================================
const checkPhoneNumber = (phoneValue) => {
  if (!phoneValue.startsWith('09')) {
    popupAlert('error', 'Error', 'Phone number must start with 09.');
    return false;
  }
  if (phoneValue.length < 11) {
    popupAlert('error', 'Error', 'Phone number should be 11 digit.');
    return false;
  }
  return true;
}

// ======================================
// ========== Filter user Name
// ======================================
const checkUserNameLength = (firstName, lastName, middleName) => {

  // Check for emojis
  const containsEmoji = (text) => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(text);
  }

  // Check for numbers
  const hasNumber = (input) => /\d/.test(input);

  // Check for Special Characters
  const containsSpecialChar = (input) => /[^a-zA-Z0-9\s]/.test(input);

  if (firstName.length < 3 ) {
    popupAlert('error', 'Error', 'First name should not be less than 2 characters.');
    return false;
  }
  if (lastName.length < 2 || middleName.length < 2) {
    popupAlert('error', 'Error', 'Last name and Middle name should not be less than 1 characters.');
    return false;
  }
  if (containsEmoji(firstName) || containsEmoji(middleName) || containsEmoji(lastName) || 
      hasNumber(firstName) || hasNumber(middleName) || hasNumber(lastName) || 
      containsSpecialChar(firstName) || containsSpecialChar(middleName) || containsSpecialChar(lastName)) {
    popupAlert('error', 'Error', 'Name should not contain emoji, numbers and special characters.');
    return false;
  }

  return true;
}

// ======================================
// ========== Filter Password Strenth
// ======================================
const checkPasswordLength = (passwordInput, confirmPasswordInput) => {
  if (passwordInput.length < 6) {
    popupAlert('warning', 'Warning', 'Password must be 6 character above.');
    return false;
  }
  if (passwordInput !== confirmPasswordInput) {
    popupAlert('error', 'Error', 'Incorrect password check your password correctly.');
    return false;
  }
  return true;
}


// ======================================
// ========== Get 4 digit from user inputs
// ======================================
const getOTPValue = () => {
  const first = document.getElementById('first-digit').value.trim();
  const second = document.getElementById('second-digit').value.trim();
  const third = document.getElementById('third-digit').value.trim();
  const fourth = document.getElementById('forth-digit').value.trim();

  const otp = [first, second, third, fourth].join('');
  return otp;
};


export {
  setupSignUpFormAddresses,
  checkUserAge,
  checkPhoneNumber,
  checkUserNameLength,
  checkPasswordLength,
  getOTPValue
};