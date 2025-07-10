import popupAlert from './../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from './../../utils/axiosConfig.js'
import appointmentsDashboard from './../dashboards/appointment-dashboards.js';


const handleAddAppointment = () => {
  // Sanitize all inputs text type
  const inputs = document.querySelectorAll('#add-appointments-form input[type="text"]:not(#client-email):not(#appointment-date):not(#appointment-time)');
  
  inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
      });
  });


  const addAppointmentForm = document.querySelector('#add-appointments-form');

  if(!addAppointmentForm) return
  
  addAppointmentForm.addEventListener('submit', async(e) => {
      e.preventDefault();

      const appointmentFormData = {
        clientFirstname: addAppointmentForm['firstName'].value.trim(),
        clientLastname: addAppointmentForm['lastName'].value.trim(),
        clientEmail: addAppointmentForm['clientEmail'].value.trim(),
        contactNum: addAppointmentForm['clientPhone'].value.trim(),
        municipality: addAppointmentForm['municipality'].value,
        barangay: addAppointmentForm['barangay'].value,
        appointmentTitle: addAppointmentForm['appointmentTitle'].value,
        appointmentType: addAppointmentForm['appointmentType'].value,
        appointmentDate: addAppointmentForm['appointmentDate'].value,
        appointmentTime: addAppointmentForm['appointmentTime'].value,
        swineType: addAppointmentForm['swineType'].value,
        swineAge: Number(addAppointmentForm['swineAge'].value),
        swineCount: Number(addAppointmentForm['swineCount'].value),
        swineFemale: Number(addAppointmentForm['swineFemale'].value),
        swineMale: Number(addAppointmentForm['swineMale'].value),
        swineSymptoms: addAppointmentForm['swineSymptoms'].value.trim(),
        appointmentStatus: 'ongoing'
      };


    try {
      const response = await api.post('/appointment/add', appointmentFormData);

      if(response.status === 201){
        popupAlert('success', 'Success!', 'New appointment has been created successfully').
          then(() => {
            addAppointmentForm.reset();
            addAppointmentForm.parentNode.classList.remove('show');
            handleRenderAppointments();
            appointmentsDashboard();
          });
      }

    } catch (error) {
      console.log(error);
      const errMessage = error.response.data?.message || error.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
    }
  })
}


export default handleAddAppointment;