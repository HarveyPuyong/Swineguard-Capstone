const toggleSidenav = () => {
  const toggleSidenavIcon = document.querySelector('.header__toggle-side-nav-icon')
    .addEventListener('click', () => {
      const sidenav = document.querySelector('nav.side-nav');
      sidenav.classList.toggle('active');
    });

}


// ======================================
// ========== Main Function - Setup Header
// ======================================
export default function setupHeader() {
  toggleSidenav();
} 