const updateSideNav = () => {
  const sections = document.querySelectorAll('section');
  const sideNavLinks = document.querySelectorAll('.side-nav__link');
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
}


function sideNavFuntionality() {
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

      updateSideNav();
    });
  });
}


export {updateSideNav, sideNavFuntionality}
