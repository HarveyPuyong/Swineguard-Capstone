import appointmentsDashboard from './appointment-dashboards.js';
import inventoryDashboard from './inventory-dashboard.js';
import displayAcceptedAppointments from './display-accepted-appointments.js';
import displayLessStockInventory from './display-less-stock-inventory.js';


// ======================================
// ========== Main Function - Setup Dashboard Section
// ======================================
export default function setupDashboardSection () {
  appointmentsDashboard();
  inventoryDashboard();
  displayAcceptedAppointments();
  displayLessStockInventory();
}