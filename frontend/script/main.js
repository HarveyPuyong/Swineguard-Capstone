const sideNavLinks = document.querySelectorAll('.side-nav__link');
const sections = document.querySelectorAll('section')

sideNavLinks.forEach(nav => {
  const navValue = nav.getAttribute('data-value');

  nav.addEventListener('click', () => {
    sections.forEach(section => {
      const sectionId = section.id;

      console.log(sections)

      if(navValue === sectionId) section.style.display = 'block';
      else section.style.display = 'none';
    });

    sideNavLinks.forEach(nav => nav.classList.remove('active'));
    nav.classList.add('active')
  });
})


// inventory switching table
const inventoryNavLinks = document.querySelectorAll('.inventory-nav__link');
const inventoryTables = document.querySelectorAll('.inventory-table');

inventoryNavLinks.forEach(nav => {
  nav.addEventListener('click', () => {
    const navValue = nav.getAttribute('data-value');

    inventoryTables.forEach(table => {
      const tableValue = table.getAttribute('data-value');
      if(navValue === tableValue) table.style.display = 'block';
      else table.style.display =  'none';
     
    });

    inventoryNavLinks.forEach(link => link.classList.remove('active'));
    nav.classList.add('active');
  });
});


