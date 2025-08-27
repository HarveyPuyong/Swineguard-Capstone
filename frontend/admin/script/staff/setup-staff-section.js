import handleAppointmentCalendarContent from "../appointments/appointment-calendar.js";
import updateSidenav from "../../utils/updateSidenav.js";
import addressesData from '../../static-data/addresses.js';
import togglePasswordVisibility from "./../../utils/togglePasswordVisiblity.js"
import handleRenderStaff from "./display-staff.js";
import handleAddStaff from "./add-staff.js";


// ======================================
// ========== Show Add Staff Form
// ======================================
const toggleAddStaffForm = () => {
  const addStaffForm = document.querySelector('#add-staff-form');
  const addStaffFormBtn = document.querySelector('.staff-section__add-staff-form-btn');
  const closeStaffFormBtn = document.querySelector('#add-staff-form .cancel-btn');

  addStaffFormBtn.addEventListener('click', () => addStaffForm.classList.add('show'));
  closeStaffFormBtn.addEventListener('click', () => addStaffForm.classList.remove('show'))
}


// ======================================
// ========== Setup Add Staff Form
// ======================================
const setupAddStaffForm = () => {
  //Toggle Password and Confirm Password Visibility
  const passwordInput = document.querySelector('#add-staff-form #password');
  const togglePasswordEye = document.querySelector('#add-staff-form .password .toggle-password-eye');
  const passworsEyeSlash = document.querySelector('#add-staff-form .password .eye-slash');

  const confirmPasswordInput = document.querySelector('#add-staff-form #confirm-password');
  const toggleConfirmPasswordEye = document.querySelector('#add-staff-form .confirm-password .toggle-password-eye');
  const confirmPassworsEyeSlash = document.querySelector('#add-staff-form .confirm-password .eye-slash');

  togglePasswordEye.addEventListener('click', () => togglePasswordVisibility(passworsEyeSlash, passwordInput));
  toggleConfirmPasswordEye.addEventListener('click', () => togglePasswordVisibility(confirmPassworsEyeSlash, confirmPasswordInput));


  //Add municipilaties and barangay optiosn to select tags
  const municipalitySelect = document.querySelector("#add-staff-form #municipality");
  const barangaySelect = document.querySelector("#add-staff-form #barangay");

  if(!municipalitySelect || !barangaySelect) return;

  const municipals = Object.keys(addressesData);

  municipals.forEach(municipal => {
      const option = document.createElement("option");
      option.value = municipal;
      option.textContent = municipal;
      municipalitySelect.appendChild(option);
  });

  municipalitySelect.addEventListener("change", () => {
    const selectedMunicipality = municipalitySelect.value;

    // Reset barangay options
    barangaySelect.innerHTML = '<option value="" hidden>Select barangay</option>';
    barangaySelect.disabled = true;

    if (selectedMunicipality && addressesData[selectedMunicipality]) {
      addressesData[selectedMunicipality].forEach(barangay => {
        const option = document.createElement("option");
        option.value = barangay;
        option.textContent = barangay;
        barangaySelect.appendChild(option);
      });
      barangaySelect.disabled = false;
    }
  });
};


// ======================================
// ========== Go To Appointments Calendar
// ======================================
const viewAppointmentsCalendar = () => {
  const appointmentTableContent = document.querySelector('.appointment-table-content');
  const appointmentSchedContent = document.querySelector('.appointment-schedule-content');
  const appointmentsSection = document.getElementById('appointments-section');
  const staffSection = document.getElementById('staff-section');

  const viewCalendarBtn = document.querySelector('#staff-section .staff-section__view-appointments-calendar')
    .addEventListener('click', () => {
      staffSection.classList.add('hide');
      staffSection.classList.remove('show');

      appointmentsSection.classList.add('show');
      appointmentsSection.classList.remove('hide');

      appointmentTableContent.classList.remove('show');
      appointmentSchedContent.classList.add('show');
      updateSidenav();
      handleAppointmentCalendarContent();
  });
}


// ======================================
// ========== Main Function - Setup Swines Section
// ======================================
export default function setupStaffSection() {
  toggleAddStaffForm();
  setupAddStaffForm();
  handleAddStaff();
  handleRenderStaff();
  viewAppointmentsCalendar();
}