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
        popupAlert('success', 'Success', `New staff ${staffFullname} successully created`).
          then(() => {
            addStaffForm.reset();
            addStaffForm.classList.remove('show');
            handleRenderStaff();
        });    
      }

    } catch (error) {
      console.log(error)
    }
  });
}


export default handleAddStaff;