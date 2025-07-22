// ======================================
// ========== Toggle Request Appointment Form
// ======================================
const toggleRequestAppointmentForm = () => {
  const form = document.querySelector('#request-appointment-form');

  const showFormBtn = document.querySelector('.request-appointment-btn').
    addEventListener('click', () => form.classList.add('show'));
  
  const closeFormBtn = document.querySelector('.request-appointment-form__back-btn').
    addEventListener('click', () => form.classList.remove('show'))
}




// ======================================
// ========== Main Function - Setup Appointment Section
// ======================================
export default function setupAppointmentSection() {
  toggleRequestAppointmentForm();
}