import fetchClient from "./auth/fetch-client.js";

// ======================================
// ========== Toggles Sidenav
// ======================================
const toggleSidenav = () => {
  const toggleSidenavIcon = document.querySelector('.header__toggle-side-nav-icon');
  const sidenav = document.querySelector('nav.side-nav');

  toggleSidenavIcon.addEventListener('click', () => sidenav.classList.toggle('show'));


   document.addEventListener('click', (e) => {
    if (sidenav.classList.contains('show') && !sidenav.contains(e.target) && !toggleSidenavIcon.contains(e.target)) 
       { sidenav.classList.remove('show')}
  });
}


// ======================================
// ========== Show Profile Container
// ======================================
const showProfileContainer = () => {
  const profileContainer = document.querySelector('.profile-container');

  document.querySelector('.header__profile-pic')
    .addEventListener('click', () => profileContainer.classList.add('show'));
}

const dipslayHeaderProfileImg = async() => {
  const user = await fetchClient();
  const { _id } = user;
  //const user = users.filter(user => user._id === _id);

  const profileImg = document.querySelector('.header__profile').innerHTML = `
    <img class="header__profile-pic" src="${user.profileImage ? '/uploads/' + user.profileImage : './images-and-icons/icons/default-profile.png'}" alt="picture">
  `;
  document.dispatchEvent(new Event('renderClientProfileImage'));

}

document.addEventListener('renderClientProfileImage', () => {
  showProfileContainer();
})


// ======================================
// ========== Main Function - Setup Header
// ======================================
export default function setupHeader() {
  toggleSidenav();
  dipslayHeaderProfileImg();
} 