import popupAlert from './../../utils/popupAlert.js'


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
      const response = await axios.put(`http://localhost:2500/appointment/accept/${appointmentId}`, appointmentData, {withCredentials: true});

      if(response.status === 200){
        popupAlert('success', 'Succes!', 'Appointment Accepted').then(() => window.location.reload())
      }
      
    } catch(err) {
      console.log(err);
      const errMessage = err.response.data?.message;
      popupAlert('error', 'Error!', errMessage);
    }
  });
}


export default handleAcceptAppointment;