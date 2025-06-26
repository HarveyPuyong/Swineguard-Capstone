import popupAlert from "../../utils/popupAlert.js";

const handleEditSettings = (userId) => {
  const form = document.querySelector('#settings-form');

  form.addEventListener('submit',  async(e) => {
    e.preventDefault();

    const fullName = document.querySelector('#settings-form #fullname-input').value.trim();
    const [firstName = '', middleName = '', lastName = ''] = fullName.split(' ').map(part => part.trim());

    const address = document.querySelector('#settings-form #adress-input').value.trim();
    const [barangay = '', municipality = ''] = address.split(',').map(part => part.trim());

    const contactNum = document.querySelector('#settings-form #contact-input').value.trim();
    const email = document.querySelector('#settings-form #email-input').value.trim();


    // settings form date
    const settingsFormData = {firstName, middleName, lastName, contactNum, barangay, municipality, email};

    console.log(settingsFormData)
    try{
      const response = await axios.put(`http://localhost:2500/edit/${userId}`, settingsFormData, {withCredentials: true});

      if(response.status === 200){
        popupAlert('success', 'Success!', 'Successfully update the setting').then(() => window.location.reload())
      }

    } catch (err) {
      console.log(err)
      const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
    }
  });
};

export default handleEditSettings;
