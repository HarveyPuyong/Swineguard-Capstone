import { fetchAppointments } from '../api/fetch-appointments.js';
import { appointmentsTable } from './appointment-table.js';

async function initAppointmentFiltering() {
  const table = document.querySelector('#appointments-section .appointment-table__tbody');
  const buttons = document.querySelectorAll('.appointment-filter__btn button');

  if (!table || buttons.length === 0) return;

  // Fetch all appointments once
  const appointments = await fetchAppointments();

  // Default view: show pending
  await renderFilteredAppointments(appointments, table, 'pending');

  // Button click behavior
  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      // Update button UI
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      let filterType = '';
      if (btn.classList.contains('pending-btn')) filterType = 'pending';
      else if (btn.classList.contains('accepted-btn')) filterType = 'accepted';
      else if (btn.classList.contains('rescheduled-btn')) filterType = 'reschedule';
      else if (btn.classList.contains('completed-btn')) filterType = 'completed';

      await renderFilteredAppointments(appointments, table, filterType);
    });
  });
}

async function renderFilteredAppointments(appointments, table, filterType) {
  // 🧠 Filter by appointmentStatus
  const filtered = filterType
    ? appointments.filter(a => a.appointmentStatus.toLowerCase() === filterType.toLowerCase())
    : appointments;

  // 🧩 Render filtered list
  await appointmentsTable(filtered, table);
}

export default initAppointmentFiltering;
