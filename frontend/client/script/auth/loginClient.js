import api from '../../client-utils/axios-config.js';
import popupAlert from '../../client-utils/client-popupAlert.js';
import fetchClient from './fetch-client.js';
import { authMain } from '../auth.js';

// ======================================
// ✅ Redirect If Already Logged In
// ======================================
(async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return; // 🛑 No token — skip fetch

  try {
    const user = await fetchClient();
    if (!user) throw new Error("No user data returned");

    if (!user.isRegistered) {
      location.replace('/client/unverified-user.html');
    } else {
      location.replace('client-homepage.html');
    }
  } catch (err) {
    console.warn('Auto-login failed or unauthorized:', err.message);
    localStorage.removeItem('accessToken'); // remove invalid token
  }
})();

// ======================================
// ✅ Login Functionality
// ======================================
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('input-username')?.value.trim();
  const password = document.getElementById('login-input-password')?.value.trim();

  if (!email || !password) {
    popupAlert('warning', 'Warning!', 'All inputs are required!');
    return;
  }

  try {
    const response = await api.post('/auth/client-login', { email, password });

    if (response.status === 200) {
      const { accessToken, isRegistered } = response.data;
      localStorage.setItem('accessToken', accessToken);

      if (isRegistered) {
        popupAlert('success', 'Success!', 'Login successfully');
        setTimeout(() => {
          location.replace('client-homepage.html');
        }, 1000);
      } else {
        console.log(isRegistered);
        await popupAlert('info', 'Verification Required', 'Your account is under verification.');
        location.replace('/client/unverified-user.html');
      }
    }
  } catch (err) {
    console.error(err);
    const status = err?.response?.status;
    const errorMsg = err?.response?.data?.message || 'Login failed';

    if (status === 403 && errorMsg === 'Account not verified') {
      await popupAlert('info', 'Verification Required', 'Your account is under verification.');
      location.replace('/client/unverified-user.html');
    } else {
      popupAlert('error', 'Login Failed', errorMsg);
    }
  }
});

authMain();
