import handleClientLogout from "./logout-client.js";
import fetchClient from "./fetch-client.js";
import handleSendVerificationImage from "./upload-verification-permit.js";

import api from '../../client-utils/axios-config.js';

// ======================================
// ========== Handle unregister okay button
// ======================================
const handleLogoutBtn = () => {
  const logoutBtn = document.querySelector('#not-verified-user-btn');
  if (!logoutBtn) {
    console.log('Client logout button not exist!');
    return;
  }
  logoutBtn.addEventListener('click', async() => {

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Back to Login Page?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Back',
      cancelButtonText: 'No, stay',
    });

    if (result.isConfirmed) {
      try {
        const response = await api.post('/logout', {});

        if (response.status === 200) {
          localStorage.removeItem('accessToken');

          await Swal.fire({
            icon: 'success',
            title: 'Login Page Return',
            text: 'Back to Login Page Successfully.',
            confirmButtonText: 'OK'
          });

          window.location.href = 'auth.html';
        }

      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: err.response?.data?.message || err.message,
        });
      }
    }

  });
}

const populateMessage = async() => {
    const clientNameTag = document.querySelector('#client-name');

    const client = await fetchClient();

    clientNameTag.textContent = client?.firstName || 'user';
}

populateMessage();
handleLogoutBtn();
handleSendVerificationImage();