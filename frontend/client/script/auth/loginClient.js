import api from '../../../admin/utils/axiosConfig.js';
import popupAlert from '../../../admin/utils/popupAlert.js';
import fetchClient from './fetch-client.js';
import { authMain } from '../auth.js';

// ======================================
// ✅ Redirect If Already Logged In
// ======================================
// (async () => {
//   const accessToken = localStorage.getItem('accessToken');
//   if (accessToken) {
//     try {
//       const user = await fetchClient();
//       if (!user) throw new Error("No user data returned");

//       const userRole = user.roles?.[0];
//       if (userRole === 'user') {
//         location.replace('client-homepage.html'); // client dashboard
//       } else {
//         location.replace('auth.html'); // fallback/unauthorized
//       }
//     } catch (err) {
//       console.warn('Auto-login failed or unauthorized:', err.message);
//       localStorage.removeItem('accessToken'); // clear invalid token
//     }
//   }
// })();

// ======================================
// ✅ Redirect If Already Logged In
// ======================================
(async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return; // 🛑 do NOT call fetchClient — just skip

  try {
    const user = await fetchClient();
    if (!user) throw new Error("No user data returned");

    const userRole = user.roles?.[0];
    if (userRole === 'user') {
      location.replace('client-homepage.html');
    } else {
      location.replace('auth.html');
    }
  } catch (err) {
    console.warn('Auto-login failed or unauthorized:', err.message);
    localStorage.removeItem('accessToken'); // clear invalid token
  }
})();




// ======================================
// ✅ Login Functionality
// ======================================
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('input-username').value.trim();
  const password = document.getElementById('login-input-password').value.trim();

  if (!email || !password) {
    popupAlert('warning', 'Warning!', 'All inputs are required!');
    return;
  }

  try {
    const response = await api.post('/auth/client-login', { email, password });

    if (response.status === 200) {
      const roles = response.data.roles;
      localStorage.setItem('accessToken', response.data.accessToken);

      if (roles.includes('user')) {
        popupAlert('success', 'Success!', 'Login successfully');
        setTimeout(() => {
          location.replace('client-homepage.html');
        }, 800);
      } else {
        popupAlert('warning', 'Warning!', "You are not authorized to access this area.");
      }
    }
  } catch (err) {
    console.error(err);
    popupAlert('error', 'Login Failed', err?.response?.data?.message || 'Login failed');
  }
});

authMain();
