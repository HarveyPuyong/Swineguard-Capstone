import handleClientLogout from "./../script/auth/logout-client.js"

export default function sideNavFuntionality() {
  const sidenav = document.querySelector('nav.side-nav');
  const sections = document.querySelectorAll('section');
  const sideNavLinks = document.querySelectorAll('.side-nav__link');

  
  sideNavLinks.forEach(nav => {
    const navValue = nav.getAttribute('data-value');

    nav.addEventListener('click', () => {
      sidenav.classList.remove('show')
      sections.forEach(section => {
        const sectionId = section.id;
        if(navValue === sectionId){section.classList.add('show')}
        else if ( navValue === 'logout-btn') { handleClientLogout(); }
        else{   
          section.classList.remove('show');
          section.classList.add('hide');
        } 
      });

      
      
      sections.forEach(section => {
        const activeSection = section.classList.contains('show');

        if(activeSection){
          sideNavLinks.forEach(nav => {
            const navValue = nav.getAttribute('data-value');
            if(section.id === navValue) nav.classList.add('active')
            else nav.classList.remove('active')
          });
        }
      });
    });
  });

  // Close button in sidenav mobile view
  const closeSideNavBtn = document.querySelector('.side-nav__close-button');
  if(!closeSideNavBtn) return;

  closeSideNavBtn.addEventListener('click', () => sidenav.classList.remove('show'));
}
