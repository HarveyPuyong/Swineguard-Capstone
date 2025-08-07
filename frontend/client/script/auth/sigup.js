import popupAlert from '../../../admin/utils/popupAlert.js';
import api from '../../client-utils/axios-config.js';

  //Forms
  const loginForm = document.querySelector('#login-form');
  const signupForm = document.querySelector('#signup-form');

const createAccount = async() => {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const clientData = {
        firstName: document.querySelector('#client-input-firstname').value, 
        middleName: document.querySelector('#client-input-middlename').value, 
        lastName: document.querySelector('#client-input-lastname').value, 
        suffix: document.querySelector('#select-suffix-name').value,
        sex: document.querySelector('input[name="gender"]:checked')?.value, 
        birthday: document.querySelector('#client-input-birthday').value, 
        municipality: document.querySelector('#select-municipality').value, 
        barangay: document.querySelector('#select-barangay').value, 
        contactNum: document.querySelector('#client-contact-number').value.trim(),
        email: document.querySelector('#client-input-email').value.trim(), 
        password: document.querySelector('#client-input-password').value, 
        confirmPassword: document.querySelector('#client-input-confirm-password').value
      };

      console.log(clientData);
      const response = await api.post('/auth/client-signup', clientData);
      popupAlert('success', 'Success', `Your account is successully created, please wait for the admin to verify your account.`);  
              
      document.querySelector('#signup-form').classList.remove('show');
      document.querySelector('#signup-form').classList.add('hide');
      document.querySelector('#signup-form').reset();
      loginForm.classList.remove('hide');
      loginForm.classList.add('show');
      
    } catch (error) {
        console.log(error);
        if (error.response && error.response.data && error.response.data.message) {
          popupAlert('error', 'Error', error.response.data.message);
        } else {
          popupAlert('error', 'Error', 'An unexpected error occurred. Please try again.');
        }
    }
  });
}


export default createAccount;