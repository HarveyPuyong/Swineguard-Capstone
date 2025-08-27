import popupAlert from './../../utils/popupAlert.js';
import api from '../../utils/axiosConfig.js';
import handleRenderStaff from "./display-staff.js"


const handleAddStaff = () => {
  const addStaffForm = document.querySelector('#add-staff-form');

  addStaffForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const staffFormData = {
      firstName: addStaffForm['firstName'].value.trim(),
      middleName: addStaffForm['middleName'].value.trim(),
      lastName: addStaffForm['lastName'].value.trim(),
      suffix: addStaffForm['suffix'].value.trim(),
      sex: addStaffForm['gender'].value,
      role: addStaffForm['role'].value,
      municipality: addStaffForm['municipality'].value,
      barangay: addStaffForm['barangay'].value,
      contactNum: addStaffForm['phone'].value.trim(),
      email: addStaffForm['email'].value.trim(),
      password: addStaffForm['password'].value,
      confirmPassword: addStaffForm['confirmPassword'].value
    };

    const staffFullname = `${staffFormData.firstName} ${staffFormData.middleName} ${staffFormData.lastName}`

    try {
      const response = await api.post('/add/staff', staffFormData);
      
      if(response.status === 201) {
        popupAlert('success', 'Success', `New staff "${staffFullname}" successully created`).
          then(() => {
            addStaffForm.reset();
            addStaffForm.classList.remove('show');
            handleRenderStaff();
            const barangaySelect = document.querySelector("#add-staff-form #barangay");
            barangaySelect.innerHTML = '<option value="" hidden>Select barangay</option>';
            barangaySelect.disabled = true;
        });    
      }

    } catch (error) {
      if (error.response) {
        // Server responded with a status outside 2xx
        const status = error.response.status;
        const message = error.response.data.message;

        if (status === 409) {
          // Handle duplicate email or user exists
          popupAlert('error', 'Duplicate Entry', message);
        } else if (status === 400) {
          // Handle validation errors
          popupAlert('error', 'Validation Error', message);
        } else {
          // Other server errors
          popupAlert('error', 'Error', message || 'Something went wrong.');
        }
      } else if (error.request) {
        // No response from server
        popupAlert('error', 'Network Error', 'No response from server. Please try again.');
      } else {
        // Error in setting up the request
        popupAlert('error', 'Error', 'Request error occurred.');
      }
    }
  });
}


export default handleAddStaff;