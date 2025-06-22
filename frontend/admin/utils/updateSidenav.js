export default function updateSidenav() {
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
