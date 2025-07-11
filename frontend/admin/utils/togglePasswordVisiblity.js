function togglePasswordVisibility(eyeSlash, passwordInput) {
  eyeSlash.classList.toggle('active');

  if(eyeSlash.classList.contains('active')){
    passwordInput.setAttribute('type', 'text');
  }else{
    passwordInput.setAttribute('type', 'password');
  }
}


export default togglePasswordVisibility;