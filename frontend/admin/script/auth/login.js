import togglePasswordVisibility from '../../utils/togglePasswordVisiblity.js';
import api from '../../utils/axiosConfig.js';
import fetchUser from './fetchUser.js';

// ======================================
// ========== Ridirect To Assign Role If Have Access Token
// ======================================
const accessToken = localStorage.getItem('accessToken');

if(accessToken) {
  const admin = await fetchUser();
  const adminRole = admin.roles?.[0];

  if(adminRole === 'admin') location.replace('admin-page.html')
  else if(adminRole === 'appointmentCoordinator') location.replace('appointments-coordinator.html');
  else if(adminRole === 'inventoryCoordinator') location.replace('inventory-coordinator.html');
  else if(adminRole === 'technician') location.replace('technician-page.html');
  else if(adminRole === 'veterinarian') location.replace('veterenarian-page.html');
}


// ======================================
// ========== Login Functionality
// ======================================
const loginForm = document.querySelector('#admin-login-form');
loginForm.addEventListener('submit', async(e) => {
  e.preventDefault();
  const password = document.getElementById('password-input').value.trim();
  const email = document.getElementById('email-input').value.trim();

  if(!password || !email) alert('All inputs are required');

  try{
    const response = await api.post('/auth/admin-login', {email, password}
    );

    if(response.status === 200){
      localStorage.setItem('accessToken', response.data.accessToken);

      if(response.data.roles.includes('admin')) location.replace('admin-page.html')
      else if(response.data.roles.includes('appointmentCoordinator')) location.replace('appointments-coordinator.html');
      else if(response.data.roles.includes('inventoryCoordinator')) location.replace('inventory-coordinator.html')
      else if(response.data.roles.includes('technician')) location.replace('technician-page.html');
      else if(response.data.roles.includes('veterinarian')) location.replace('veterenarian-page.html');
    }

  }catch(err){
    console.log(err);
    alert(err.response.data.message);
  }
});


// ======================================
// ========== Toggle Password Visibility
// ======================================
const passwordInput = document.querySelector('#admin-login-form #password-input');
const togglePasswordEye = document.querySelector('#admin-login-form .toggle-password-eye');
const eyeSlash = document.querySelector('#admin-login-form .eye-slash');

togglePasswordEye.addEventListener('click', () => togglePasswordVisibility(eyeSlash, passwordInput));




