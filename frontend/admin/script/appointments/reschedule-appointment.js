import popupAlert from '../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';
import appointmentsDashboard from '../dashboards/appointment-dashboards.js';


let currentAppointmentId = null;
const rescheduleAppointmentForm = document.querySelector('.appointment-reschedule-form');

const handleRescheduleAppointment = async(e) => {
  e.preventDefault(); // ✅ Prevent page reload
  try{

    const appointmentData = {
      appointmentDate: document.querySelector('.appointment-reschedule-form #reschedule-set-date').value.trim(),
      appointmentTime: document.querySelector('.appointment-reschedule-form #reschedule-set-time').value.trim(),
      vetPersonnel: document.querySelector('.appointment-reschedule-form #reschedule-available-personnel').value.trim()
    };

    const response = await api.put(`/appointment/reschedule/${currentAppointmentId}`, appointmentData);

    if(response.status === 200){


      popupAlert('success', 'Success!', 'Appointment reschedule successfully').
        then(() => {
          handleRenderAppointments();
          appointmentsDashboard();
          rescheduleAppointmentForm.reset();
          rescheduleAppointmentForm.classList.remove('show');
        });
    }
  
  } catch(err){
      const errMessage = err.response.data?.message || err.response.data?.error;
        popupAlert('error', 'Error!', errMessage);
  }
  
}

const rescheduleAppointmentRequest = (appointmentId) => {
  currentAppointmentId = appointmentId;
};

const setupReschedAppointmentFormListener = () => {
  const rescheduleAppointmentForm = document.querySelector('.appointment-reschedule-form');
  if (rescheduleAppointmentForm) {
    rescheduleAppointmentForm.addEventListener('submit', handleRescheduleAppointment); 
  }
};





export { setupReschedAppointmentFormListener, rescheduleAppointmentRequest};
