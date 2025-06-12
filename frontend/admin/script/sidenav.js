import updateSidenav from "../utils/updateSidenav.js"; // Import the updateSidenav utility function from the utils folder

export default function sideNavFuntionality() {
  const sideNavLinks = document.querySelectorAll('.side-nav__link');
  const sections = document.querySelectorAll('section')

  sideNavLinks.forEach(nav => {
    const navValue = nav.getAttribute('data-value');

    nav.addEventListener('click', () => {
      sections.forEach(section => {
        const sectionId = section.id;
        if(navValue === sectionId){section.classList.add('show')} 
        else{   
          section.classList.remove('show');
          section.classList.add('hide')
        } 
      });

      updateSidenav();
    });
  });
}



