import popupAlert from '../../utils/popupAlert.js'

const handleRescheduleAppointment = async(appointmentId) => {
  try{
      const response = await axios.patch(`http://localhost:2500/appointment/reschedule/${appointmentId}`, {}, {withCredentials: true});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Appointment reschedule successfully').then(() => window.location.reload());
      }
  
  } catch(err){
      const errMessage = err.response.data?.message || err.response.data?.error;
        popupAlert('error', 'Error!', errMessage);
  }
}


export default handleRescheduleAppointment;
