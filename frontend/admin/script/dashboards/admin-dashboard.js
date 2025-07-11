import fetchUsers from "../../api/fetch-users.js";
import {fetchAppointments} from "../../api/fetch-appointments.js";
import fetchInventory from "../../api/fetch-inventory.js";
import fetchSwines from "../../api/fetch-swines.js";

const adminDashboard = async () => {
  try {
    const totalUsers = await fetchUsers();
    const totalAppointments = await fetchAppointments();
    const totalInventory = await fetchInventory();
    const totalSwines = await fetchSwines();

    let dashboardHTML = `
      <div class="dashboard__card total-users total-card">
        <img class="dashboard__card-icon" src="images-and-icons/icons/user-icon.png" alt="user-icon" >
        <p class="dashboard__card-label">
          Total Users: 
          <span class="dashboard__card-label--value">${totalUsers.length}</span>
        </p>
      </div>
      <div class="dashboard__card total-appointments total-card">
        <img class="dashboard__card-icon" src="images-and-icons/icons/appointment-icon.png" alt="calendar-icon" >
        <p class="dashboard__card-label">
          Total Appointments: 
          <span class="dashboard__card-label--value">${totalAppointments.length}</span>
        </p>
      </div>
      <div class="dashboard__card total-inventory total-card">
        <img class="dashboard__card-icon" src="images-and-icons/icons/inventory-icon.png" alt="inventory-icon" >
        <p class="dashboard__card-label">
          Total Inventory: 
          <span class="dashboard__card-label--value">${totalInventory.length}</span>
        </p>
      </div>
      <div class="dashboard__card total-swines total-card">
        <img class="dashboard__card-icon" src="images-and-icons/icons/pig-icon.png" alt="pig-icon" >
        <p class="dashboard__card-label">
          Totalal Swines: 
          <span class="dashboard__card-label--value">${totalSwines.length}</span>
        </p>
      </div>
    `;

    const adminDashboard  =  document.querySelector('.admin-dashboard .dashboard__cards-container');

    if(adminDashboard) adminDashboard.innerHTML = dashboardHTML;

  } catch (error) {
    console.error("Error loading admin dashboard data:", error);
  }
};

export default adminDashboard;
