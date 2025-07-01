import popupAlert from '../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';


// ======================================
// ==========Handle Complete Appointment
// ======================================
const handleCompleteAppointment = async(appointmentId) => {
  try{
      const response = await axios.patch(`http://localhost:2500/appointment/complete/${appointmentId}`, {}, {withCredentials: true});
  
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
      const response = await axios.patch(`http://localhost:2500/appointment/restore/${appointmentId}`, {}, {withCredentials: true});
  
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
      const response = await axios.delete(`http://localhost:2500/appointment/delete/${appointmentId}`, {}, {withCredentials: true});
  
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