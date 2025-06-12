import updateSidenav from "../utils/updateSidenav.js"; // Import the updateSidenav utility function from the utils folder


// ======================================
// ========== View Appointments Schedule Calendar
// ======================================
const viewAppointmentSchedule = () => {
  const appointmentTableContent = document.querySelector('.appointment-table-content');
  const appointmentSchedContent = document.querySelector('.appointment-schedule-content');
  const appointmentsSection = document.getElementById('appointments-section');
  const techniciansSection = document.getElementById('technicians-section');

  const viewSchedBtn = document.querySelector('.technicians-section__view-sched-btn')
    .addEventListener('click', () => {
      techniciansSection.classList.add('hide');
      techniciansSection.classList.remove('show');

      appointmentsSection.classList.add('show');
      appointmentsSection.classList.remove('hide');

      appointmentTableContent.style.display = 'none';
      appointmentSchedContent.style.display = 'block';

      updateSidenav();
  });
}


// ======================================
// ========== Main Function - Setup Technicians Section
// ======================================
export default function setupTechniciansSection() {
  viewAppointmentSchedule();
}