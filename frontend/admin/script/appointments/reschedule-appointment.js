import popupAlert from '../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';

const handleRescheduleAppointment = async(appointmentId) => {
  try{
      const response = await api.patch(`/appointment/reschedule/${appointmentId}`, {});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Appointment reschedule successfully').
          then(() => handleRenderAppointments());
      }
  
  } catch(err){
      const errMessage = err.response.data?.message || err.response.data?.error;
        popupAlert('error', 'Error!', errMessage);
  }
}


export default handleRescheduleAppointment;
