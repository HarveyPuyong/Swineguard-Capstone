import popupAlert from '../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';
import appointmentsDashboard from './../dashboards/appointment-dashboards.js';
import updatedItemQuantity from '../../utils/deduct-item-stock.js';
import { fetchAppointments } from '../../api/fetch-appointments.js';
import displayTaskList from '../veterinarian/display-appoinment-task.js';


// ======================================
// ==========Handle Complete Appointment
// ======================================
let currentAppointmentId = null;
const completeTaskForm = document.querySelector('.complete-task-form');
const medicineSelectElement = document.querySelector('#completeTaskForm__set-medicine-list');
const checkBoxContainer = document.querySelector(".check-box__swine-Ids"); // CheckBoxes of swine Ids

const handleCompleteAppointment = async(e) => {
  e.preventDefault(); // ✅ Prevent page reload

  const allAppointments = await fetchAppointments();
  const appointment = allAppointments.find(app => app._id === currentAppointmentId);
  
  if (!appointment) {
    popupAlert('error', 'Error!', 'Appointment not found.');
    return;
  }

  // Get selected swines
  const selectedSwines = Array.from( checkBoxContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

  const formData = {
    medicine: completeTaskForm.querySelector('#completeTaskForm__set-medicine-list').value,
    medicineAmount: completeTaskForm.querySelector('#completeTaskForm__set-medicine-amount').value,
    healthStatus: completeTaskForm.querySelector('#completeTaskForm__select-swine-health-status').value || 'none',
    causeOfDeath: completeTaskForm.querySelector('#completeTaskForm__cause-of-death').value || 'none',
    numberOfDeaths: completeTaskForm.querySelector('#completeTaskForm__num-of-death').value || 0
  }

  const itemId = completeTaskForm.querySelector('#completeTaskForm__set-medicine-var').value;

  try {
    // Complete the appointment
    const response = await api.patch(`/appointment/complete/${currentAppointmentId}`, formData);

    if (response.status === 200) {
      // Update Swine When Appointment is completed
      if (selectedSwines > 0) {
        await api.patch(`/swine/update/is-under/monitoring`, {
          swineIds: selectedSwines,
          status: formData.healthStatus,
          cause: formData.causeOfDeath
        });  
      }

      //console.log(selectedSwines);
    
      popupAlert('success', 'Success!', 'Appointment Completed successfully').then(() => {

        updatedItemQuantity(itemId, formData.medicineAmount); // Subtract to the database

        medicineSelectElement.innerHTML = '<option value="">Select medicine</option>';
        completeTaskForm.reset();
        handleRenderAppointments();
        appointmentsDashboard();
        displayTaskList();
        completeTaskForm.classList.remove('show');

      });
    }
  } catch (err) {
      console.error("❌ Error completing appointment:", err); // log full error in console
      const errMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||                 
        "Something went wrong. Please try again."
      ;

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
          });
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