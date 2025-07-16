import updateSidenav from "../utils/updateSidenav.js"; 


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



