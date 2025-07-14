import fetchUser from "./fetchUser.js";

async function roleRidirectPage () {
  try {
    const admin = await fetchUser();
    const adminRole = admin.roles?.[0];
    const currentPath = window.location.pathname;

    if (adminRole === 'admin' && !currentPath.includes('admin-page.html')) location.replace('admin-page.html')

    else if (adminRole === 'appointmentCoordinator' && !currentPath.includes('appointments-coordinator.html')) location.replace('appointments-coordinator.html');

    else if (adminRole === 'inventoryCoordinator' && !currentPath.includes('inventory-coordinator.html')) location.replace('inventory-coordinator.html');

    else if (adminRole === 'technician' && !currentPath.includes('technician-page.html')) location.replace('technician-page.html')
    
  } catch (error) {
    console.log(error);
  }
}

export default roleRidirectPage;
