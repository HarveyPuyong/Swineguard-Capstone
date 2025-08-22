import { fetchServices } from "../../../admin/api/fetch-services.js";
import addressesData from "../../../admin/static-data/addresses.js";
import fetchClient from "../auth/fetch-client.js";
import displaySwineList from "./display-client-swine-list.js";
import sendRequestAppointment from "./request-appointment.js";
import displayAppointmentCardList from "./display-appointment-list.js";

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
// ========== Setup Reqest Appointments Form
// ======================================
const setupRequestAppointmentForm = async () => {
  const selectAllSwinesCheckbox = document.querySelector('#request-appointment-form #select-all-swines');

  selectAllSwinesCheckbox?.addEventListener('change', () => {
    const swineCheckboxes = document.querySelectorAll('input[name="swines"]');
    swineCheckboxes.forEach(checkbox => {
      checkbox.checked = selectAllSwinesCheckbox.checked;
    });
  });

  const serviceSelect = document.querySelector("#select-appointment-service");

  // Populate Service Options
  const services = await fetchServices();
  if (serviceSelect) {
    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service._id;
      option.textContent = service.serviceName;
      serviceSelect.appendChild(option);
    });
  }

};



// ======================================
// ========== Toggle Request Appointment Form
// ======================================
const toggleRequestAppointmentForm = async() => {
  const form = document.querySelector('#request-appointment-form');

  const showFormBtn = document.querySelector('.request-appointment-btn').
    addEventListener('click', () => form.classList.add('show'));

  const closeFormBtn = document.querySelector('.request-appointment-form__back-btn').
    addEventListener('click', () => form.classList.remove('show'))
}



// ======================================
// ✅ Event listener for dynamic content
// ======================================
document.addEventListener('renderClientAppointmentList', () => {
  toggleAppointmentMoreDetails(); 
});



// ======================================
// ========== Main Function - Setup Appointment Section
// ======================================
export default function setupAppointmentSection() {
  displayAppointmentCardList();
  toggleRequestAppointmentForm();
  setupRequestAppointmentForm();
  displaySwineList();
  sendRequestAppointment();
}