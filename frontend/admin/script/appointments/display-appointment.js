
import initAppointmentFiltering from '../../utils/filter-appointment-data.js';
import {fetchAppointments} from '../../api/fetch-appointments.js';
import {adminPageAppointmentTable, renderButtonsCount} from './../../utils/appointment-table.js'

async function handleRenderAppointments() {
  try {
    const data = await fetchAppointments();
    const adminAppointmentTableElement = document.querySelector('.admin-page__section-wrapper #appointments-section .appointment-table__tbody');

    if (adminAppointmentTableElement) {
      // Admin page: show all
      adminPageAppointmentTable(data, adminAppointmentTableElement);
    } else {
      // Staff page: show filtering + pending default
      await initAppointmentFiltering();
    }

    renderButtonsCount(data);

    document.dispatchEvent(new Event('renderAppointments'));
  } catch (err) {
    console.error('Error rendering appointments:', err);
    document.querySelector('#appointments-section .appointment-table__tbody').innerHTML = `
      <p class="error-message">Failed to load Appointments. Please refresh the page.</p>
    `;
  }
}

export default handleRenderAppointments;