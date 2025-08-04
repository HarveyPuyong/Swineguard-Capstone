import popupAlert from '../../../admin/utils/popupAlert.js';
import api from '../../client-utils/axios-config.js';

  //Forms
  const loginForm = document.querySelector('#login-form');
  const otpFields = document.querySelector('#signup-form-otp');

const createAccount = async(clientData) => {
  try {
    const response = await api.post('/auth/client-signup', clientData);
    popupAlert('success', 'Success', `Your account is successully created, please wait for the admin to verify your account.`);  
            
    otpFields.classList.remove('show');
    otpFields.classList.add('hide');
    loginForm.classList.add('show');
    
  } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        popupAlert('error', 'Error', error.response.data.message);
      } else {
        popupAlert('error', 'Error', 'An unexpected error occurred. Please try again.');
      }
  }
}


export default createAccount;