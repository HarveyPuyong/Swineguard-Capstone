import handleLogout from './auth/logout.js'

// ======================================
// ========== Toggles Sidenav
// ======================================
const toggleSidenav = () => {
  const toggleSidenavIcon = document.querySelector('.header__toggle-side-nav-icon');
  const sidenav = document.querySelector('nav.side-nav');

  toggleSidenavIcon.addEventListener('click', () => sidenav.classList.toggle('active'));


   document.addEventListener('click', (e) => {
    if (sidenav.classList.contains('active') && !sidenav.contains(e.target) && !toggleSidenavIcon.contains(e.target)) 
      { sidenav.classList.remove('active');}
  });
}


// ======================================
// ========== Toggle Logout Button
// ======================================
const toggleLogoutBtn = () => {
  const toggleLogoutBtn = document.querySelector('.header__toggle-logout-btn');
  const logoutBtn = document.querySelector('.header__logout-btn');

  toggleLogoutBtn.addEventListener('click', () => {
    toggleLogoutBtn.classList.toggle('active');

    if(toggleLogoutBtn.classList.contains('active')) logoutBtn.classList.add('show');
    else logoutBtn.classList.remove('show');
  });

  document.addEventListener('click', (e) => {
    if (logoutBtn.classList.contains('show')) {
      if (!logoutBtn.contains(e.target) && !toggleLogoutBtn.contains(e.target)) {
        logoutBtn.classList.remove('show');
        toggleLogoutBtn.classList.remove('active');
      }
    }
  });
}


// ======================================
// ========== Handle Logout
// ======================================
const logout = () => {
  const logoutBtn = document.querySelector('.header__logout-btn')
    .addEventListener('click', async() => await handleLogout());
}



// ======================================
// ========== Main Function - Setup Header
// ======================================
export default function setupHeader() {
  toggleSidenav();
  toggleLogoutBtn();
  logout();
} 