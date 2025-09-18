import popupAlert from '../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';
import appointmentsDashboard from './../dashboards/appointment-dashboards.js';
import updatedItemQuantity from './../../utils/calculate-item-quantity.js';
import { fetchAppointments } from '../../api/fetch-appointments.js';


// ======================================
// ==========Handle Complete Appointment
// ======================================
let currentAppointmentId = null;
const completeTaskForm = document.querySelector('.complete-task-form');
const medicineSelectElement = document.querySelector('#completeTaskForm__set-medicine-list');

const handleCompleteAppointment = async(e) => {
  e.preventDefault(); // ✅ Prevent page reload

  const allAppointments = await fetchAppointments();
  const appointment = allAppointments.find(app => app._id === currentAppointmentId); // ✅ Fix here too!
  if (!appointment) {
    popupAlert('error', 'Error!', 'Appointment not found.');
    return;
  }

  const formData = {
    medicine: completeTaskForm.querySelector('#completeTaskForm__set-medicine-list').value,
    medicineAmount: completeTaskForm.querySelector('#completeTaskForm__set-medicine-amount').value
  }

  try {
    // Get the appointment details first to extract the medicine ID
    // const appointmentRes = await api.get(`/appointment/${appointmentId}`);
    // const appointment = appointmentRes.data;

    // const medicineId = appointment.medicine;

    // Complete the appointment
    const response = await api.patch(`/appointment/complete/${currentAppointmentId}`, formData);

    if (response.status === 200) {
      popupAlert('success', 'Success!', 'Appointment Completed successfully').then(() => {
        //updatedItemQuantity(medicineId, appointmentId);
        medicineSelectElement.innerHTML = '<option value="">Select medicine</option>';
        completeTaskForm.reset();
        handleRenderAppointments();
        appointmentsDashboard();
        completeTaskForm.classList.remove('show');
      });
    }
  } catch (err) {
      console.error("❌ Error completing appointment:", err); // log full error in console
      const errMessage = err.response?.data?.message 
                      || err.response?.data?.error 
                      || err.message 
                      || 'Unknown error';
      popupAlert('error', 'Error!', errMessage);
  }
}

const completeAppointmentRequest = (appointmentId) => {
  currentAppointmentId = appointmentId;
};

const setupCompleteAppointmentFormListener = () => {
  const completeTaskForm = document.querySelector('.complete-task-form');
  if (completeTaskForm) {
    completeTaskForm.addEventListener('submit', handleCompleteAppointment); 
  }
};


// ======================================
// ==========Handle Restore Appointment
// ======================================
const handleRestoreAppointment = async(appointmentId) => {
  try{
      const response = await api.patch(`/appointment/restore/${appointmentId}`, {});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Appointment restore successfully')
          .then(() => {
            handleRenderAppointments();
            appointmentsDashboard();
          });;
      }
  
  } catch(err){
      const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}


// ======================================
// ==========Handle Delete Appointment
// ======================================
const handleDeleteAppointment = async(appointmentId) => {
  try{
      const response = await api.delete(`/appointment/delete/${appointmentId}`, {});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Appointment Deleted successfully')
          .then(() => {
            handleRenderAppointments()
            appointmentsDashboard();
          });;
      }
  
  } catch(err){
      const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}



export {
          handleRestoreAppointment, 
          handleDeleteAppointment, 
          completeAppointmentRequest,
          setupCompleteAppointmentFormListener
        };