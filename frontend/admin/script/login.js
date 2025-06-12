
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