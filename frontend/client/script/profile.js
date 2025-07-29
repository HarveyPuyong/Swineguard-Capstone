import handleClientLogout from "./auth/logout-client.js";
import {displayClientProfileSetting, displayClientName} from "./setting/display-setting.js";

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
  enableEditModeBtn.addEventListener('click', () => {
    profileForm.classList.remove('view-mode');
    profileForm.classList.add('edit-mode');
  });

  // disable
  disableEditModeBtn.addEventListener('click', () => {
    profileForm.classList.add('view-mode');
    profileForm.classList.remove('edit-mode');
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
// ✅ Event listener for dynamic content
// ======================================
document.addEventListener('renderClientProfile', () => {
  toggleEditMode(); // Runs only after profile HTML is rendered
});


// ======================================
// ========== Main Function - Setup Profile
// ======================================
export default async function setupProfile() {
  displayClientName();
  await displayClientProfileSetting();
  hideProfileContainer();
  handleLogoutBtn();
}