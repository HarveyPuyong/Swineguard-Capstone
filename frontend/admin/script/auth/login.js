const loginForm = document.querySelector('#admin-login-form');
import api from '../../utils/axiosConfig.js';

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

      if(response.data.roles.includes('admin')) window.location.href = 'admin-page.html';
      if(response.data.roles.includes('appointmentCoordinator')) window.location.href = 'appointments-coordinator.html'
      if(response.data.roles.includes('inventoryCoordinator')) window.location.href = 'inventory-coordinator.html'
    }

  }catch(err){
    console.log(err);
    alert(err.response.data.message);
  }
});


// ======================================
// ========== Toggle Password Visibility
// ======================================
const passwordInput = document.getElementById('password-input');
const togglePassword = document.querySelector('.toggle-password-eye');

togglePassword.addEventListener('click', () => {
  const eyeSlash = document.querySelector('.eye-slash');
  eyeSlash.classList.toggle('active');
  
  if(eyeSlash.classList.contains('active')){
    passwordInput.setAttribute('type', 'text');
  }else{
    passwordInput.setAttribute('type', 'password');
  }
});