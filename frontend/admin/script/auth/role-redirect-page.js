import fetchUser from "./fetchUser.js";

async function roleRidirectPage () {
  try {
    const admin = await fetchUser();
    const adminRole = admin.roles?.[0];
    const currentPath = window.location.pathname;

    if (adminRole === 'admin' && !currentPath.includes('admin-page.html')) window.location = 'admin-page.html'

    else if (adminRole === 'appointmentCoordinator' && !currentPath.includes('appointments-coordinator.html')) window.location = 'appointments-coordinator.html'

    else if (adminRole === 'inventoryCoordinator' && !currentPath.includes('inventory-coordinator.html')) window.location = 'inventory-coordinator.html';
    
  } catch (error) {
    console.log(error);
  }
}

export default roleRidirectPage;
