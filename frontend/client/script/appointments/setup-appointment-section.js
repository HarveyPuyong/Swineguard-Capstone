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
// ========== Toggle Appointment More Details
// ======================================
const toggleAppointmentMoreDetails = () => {
  const appointmentsCard = document.querySelectorAll('.appointment-card');

  appointmentsCard.forEach(appointment => {
    const moreDetails = appointment.querySelector('.appointment-card__more-details-container');
    const toggleBtn = appointment.querySelector('.appointment-card__toggle-more-details-btn');

    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');

      if(toggleBtn.classList.contains('active')){
        toggleBtn.innerText = 'View Less';
        moreDetails.classList.add('show')
      } else {
        toggleBtn.innerText = 'View More';
        moreDetails.classList.remove('show')
      }

    });
  });
}


// ======================================
// ========== Main Function - Setup Appointment Section
// ======================================
export default function setupAppointmentSection() {
  toggleRequestAppointmentForm();
  toggleAppointmentMoreDetails();
}