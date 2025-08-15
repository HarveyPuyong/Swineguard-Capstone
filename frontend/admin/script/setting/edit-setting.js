import popupAlert from "../../utils/popupAlert.js";
import displaySetting from "./display-setting.js";
import api from '../../utils/axiosConfig.js'; 
import header from "../../components/display-header.js";

const handleEditSettings = () => {
  document.addEventListener('renderSettings', () => {
    const form = document.querySelector('#setting-form');
    const saveBtn = document.querySelector('.setting-form__header-save-btn');
    const userId = saveBtn.dataset.userId;

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); 

      // const fullName = form.querySelector('#fullname-input').value.trim();
      // const [firstName = '', middleName = '', lastName = ''] = fullName.split(' ').map(part => part.trim());

      // const address = form.querySelector('#adress-input').value.trim();
      // const [barangay = '', municipality = ''] = address.split(',').map(part => part.trim());

      // const contactNum = form.querySelector('#contact-input').value.trim();
      // const email = form.querySelector('#email-input').value.trim()

      // const settingsFormData = { firstName, middleName, lastName, contactNum, barangay, municipality, email }


      const formData = new FormData();
      formData.append('firstName', form.querySelector('#admin-profile__firstName-input').value.trim());
      formData.append('middleName', form.querySelector('#admin-profile__middleName-input').value.trim());
      formData.append('lastName', form.querySelector('#admin-profile__lastName-input').value.trim());
      formData.append('contactNum', form.querySelector('#admin-profile__contact-input').value.trim());
      formData.append('barangay', form.querySelector('#admin-profile__select-barangay').value.trim());
      formData.append('municipality', form.querySelector('#admin-profile__select-municipal').value.trim());
      formData.append('email', form.querySelector('#admin-profile__email-input').value.trim());

      // 👇 Get the file
      const fileInput = form.querySelector('#admin__profile-image-input');
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
          popupAlert('success', 'Success!', 'Successfully updated the settings')
            .then(() => displaySetting(), header());
        }

      } catch (err) {
        console.log(err);
        const errMessage = err.response?.data?.message || err.response?.data?.error;
        popupAlert('error', 'Error!', errMessage);
      }
    });
  });
};

export default handleEditSettings;
