import popupAlert from '../../utils/popupAlert.js'

const handleRemoveAppointment = async(appointmentId) => {
  try{
    const response = await axios.patch(`http://localhost:2500/appointment/remove/${appointmentId}`, {}, {withCredentials: true});

    if(response.status === 200){
      popupAlert('success', 'Success!', 'Appointment removed successfully').then(() => window.location.reload());
      console.log('removed')
    }

  } catch(err){
    const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}


export default handleRemoveAppointment;