import updateSidenav from "../utils/updateSidenav.js"; 
import handleLogout from "./auth/logout.js";


export default function sideNavFuntionality() {
  const sidenav = document.querySelector('nav.side-nav');
  const sideNavLinks = document.querySelectorAll('.side-nav__link');
  const sections = document.querySelectorAll('section');

  sideNavLinks.forEach(nav => {
    const navValue = nav.getAttribute('data-value');

    nav.addEventListener('click', () => {
      sidenav.classList.remove('show')
      sections.forEach(section => {
        const sectionId = section.id;
        if(navValue === sectionId){section.classList.add('show')}
        else if ( navValue === 'logout-btn') { handleLogout(); }
        else{   
          section.classList.remove('show');
          section.classList.add('hide');
        } 
      });

      updateSidenav();
    });
  });

  // Close button in sidenav mobile view
  const closeSideNavBtn = document.querySelector('.side-nav__close-button');
  if(!closeSideNavBtn) return;

  closeSideNavBtn.addEventListener('click', () => sidenav.classList.remove('show'));
}



