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


// ======================================
// ========== Main Function - Setup Header
// ======================================
export default function setupHeader() {
  toggleSidenav();
  showProfileContainer();
} 