import popupAlert from './../../utils/popupAlert.js';
import handleRenderAppointments from './display-appointment.js';
import api from '../../utils/axiosConfig.js';
import appointmentsDashboard from './../dashboards/appointment-dashboards.js';
import { fetchAppointments } from '../../api/fetch-appointments.js';
import handleRenderTechnicians from '../technicians/display-technicians.js';

let currentAppointmentId = null;
const acceptAppointmentForm = document.querySelector('.appointment-schedule-form');
const personnelSelectElement = document.querySelector('#available-personnel');


const handleAcceptAppointment = async (e) => {
  e.preventDefault(); // ✅ Prevent page reload

  const allAppointments = await fetchAppointments();
  const appointment = allAppointments.find(app => app._id === currentAppointmentId); // ✅ Fix here too!
  if (!appointment) {
    popupAlert('error', 'Error!', 'Appointment not found.');
    return;
  }

  const getAppointmentType = appointment.appointmentType;

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

  try {
    const response = await api.put(`/appointment/accept/${currentAppointmentId}`, appointmentData);
    if (response.status === 200) {
      popupAlert('success', 'Success!', 'Appointment Accepted')
        .then(() => {
          acceptAppointmentForm.reset();
          personnelSelectElement.innerHTML = '<option value="">Personnel</option>';
          acceptAppointmentForm.classList.remove('show');
          handleRenderAppointments();
          handleRenderTechnicians();
          appointmentsDashboard();
        });
    }
  } catch (err) {
    console.log(err);
    const errMessage = err.response?.data?.message || err.response?.data?.error;
    popupAlert('error', 'Error!', errMessage);
  }
};


const acceptAppointmentRequest = (appointmentId) => {
  currentAppointmentId = appointmentId;
};

const setupAppointmentFormListener = () => {
  const acceptAppointmentForm = document.querySelector('.appointment-schedule-form');
  if (acceptAppointmentForm) {
    acceptAppointmentForm.addEventListener('submit', handleAcceptAppointment); 
  }
};


export {
  setupAppointmentFormListener,
  acceptAppointmentRequest
};