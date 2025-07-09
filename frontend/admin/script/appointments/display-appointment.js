import fetchAppointments from '../../api/fetch-appointments.js';
import {appointmentsTable, adminPageAppointmentTable} from './../../utils/appointment-table.js'

async function handleRenderAppointments() {
  try {
    const data = await fetchAppointments();

    const appointments = data.slice().reverse(); 
    const appointmentsTableElement = document.querySelector('#appointments-section .appointment-table__tbody');
    const adminAppointmentTableElement = document.querySelector('.admin-page__section-wrapper #appointments-section .appointment-table__tbody');

    if(appointmentsTableElement) await appointmentsTable(appointments, appointmentsTableElement);
    if(adminAppointmentTableElement) adminPageAppointmentTable(appointments, adminAppointmentTableElement);
  
    document.dispatchEvent(new Event('renderAppointments')); 

  } catch (err) {
    console.error('Error rendering technicians:', err);
     document.querySelector('#appointments-section .appointment-table__tbody').innerHTML = `
        <p class="error-message">Failed to load Appointments. Please refresh the page.</p>
     `;
  }
}

export default handleRenderAppointments;