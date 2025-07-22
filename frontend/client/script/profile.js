// ======================================
// ========== Hide Profile Container
// ======================================
const hideProfileContainer = () => {
  const profileContainer = document.querySelector('.profile-container');

  document.querySelector('.profile-container__close-profile-btn')
    .addEventListener('click', () => profileContainer.classList.remove('show'));
}



// ======================================
// ========== Main Function - Setup Profile
// ======================================
export default function setupProfile() {
  hideProfileContainer();
}