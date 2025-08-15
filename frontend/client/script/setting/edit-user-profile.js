import api from "../../client-utils/axios-config.js";
import popupAlert from "../../client-utils/client-popupAlert.js"
import { displayClientProfileSetting } from "./display-setting.js";
import dipslayHeaderProfileImg from "../../components/display-header.js";

const handleClientEditSettings = () => {

  document.addEventListener('renderClientProfile', () => {
    const profileForm = document.querySelector('#profile-details-form');
    const form = document.querySelector('#profile-details-form');
    const saveBtn = document.querySelector('#client-profile__save-btn');
    const userId = saveBtn.dataset.userId;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('firstName', form.querySelector('#profile-detail__firstname-input').value.trim());
      formData.append('middleName', form.querySelector('#profile-detail__middlename-input').value.trim());
      formData.append('lastName', form.querySelector('#profile-detail__lastname-input').value.trim());
      formData.append('contactNum', form.querySelector('#profile-detail__contact-input').value.trim());
      formData.append('barangay', form.querySelector('#profile-detail__select-barangay').value.trim());
      formData.append('municipality', form.querySelector('#profile-detail__select-municipal').value.trim());
      formData.append('email', form.querySelector('#profile-detail__email-input').value.trim());

      // 👇 Get the file
      const fileInput = form.querySelector('#profile-image-input');
      if (fileInput.files.length > 0) {
        formData.append('profileImage', fileInput.files[0]); // field name must match your backend
      }

      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.put(`/edit/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          popupAlert('success', 'Success!', 'Successfully updated the settings').then(() => {
            displayClientProfileSetting();
            dipslayHeaderProfileImg();
            profileForm.classList.add('view-mode');
            profileForm.classList.remove('edit-mode');
          });
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