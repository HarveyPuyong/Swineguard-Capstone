import api from "../../client-utils/axios-config.js";
import popupAlert from "../../client-utils/client-popupAlert.js"
import { displayClientProfileSetting } from "./display-setting.js";

const handleClientEditSettings = () => {

  document.addEventListener('renderClientProfile', () => {
    const profileForm = document.querySelector('#profile-details-form');
    const form = document.querySelector('#profile-details-form');
    const saveBtn = document.querySelector('#client-profile__save-btn');
    const userId = saveBtn.dataset.userId;

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); 

        const settingsFormData = { 
            firstName: form.querySelector('#profile-detail__firstname-input').value.trim(), 
            middleName: form.querySelector('#profile-detail__middlename-input').value.trim(), 
            lastName: form.querySelector('#profile-detail__lastname-input').value.trim(), 
            contactNum: form.querySelector('#profile-detail__contact-input').value.trim(), 
            barangay: form.querySelector('#profile-detail__select-barangay').value.trim(), 
            municipality: form.querySelector('#profile-detail__select-municipal').value.trim(), 
            email: form.querySelector('#profile-detail__email-input').value.trim()
        }


        try {
            const token = localStorage.getItem('accessToken');

            const response = await api.put(`/edit/${userId}`, settingsFormData);

            if (response.status === 200) {
                popupAlert('success', 'Success!', 'Successfully updated the settings')
                .then( () => 
                    displayClientProfileSetting(),
                    profileForm.classList.add('view-mode'),
                    profileForm.classList.remove('edit-mode')
                );
            }

        } catch (err) {
            console.log(err);
            const errMessage = err.response?.data?.message || err.response?.data?.error;
            popupAlert('error', 'Error!', errMessage);
        }
    });
  });
};


export default handleClientEditSettings;