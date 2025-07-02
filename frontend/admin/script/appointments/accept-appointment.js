import popupAlert from './../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';


const handleAcceptAppointment = (appointmentId) => {
  const acceptAppointmentForm = document.querySelector('.appointment-schedule-form');

  acceptAppointmentForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const appointmentData = {
      appointmentDate: document.querySelector('.appointment-schedule-form #set-date').value.trim(),
      appointmentTime: document.querySelector('.appointment-schedule-form #set-time').value.trim(),
      appointmentType: document.querySelector('.appointment-schedule-form #appointment-type').value.trim(),
      medicine: document.querySelector('.appointment-schedule-form #medicine-list').value.trim(),
      dosage: Number(document.querySelector('.appointment-schedule-form #medicine-amount').value.trim()),
      vetPersonnel: document.querySelector('.appointment-schedule-form #available-personnel').value.trim(),
      vetMessage: document.querySelector('.appointment-schedule-form #vet-message').value.trim(),
    };


    try{
      const response = await api.put(`/appointment/accept/${appointmentId}`, appointmentData);

      if(response.status === 200){
        popupAlert('success', 'Succes!', 'Appointment Accepted')
          .then(() => { 
            acceptAppointmentForm.reset();
            acceptAppointmentForm.classList.remove('show')
            handleRenderAppointments();
          })
      }
      
    } catch(err) {
      console.log(err);
      const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
    }
  });
}


export default handleAcceptAppointment;