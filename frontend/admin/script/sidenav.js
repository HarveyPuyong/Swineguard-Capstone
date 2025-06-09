export default function sideNavFuntionality() {
  const sideNavLinks = document.querySelectorAll('.side-nav__link');
  const sections = document.querySelectorAll('section')

  sideNavLinks.forEach(nav => {
    const navValue = nav.getAttribute('data-value');

    nav.addEventListener('click', () => {
      sections.forEach(section => {
        const sectionId = section.id;

        if(navValue === sectionId) section.style.display = 'block';
        else section.style.display = 'none';
      });

      sideNavLinks.forEach(nav => nav.classList.remove('active'));
      nav.classList.add('active')
    });
  });
}
