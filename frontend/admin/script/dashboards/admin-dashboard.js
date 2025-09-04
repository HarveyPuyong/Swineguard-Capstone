import fetchUsers from "../../api/fetch-users.js";
import {fetchAppointments} from "../../api/fetch-appointments.js";
import fetchInventory from "../../api/fetch-inventory.js";
import fetchSwines from "../../api/fetch-swines.js";
import fetchSwinePopulation from "../../api/fetch-swine-population.js";

const adminDashboard = async () => {
  try {
    const totalUsers = await fetchUsers();
    const totalAppointments = await fetchAppointments();
    const totalInventory = await fetchInventory();
    const swines = await fetchSwines();
    const populations = await fetchSwinePopulation();

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const monthlySwineFromManualInput = populations.filter(x => x.month === currentMonth && x.year === currentYear)

    let totalSwineCount = 0;

    monthlySwineFromManualInput.forEach((record) => {
      totalSwineCount += record.barangays.reduce((total, barangay) => {
        const nativeCount =
          barangay.native.boar +
          barangay.native.gilt_sow +
          barangay.native.grower +
          barangay.native.piglet;

        const crossCount =
          barangay.crossBreed.boar +
          barangay.crossBreed.gilt_sow +
          barangay.crossBreed.grower +
          barangay.crossBreed.piglet;

        return total + nativeCount + crossCount;
      }, 0);
    });

    //console.log(totalSwineCount)
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
          Total Swines: 
          <span class="dashboard__card-label--value">${totalSwines.length + totalSwineCount}</span>
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
