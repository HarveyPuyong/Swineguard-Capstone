import popupAlert from "../../utils/popupAlert.js";

const handleEditSettings = () => {
  document.addEventListener('renderSettings', () => {
    const form = document.querySelector('#setting-form');
    const saveBtn = document.querySelector('.setting-form__header-save-btn');
    const userId = saveBtn.dataset.userId;

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); 

      const fullName = form.querySelector('#fullname-input').value.trim();
      const [firstName = '', middleName = '', lastName = ''] = fullName.split(' ').map(part => part.trim());

      const address = form.querySelector('#adress-input').value.trim();
      const [barangay = '', municipality = ''] = address.split(',').map(part => part.trim());

      const contactNum = form.querySelector('#contact-input').value.trim();
      const email = form.querySelector('#email-input').value.trim()

      const settingsFormData = { firstName, middleName, lastName, contactNum, barangay, municipality, email }


      try {
        const response = await axios.put(`http://localhost:2500/edit/${userId}`, settingsFormData, { withCredentials: true });

        if (response.status === 200) {
          popupAlert('success', 'Success!', 'Successfully updated the settings')
            .then(() => window.location.reload());
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
