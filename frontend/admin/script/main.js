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



// Edit Mode sa admin profile dun mo makikita sa setting section
const adminProfileEditBtn = document.querySelector('#setting-section .profile-panel__edit-btn');
const adminProfileEditModeBtn = document.querySelector('#setting-section .profile-panel__buttons')
const adminDetailInputs = document.querySelectorAll('#setting-section .profile-panel input');

adminProfileEditBtn.addEventListener('click',  () => {
  adminDetailInputs.forEach(input => {
    input.removeAttribute('readonly');
    input.classList.add('edit-mode')
  });

  adminProfileEditModeBtn.style.display = 'flex';
});


// Cancel Edit Mode sa admin profile 
const adminProfileCancelEditmodeBtn = document.querySelector('#setting-section .profile-panel__cancel-btn');
adminProfileCancelEditmodeBtn.addEventListener('click', () => {
  adminDetailInputs.forEach(input => {
    input.setAttribute('readonly', 'readonly');
    input.classList.remove('edit-mode')
  });

  adminProfileEditModeBtn.style.display = 'none';
})