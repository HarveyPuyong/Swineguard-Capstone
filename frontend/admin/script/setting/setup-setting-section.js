import displaySetting from "./display-setting.js";
import handleEditSettings from "./edit-setting.js";
import addressesData from "../../static-data/addresses.js";


const handleUpdateButtons = () => {
  document.addEventListener('renderSettings', () => {
    const editBtn = document.querySelector('.setting-form__header-edit-btn');
    const cancelBtn = document.querySelector('.setting-form__header-cancel-btn');
    const saveBtn = document.querySelector('.setting-form__header-save-btn');
    const nameFieldTag = document.querySelector('.name-input-field');
    const editableDetails = document.querySelectorAll(
      '.setting-form__details-list .admin-detail.editable input, .setting-form__details-list .admin-detail.editable select'
    );
    const uploadImgBtn = document.querySelector('.setting-form .admin-image__upload-btn')
    
    // handle Edit Btn
    editBtn.addEventListener('click', () => {
      editBtn.classList.remove('show')
      cancelBtn.classList.add('show');
      saveBtn.classList.add('show');
      nameFieldTag.classList.add('edit-mode');

      uploadImgBtn.classList.add('show');

      editableDetails.forEach(detail => {
        if (detail.tagName === 'INPUT') {
          detail.removeAttribute('readonly');
        } else if (detail.tagName === 'SELECT') {
          detail.removeAttribute('disabled');
        }
        detail.classList.add('editable');
      });
    });

    // handle Edit Btn
    cancelBtn.addEventListener('click', () => {
      editBtn.classList.add('show')
      cancelBtn.classList.remove('show');
      saveBtn.classList.remove('show');
      nameFieldTag.classList.remove('edit-mode');

      uploadImgBtn.classList.remove('show');

      editableDetails.forEach(detail => {
        if (detail.tagName === 'INPUT') {
          detail.setAttribute('readonly', 'readonly');
        } else if (detail.tagName === 'SELECT') {
          detail.setAttribute('disabled', 'disabled');
        }
        detail.classList.remove('editable');
      });
    });
  });
};


// ======================================
// ========== Set up addresses
// ======================================
const populateAddresses = () => {
  const municipalitySelect = document.querySelector('#admin-profile__select-municipal');
  const barangaySelect = document.querySelector('#admin-profile__select-barangay');

  if(!municipalitySelect || !barangaySelect) return;

  const municipals = Object.keys(addressesData);

  municipals.forEach(municipal => {
      const option = document.createElement("option");
      option.value = municipal;
      option.textContent = municipal;
      municipalitySelect.appendChild(option);
  });

  municipalitySelect.addEventListener("change", () => {
    const selectedMunicipality = municipalitySelect.value;

    // ✅ Clear previous barangay options
    barangaySelect.innerHTML = '<option value="">Select barangay</option>';

    if (selectedMunicipality && addressesData[selectedMunicipality]) {
      addressesData[selectedMunicipality].forEach(barangay => {
        const option = document.createElement("option");
        option.value = barangay;
        option.textContent = barangay;
        barangaySelect.appendChild(option);
      });
      barangaySelect.disabled = false;
    } else {
      barangaySelect.disabled = true;
    }
  });
}

document.addEventListener('renderSettings', () => {
  populateAddresses();
})


// ======================================
// ========== Main Function - Setup Settings Section
// ======================================
export default function setupSettingsSection() {
  displaySetting();
  handleUpdateButtons();
  handleEditSettings();
}
