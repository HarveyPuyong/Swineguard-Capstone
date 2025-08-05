import { fetchServices } from "../../../admin/api/fetch-services.js";
import addressesData from "../../../admin/static-data/addresses.js";
import fetchClient from "../auth/fetch-client.js";
import displaySwineList from "./display-client-swine-list.js";
import { checkAppointmentDate, checkTime } from "../../client-utils/checkDates.js";

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

  const municipalitySelect = document.querySelector("#select-municipal");
  const barangaySelect = document.querySelector("#select-barangay");
  const serviceSelect = document.querySelector("#select-appointment-service");

  if (!municipalitySelect || !barangaySelect) return;

  // Populate Municipality options
  const municipals = Object.keys(addressesData);
  municipals.forEach(municipal => {
    const option = document.createElement("option");
    option.value = municipal;
    option.textContent = municipal;
    municipalitySelect.appendChild(option);
  });

  // When Municipality changes, populate corresponding Barangays
  municipalitySelect.addEventListener("change", () => {
    const selectedMunicipality = municipalitySelect.value;

    // Clear old options
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';

    if (selectedMunicipality && addressesData[selectedMunicipality]) {
      addressesData[selectedMunicipality].forEach(barangay => {
        const option = document.createElement("option");
        option.value = barangay;
        option.textContent = barangay;
        barangaySelect.appendChild(option);
      });

      barangaySelect.disabled = false;
    } else {
      barangaySelect.disabled = true;
    }
  });

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

  // Populate Contact Info & Address
  const client = await fetchClient();
  document.querySelector('#input-email').value = client.email || '';
  document.querySelector('#input-contact-number').value = client.contactNum || '';

  const clientMunicipality = client.municipality || '';
  const clientBarangay = client.barangay || '';

  if (clientMunicipality) {
    municipalitySelect.value = clientMunicipality;

    // Trigger change to load barangays
    municipalitySelect.dispatchEvent(new Event("change"));

    barangaySelect.value = clientBarangay;
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
// ========== Handle Sending Appointment
// ======================================
const handaleRequestAppointment = () => {
  const appointmentForm = document.querySelector('#request-appointment-form');
  const dateInput = document.querySelector('#input-date');
  const timeInput = document.querySelector('#input-time');

  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedDate = new Date(dateInput.value);
    const selectedTime = timeInput.value;

    const isDateValid = checkAppointmentDate(selectedDate);
    const isTimeValid = checkTime(selectedTime);
    if (!isDateValid || !isTimeValid) return;

    alert('WellDone');
    appointmentForm.classList.remove('show');
    // render appointment list
  });
}


// ======================================
// ========== Main Function - Setup Appointment Section
// ======================================
export default function setupAppointmentSection() {
  toggleRequestAppointmentForm();
  toggleAppointmentMoreDetails();
  setupRequestAppointmentForm();
  displaySwineList();
  handaleRequestAppointment();
}