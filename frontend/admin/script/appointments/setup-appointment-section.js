import addressesData from '../../static-data/addresses.js';
import updateSidenav from "../../utils/updateSidenav.js"; // Import the updateSidenav utility function from the utils folder
import handleAddAppointment from "./add-appointment.js";
import handleRenderAppointments from "./display-appointment.js";
import handleAcceptAppointment from "./accept-appointment.js";
import handleRescheduleAppointment from './reschedule-appointment.js';
import handleRemoveAppointment from "./remove-appointment.js";
import {handleCompleteAppointment,
        handleRestoreAppointment,
        handleDeleteAppointment,} from "./complete-restore-delete-appointment.js";
import appointmentCalendar from "./appointment-calendar.js"


// ======================================
// ========== Search Appointments
// ======================================
const searchAppointment = () => {
  //custom event 'renderAppointments' na magagamit lang kapag naka render na yung appointment data
  document.addEventListener('renderAppointments', () => {
    const input = document.querySelector('.appointment-section__search-input');
    const appointments = document.querySelectorAll('.appointment-table .appointment');

    if (!input || appointments.length === 0) return;

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();

      appointments.forEach(appointment => {
        console.log(appointment)
        const firstName = appointment.querySelector('.first-name')?.textContent.toLowerCase() || '';
        const lastName = appointment.querySelector('.last-name')?.textContent.toLowerCase() || '';
        const contact = appointment.querySelector('.contact')?.textContent.toLowerCase() || '';
        const email = appointment.querySelector('.column.right .column__detail-value:nth-last-child(1)')?.textContent.toLowerCase() || '';
        const address = [...appointment.querySelectorAll('.column.left .column__detail')].find(p =>
          p.textContent.includes('Adress')
        )?.querySelector('.column__detail-value')?.textContent.toLowerCase() || '';
        const actualSchedule = [...appointment.querySelectorAll('.column.left .column__detail')].find(p =>
          p.textContent.includes('Actual Schedule')
        )?.querySelector('.column__detail-value')?.textContent.toLowerCase() || '';

        const searchableText = `${firstName} ${lastName} ${contact} ${email} ${address} ${actualSchedule}`;

        appointment.style.display = searchableText.includes(query) ? 'block' : 'none';
      });
    });
  })
};


// ======================================
// ========== Set Filter Appointment Color
// ======================================
const setFilterColor = (statusValue, element) =>{
    if (statusValue === 'pending') {
      element.style.setProperty('--color', 'rgb(37, 37, 37)');
      element.style.setProperty('--BGcolor', 'rgba(0, 0, 0, 0.19)');
    } else if (statusValue === 'ongoing') {
      element.style.setProperty('--color', 'rgb(55, 119, 255)');
      element.style.setProperty('--BGcolor', 'rgba(73, 130, 254, 0.24)');
    } else if (statusValue === 'completed') {
      element.style.setProperty('--color', 'rgb(0, 153, 71)');
      element.style.setProperty('--BGcolor', 'rgba(29, 255, 135, 0.13)');
    } else if (statusValue === 'reschedule') {
      element.style.setProperty('--color', 'rgb(153, 115, 0)');
      element.style.setProperty('--BGcolor', 'rgba(255, 191, 0, 0.30)');
    } else if (statusValue === 'removed'){
      element.style.setProperty('--color', 'rgb(210, 17, 17)'); 
      element.style.setProperty('--BGcolor', 'rgba(226, 35, 35, 0.21)');
    } else{
      element.style.setProperty('--color', 'black');
      element.style.setProperty('--BGcolor', 'white');
    }
}


// ======================================
// ========== Filter Appointments
// ======================================
const filterAppointments = () => {
  document.addEventListener('renderAppointments', () => {
    const selectStatus = document.querySelector('.filter-apointments-status');

    selectStatus.addEventListener('change', () => {
      const selectedValue = selectStatus.value.toLowerCase();
      setFilterColor(selectedValue, selectStatus);

      document.querySelectorAll('#appointments-section .appointment-table .appointment .td.status')
        .forEach(status => {
          const statusValue = status.getAttribute('data-status-value');
          const appointment = status.parentElement.parentElement;
          appointment.style.display = 'none';

          if(selectedValue === 'all'){
            appointment.style.display = 'block';
          } else if (selectedValue === statusValue) {
            appointment.style.display = 'block';
          }
      });
    });
  })
}


// ======================================
// ========== View (Appointment Table Content, Technicians Section, Appointment Calendar Schedule) Buttons Functionality
// ======================================
const viewBtnsFunctionality = () => {
  const appointmentTableContent = document.querySelector('.appointment-table-content');
  const appointmentSchedContent = document.querySelector('.appointment-schedule-content');
  const appointmentsSection = document.getElementById('appointments-section');
  const techniciansSection = document.getElementById('technicians-section');

  const viewSchedBtn = document.querySelector('.appointment-section__view-schedules-btn')
    .addEventListener('click', () => {
      appointmentTableContent.classList.remove('show');
      appointmentSchedContent.classList.add('show');
      appointmentCalendar();
  });

  const viewTableBtn = document.querySelector('.appointment-section__view-appointments-table-btn')
    .addEventListener('click', () => {
      appointmentTableContent.classList.add('show');
      appointmentSchedContent.classList.remove('show');
  });

  const viewTechniciansBtn = document.querySelector('.appointment-section__view-technicians-btn')
    .addEventListener('click', () => {
      appointmentsSection.classList.add('hide');
      appointmentsSection.classList.remove('show');
      
      techniciansSection.classList.add('show');
      techniciansSection.classList.remove('hide');
      updateSidenav();
  });

}


