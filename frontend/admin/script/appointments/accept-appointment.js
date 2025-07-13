import popupAlert from './../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';
import appointmentsDashboard from './../dashboards/appointment-dashboards.js';
import { fetchAppointments } from '../../api/fetch-appointments.js';
import handleRenderTechnicians from '../technicians/display-technicians.js';


const handleAcceptAppointment = async (appointmentId) => {
  const acceptAppointmentForm = document.querySelector('.appointment-schedule-form');

  // Fetch the appointment data once
  const allAppointments = await fetchAppointments();
  const appointment = allAppointments.find(app => app._id === appointmentId);
  const getAppointmentType = appointment.appointmentType;

  if (!appointment) {
    popupAlert('error', 'Error!', 'Appointment not found.');
    return;
  }

  acceptAppointmentForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    // Auto-assign values based on type
    let appointmentMedicine, medicineDosage;
    if (getAppointmentType.toLowerCase() === 'visit') {

      appointmentMedicine = null;
      medicineDosage = 0;

    } else {
      appointmentMedicine = document.querySelector('.appointment-schedule-form #medicine-list').value.trim();
      medicineDosage = Number(document.querySelector('.appointment-schedule-form #medicine-amount').value.trim());
    }

    const appointmentData = {
      appointmentDate: document.querySelector('.appointment-schedule-form #set-date').value.trim(),
      appointmentTime: document.querySelector('.appointment-schedule-form #set-time').value.trim(),
      
      medicine: appointmentMedicine,
      dosage: medicineDosage,
      vetPersonnel: document.querySelector('.appointment-schedule-form #available-personnel').value.trim(),
      vetMessage: document.querySelector('.appointment-schedule-form #vet-message').value.trim(),
    };


    try{

      const response = await api.put(`/appointment/accept/${appointmentId}`, appointmentData);

      if(response.status === 200){
        popupAlert('success', 'Succes!', 'Appointment Accepted')
          .then(() => { 
            acceptAppointmentForm.reset();
            acceptAppointmentForm.classList.remove('show')
            handleRenderAppointments();
            handleRenderTechnicians();
            appointmentsDashboard();
          })
      }
      
    } catch(err) {
      console.log(err);
      const errMessage = err.response.data?.message || err.response.data?.error;
      popupAlert('error', 'Error!', errMessage);
    }
  });
}


export default handleAcceptAppointment;