import popupAlert from '../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';


// ======================================
// ==========Handle Complete Appointment
// ======================================
const handleCompleteAppointment = async(appointmentId) => {
  try{
      const response = await api.patch(`/appointment/complete/${appointmentId}`, {});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Appointment Completed successfully').
          then(() => handleRenderAppointments());
      }
  
  } catch(err){
      const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}


// ======================================
// ==========Handle Restore Appointment
// ======================================
const handleRestoreAppointment = async(appointmentId) => {
  try{
      const response = await api.patch(`/appointment/restore/${appointmentId}`, {});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Appointment restore successfully')
          .then(() => handleRenderAppointments()());;
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
          .then(() => handleRenderAppointments()());;
      }
  
  } catch(err){
      const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}



export {handleRestoreAppointment, handleDeleteAppointment, handleCompleteAppointment};