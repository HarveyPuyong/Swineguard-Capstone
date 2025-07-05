import updateSidenav from "../../utils/updateSidenav.js";
import handleAppointmentCalendarContent from "../appointments/appointment-calendar.js"


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

      appointmentTableContent.classList.remove('show');
      appointmentSchedContent.classList.add('show');
      updateSidenav();
      handleAppointmentCalendarContent();
  });
}


// ======================================
// ========== Main Function - Setup Technicians Section
// ======================================
export default function setupTechniciansSection() {
  viewAppointmentSchedule();
}