import handleClientLogout from "./auth/logout-client.js";
import {displayClientProfileSetting, displayClientName} from "./setting/display-setting.js";
import handleClientEditSettings from "./setting/edit-user-profile.js";
import addressesData from "../../admin/static-data/addresses.js";
import fetchClient from "./auth/fetch-client.js";

// ======================================
// ========== Hide Profile Container
// ======================================
const hideProfileContainer = () => {
  const profileContainer = document.querySelector('.profile-container');

  document.querySelector('.profile-container__close-profile-btn')
    .addEventListener('click', () => profileContainer.classList.remove('show'));
}


// ======================================
// ========== Toggle Edit Mode
// ======================================
const toggleEditMode = () => {
  const profileForm = document.querySelector('#profile-details-form');
  
  const enableEditModeBtn = document.querySelector('.profile-details-list__edit-btn.enable-edit-mode-button');
  const disableEditModeBtn = document.querySelector('.profile-details-list__cancel-btn.disable-edit-mode-button');

  // enable
  enableEditModeBtn.addEventListener('click', async() => {
    profileForm.classList.remove('view-mode');
    profileForm.classList.add('edit-mode');
    const user = await fetchClient();
    const middleNameInput = document.getElementById('profile-detail__middlename-input');
    middleNameInput.value = user.middleName;

    // Make inputs editable
    profileForm.querySelectorAll('input, select').forEach(el => {
      el.removeAttribute('readonly');
      el.removeAttribute('disabled');
    });
  });

  // disable
  disableEditModeBtn.addEventListener('click', () => {
    profileForm.classList.add('view-mode');
    profileForm.classList.remove('edit-mode');

    // Lock inputs again
    profileForm.querySelectorAll('input, select').forEach(el => {
      if (el.tagName.toLowerCase() === 'input') {
        el.setAttribute('readonly', true);
      } else if (el.tagName.toLowerCase() === 'select') {
        el.setAttribute('disabled', true);
      }
    });

    displayClientProfileSetting();
  });
}

// ======================================
// ========== Set up addresses
// ======================================
const populateAddresses = () => {
  const municipalitySelect = document.querySelector('#profile-detail__select-municipal');
  const barangaySelect = document.querySelector('#profile-detail__select-barangay');

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
}


// ======================================
// ========== Toggle Edit Mode
// ======================================
const handleLogoutBtn = () => {
  const logoutBtn = document.querySelector('#client-logout-btn');
  if (!logoutBtn) {
    console.log('Client logput button not exist!');
    return;
  }
  logoutBtn.addEventListener('click', handleClientLogout);
}


// ======================================
// ========== Pre Display user profile input
// ======================================
const preDisplayProfileImg = () => {

  const profileImgInput =  document.querySelector('#profile-image-input');
  const profileImg = document.querySelector('#client-profile-img');

  profileImgInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();

      reader.addEventListener('load', function () {
        profileImg.src = reader.result;
      });

      reader.readAsDataURL(file); // Read file as data URL
    } else {
      profileImg.src = 'images-and-icons/icons/default-profile.png';
      return
    }
  });
}


// ======================================
// ✅ Event listener for dynamic content
// ======================================
document.addEventListener('renderClientProfile', () => {
  toggleEditMode(); // Runs only after profile HTML is rendered
  populateAddresses();
  preDisplayProfileImg();
});


// ======================================
// ========== Main Function - Setup Profile
// ======================================
export default function setupProfile() {
  displayClientName();
  displayClientProfileSetting();
  hideProfileContainer();
  handleLogoutBtn();
  handleClientEditSettings();
}