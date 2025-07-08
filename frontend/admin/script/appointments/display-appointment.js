import fetchAppointments from '../../api/fetch-appointments.js';
import {appointmentsTable, adminPageAppointmentTable} from './../../utils/appointment-table.js'

const handleRenderAppointments = async() => {
  try {
    const data = await fetchAppointments();

    const appointments = data.slice().reverse(); 
    const appointmentsTableElement = document.querySelector('#appointments-section .appointment-table__tbody');
    const adminAppointmentTableElement = document.querySelector('.admin-page__section-wrapper #appointments-section .appointment-table__tbody');

    appointmentsTable(appointments, appointmentsTableElement);
    adminPageAppointmentTable(appointments, adminAppointmentTableElement);


  } catch (err) {
    console.error('Error rendering technicians:', err);
     document.querySelector('#appointments-section .appointment-table__tbody').innerHTML = `
        <p class="error-message">Failed to load Appointments. Please refresh the page.</p>
     `;
  }
}

export default handleRenderAppointments;