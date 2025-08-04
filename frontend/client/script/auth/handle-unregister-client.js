import handleClientLogout from "./logout-client.js";
import fetchClient from "./fetch-client.js";

// ======================================
// ========== Handle unregister okay button
// ======================================
const handleLogoutBtn = () => {
  const logoutBtn = document.querySelector('#not-verified-user-btn');
  if (!logoutBtn) {
    console.log('Client logput button not exist!');
    return;
  }
  logoutBtn.addEventListener('click', handleClientLogout);
}

const populateMessage = async() => {
    const clientNameTag = document.querySelector('#client-name');

    const client = await fetchClient();

    clientNameTag.textContent = client?.firstName || 'user';
}

populateMessage();
handleLogoutBtn();