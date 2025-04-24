const inventoryNavLinks = document.querySelectorAll('.inventory-nav__link');
const inventoryTables = document.querySelectorAll('.inventory-table');

inventoryNavLinks.forEach(nav => {
  nav.addEventListener('click', () => {
    const navValue = nav.getAttribute('data-value');

    inventoryTables.forEach(table => {
      const tableValue = table.getAttribute('data-value');
      table.style.display = (navValue === tableValue) ? 'block' : 'none';
    });

    inventoryNavLinks.forEach(link => link.classList.remove('active'));
    nav.classList.add('active');
  });
});
