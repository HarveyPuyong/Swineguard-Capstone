import popupAlert from '../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';
import appointmentsDashboard from '../dashboards/appointment-dashboards.js';

const handleRemoveAppointment = async(appointmentId) => {
  try{
    const response = await api.patch(`/appointment/remove/${appointmentId}`, {});

    if(response.status === 200){
      popupAlert('success', 'Success!', 'Appointment removed successfully')
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


export default handleRemoveAppointment;