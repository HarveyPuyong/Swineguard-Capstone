import { updateSideNav } from "./sidenav.js";

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

      updateSideNav();
  });
}


export default function handleTechnicianFunctionality() {
  viewAppointmentSchedule();
}