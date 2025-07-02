import displaySetting from "./display-setting.js";
import handleEditSettings from "./edit-setting.js";


const handleUpdateButtons = () => {
  document.addEventListener('renderSettings', () => {
    const editBtn = document.querySelector('.setting-form__header-edit-btn');
    const cancelBtn = document.querySelector('.setting-form__header-cancel-btn');
    const saveBtn = document.querySelector('.setting-form__header-save-btn');
    const editableDetails = document.querySelectorAll('.setting-form__details-list .admin-detail.editable input');
    
    // handle Edit Btn
    editBtn.addEventListener('click', () => {
      editBtn.classList.remove('show')
      cancelBtn.classList.add('show');
      saveBtn.classList.add('show');

      editableDetails.forEach(detail => {
        detail.removeAttribute('readonly');
        detail.classList.add('editable');
      });
    });

    // handle Edit Btn
    cancelBtn.addEventListener('click', () => {
      editBtn.classList.add('show')
      cancelBtn.classList.remove('show');
      saveBtn.classList.remove('show');

      editableDetails.forEach(detail => {
        detail.setAttribute('readonly', 'readonly');
        detail.classList.remove('editable');
      });
    });
  });
};


// ======================================
// ========== Main Function - Setup Settings Section
// ======================================
export default function setupSettingsSection() {
  displaySetting();
  handleUpdateButtons();
  handleEditSettings();
}