// ======================================
// ========== Add Static Data to add-appointment-form
// ======================================
const setupAddAppointmentForm = () => {
  const municipalitySelect = document.querySelector("#add-appointments-form #municipality");
  const barangaySelect = document.querySelector("#add-appointments-form #barangay");

  const municipals = Object.keys(addressesData);

  municipals.forEach(municipal => {
      const option = document.createElement("option");
      option.value = municipal;
      option.textContent = municipal;
      municipalitySelect.appendChild(option);
  });

  
  municipalitySelect.addEventListener("change", () => {
    const selectedMunicipality = municipalitySelect.value;

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
};


// ======================================
// ==========Toggle Popup Add Appointment Form
// ======================================
const toggleAddAppointmentForm = () => {
  const formContainer = document.querySelector('.add-appointment-container');

  const showFormBtn = document.querySelector('.appointment-section__add-btn')
    .addEventListener('click', () => formContainer.classList.add('show'));

  const closeFormBtn = document.querySelector('.add-appointment-container__close-form-btn')
    .addEventListener('click', () => formContainer.classList.remove('show'));
}


// ======================================
// ==========Toggle Popup Accept Appointment Form
// ======================================
const toggleAcceptAppointmentForm = (actionSelect) => {
  const acceptAppointmentForm = document.querySelector('.appointment-schedule-form');

  acceptAppointmentForm.classList.add('show')

  const closeFormBtn = document.querySelector('.appointment-schedule-form__close-btn');
  if (!closeFormBtn) return;

  closeFormBtn.addEventListener('click', () => {
      acceptAppointmentForm.classList.remove('show');
      if(actionSelect) actionSelect.value = '' 
  });
}


// ======================================
// ========== Appointment Select Actions.
//            Dito ko cinall lahat ng handleFuntions (Accept, Reschedule, Remove) 
// ======================================
const handleAppointmentSelectActions = () => {
   document.addEventListener('renderAppointments', () => {
    const appointments = document.querySelectorAll('.appointment-table .appointment');

    appointments.forEach(appointment => {
      const actionSelect = appointment.querySelector('.select-appointment-action');
      actionSelect.addEventListener('change', () => {
        const appointmentId = actionSelect.dataset.appointmentId;

        if(actionSelect.value === 'accept'){
          toggleAcceptAppointmentForm(actionSelect);
          handleAcceptAppointment(appointmentId);
        } else if(actionSelect.value === 'reschedule'){
          handleRescheduleAppointment(appointmentId);
        }
        else if(actionSelect.value === 'remove'){
          handleRemoveAppointment(appointmentId)
        }
      });
    });
  });
}


// ======================================
// ========== Appointment Buttons Actions.
//            Dito ko cinall lahat ng handleFuntions (Restore, Delete, Complete, Set-Schedule) 
// ======================================
const handleAppointmentButtonsActions = () => {
   document.addEventListener('renderAppointments', () => {
    const appointments = document.querySelectorAll('.appointment-table .appointment');

    appointments.forEach(appointment => {
      const buttons = appointment.querySelectorAll(`.appointment__more-details .buttons-container button`);

      buttons.forEach(button =>{
        const appointmentId = button.dataset.appointmentId;

        button.addEventListener('click', () => {
          if(button.id === 'restore-btn') {
            handleRestoreAppointment(appointmentId)
          } 
          else if(button.id === 'delete-btn') {
            handleDeleteAppointment(appointmentId)
          }
          else if(button.id === 'set-schedule-btn') {
            toggleAcceptAppointmentForm(null);
            handleAcceptAppointment(appointmentId);
          }
          else if(button.id === 'completed-btn') {
            handleCompleteAppointment(appointmentId)
          }
        });
      })
    });
  });
}


// ======================================
// ========== Toggle Appointment More-Details 
// ======================================
const toggleAppointentMoreDetails = () => {
  document.addEventListener('renderAppointments', () => {
    const appointments = document.querySelectorAll('.appointment-table .appointment');
      appointments.forEach(appointment => {
        const toggleBtn = appointment.querySelector('.toggle-more-details-btn');
        const moreDetails = appointment.querySelector('.appointment__more-details');

        toggleBtn.addEventListener('click', () => {
          toggleBtn.classList.toggle('active');

          if(toggleBtn.classList.contains('active')){
            moreDetails.classList.add('show')
          }else{
            moreDetails.classList.remove('show')
          }
        });
      });
  })
}
    

// ======================================
// ========== Main Function - Setup Appointments Section
// ======================================
export default function setupAppointmentSection () {
  handleAddAppointment();
  handleRenderAppointments();
  handleAppointmentSelectActions();
  handleAppointmentButtonsActions();
  filterAppointments();
  searchAppointment();
  setupAddAppointmentForm();
  toggleAddAppointmentForm();
  toggleAppointentMoreDetails();
  viewBtnsFunctionality();
}

