import appointmentsDashboard from './appointment-dashboards.js';
import displayOngoingAppointments from './displayOngoingAppointments.js'


// ======================================
// ========== Main Function - Setup Dashboard Section
// ======================================
export default function setupDashboardSection () {
  appointmentsDashboard();
  displayOngoingAppointments();
}