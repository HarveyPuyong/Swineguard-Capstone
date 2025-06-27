import displaySetting from "./display-setting.js";
import handleEditSettings from "./edit-setting.js";
import handleLogout from "../auth/logout.js";


const handleDetailButtons = () => {

  document.addEventListener('renderSettings', () => {
    const details = document.querySelectorAll('.admin-detail.editable');

    details.forEach(detail => {
      const editBtn = detail.querySelector('.edit-btn');
      const cancelBtn = detail.querySelector('.cancel-btn');
      const saveBtn = detail.querySelector('.save-btn');
      const detailInput = detail.querySelector('.admin-detail-value');

      editBtn.addEventListener('click', () => {
        editBtn.classList.remove('show');
        saveBtn.classList.add('show');
        cancelBtn.classList.add('show');
        detailInput.removeAttribute('readonly');
        detailInput.classList.add('editable');
      });

      cancelBtn.addEventListener('click', () => {
        editBtn.classList.add('show');
        saveBtn.classList.remove('show');
        cancelBtn.classList.remove('show');
        detailInput.setAttribute('readonly', 'readonly');
        detailInput.classList.remove('editable');
      });

      saveBtn.addEventListener('click', ()=> {
        const userId = saveBtn.dataset.userId;
        handleEditSettings(userId);
      });
    })
  })
  // const container = document.querySelector('.settings-container__details-list');

  // container.addEventListener('click', (e) => {
  //   const detail = e.target.closest('.admin-detail');
  //   if (!detail) return;



  //   // Handle edit button
  //   if (e.target.closest('.edit-btn')) {

  //   }

  //   // Handle cancel button
  //   if (e.target.closest('.cancel-btn')) {
  //     detailInput.value = detailInput.dataset.original;

  //     
  //   }

  //   // Handle save button
  //   if (e.target.closest('.save-btn')){

  //   }
  // });
};

const logout = () => {
  document.querySelector('.settings-container__header-logout-btn')
    .addEventListener('click', async() => await handleLogout());
}

// ======================================
// ========== Main Function - Setup Settings Section
// ======================================
export default function setupSettingsSection() {
  displaySetting();
  handleDetailButtons();
  logout();
}
