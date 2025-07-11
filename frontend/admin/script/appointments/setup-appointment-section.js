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
import handleAppointmentCalendarContent from "./appointment-calendar.js";
import fetchUsers from "../../api/fetch-users.js"
import populateAppointmentDateAndTime from "../../api/fetch-appointment-date-and-time.js";
import {fetchServices} from '../../api/fetch-services.js';
import populateFilteredMedicines from '../../utils/filter-service-medicine.js';


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
    } else if (statusValue === 'accepted') {
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
// ========== Appointment Sorting
// ======================================
const appointmentsSorting = () => {
  document.addEventListener('renderAppointments', () => {
    const sortingSelect = document.querySelector('.appointment-sorting__select');
    const appointmentTable = document.querySelector('#appointments-section .appointment-table__tbody'); 

    if (!sortingSelect || !appointmentTable) return;

    const originalAppointments = Array.from(appointmentTable.children);

    sortingSelect.addEventListener('change', () => {
      const selectedSort = sortingSelect.value;
      
      if (selectedSort === 'default') {
        appointmentTable.innerHTML = '';
        originalAppointments.forEach(app => appointmentTable.appendChild(app));
        return;
      }

      const appointments = Array.from(appointmentTable.querySelectorAll('.appointment'));

      const sortedAppointments = appointments.sort((a, b) => {
        if (selectedSort === 'last-name') {
          const aValue = a.querySelector('.last-name')?.textContent.trim().toLowerCase();
          const bValue = b.querySelector('.last-name')?.textContent.trim().toLowerCase();
          return aValue.localeCompare(bValue);
        }

        if (selectedSort === 'date') {
          const parseDateTime = (text) => {
            const [datePart, timePart] = text.split(' at ');
            if (!datePart || !timePart) return new Date(0); 

            const [time, modifier] = timePart.trim().split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            const isoDateTime = `${datePart.trim()}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
            return new Date(isoDateTime);
          };

          const aDateText = a.querySelector('.date-time')?.textContent.trim();
          const bDateText = b.querySelector('.date-time')?.textContent.trim();
          const aDate = parseDateTime(aDateText);
          const bDate = parseDateTime(bDateText);

          return aDate - bDate;
        }

        if (selectedSort === 'address') {
          const aAddress = a.querySelector('.column.left .column__detail:nth-child(5) .column__detail-value')?.textContent.trim().toLowerCase();
          const bAddress = b.querySelector('.column.left .column__detail:nth-child(5) .column__detail-value')?.textContent.trim().toLowerCase();
          return aAddress.localeCompare(bAddress);
        }

        return 0;
      });

      appointmentTable.innerHTML = '';
      sortedAppointments.forEach(appointment => appointmentTable.appendChild(appointment));
    });
  });
};



// ======================================
// ========== View Button (Appointment Table Content, Technicians Section, Appointment Calendar Schedule) Buttons Functionality
// ======================================
const viewBtnsFunctionality = () => {
  const appointmentTableContent = document.querySelector('.appointment-table-content');
  const appointmentSchedContent = document.querySelector('.appointment-schedule-content');
  const appointmentsSection = document.getElementById('appointments-section');
  const techniciansSection = document.getElementById('technicians-section');
  const staffSection = document.getElementById('staff-section');

  const viewSchedBtn = document.querySelector('.appointment-section__view-schedules-btn');
  const viewTableBtn = document.querySelector('.appointment-section__view-appointments-table-btn');
  const viewTechniciansBtn = document.querySelector('.appointment-section__view-technicians-btn');
  const viewStaffBtn = document.querySelector('.appointment-section__view-staff-btn');

  if(viewSchedBtn)  viewSchedBtn.addEventListener('click', () => {
                      appointmentTableContent.classList.remove('show');
                      appointmentSchedContent.classList.add('show');
                      handleAppointmentCalendarContent();
                    });

  if(viewTableBtn)  viewTableBtn.addEventListener('click', () => {
                      appointmentTableContent.classList.add('show');
                      appointmentSchedContent.classList.remove('show');
                    });

  if(viewTechniciansBtn) viewTechniciansBtn.addEventListener('click', () => {
                            appointmentsSection.classList.add('hide');
                            appointmentsSection.classList.remove('show');
                            
                            techniciansSection.classList.add('show');
                            techniciansSection.classList.remove('hide');
                            updateSidenav();
                          });

  if(viewStaffBtn) viewStaffBtn.addEventListener('click', () => {
                      appointmentsSection.classList.add('hide');
                      appointmentsSection.classList.remove('show');
                      
                      staffSection.classList.add('show');
                      staffSection.classList.remove('hide');
                      updateSidenav();
                    });
}


// ======================================
// ========== Add Static Data to add-appointment-form
// ======================================
const setupAddAppointmentForm = async() => {
  const municipalitySelect = document.querySelector("#add-appointments-form #municipality");
  const barangaySelect = document.querySelector("#add-appointments-form #barangay");
  const serviceSelect = document.getElementById("appointment-service");

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

  // Populate services
  const services = await fetchServices();
  if (!serviceSelect) return;
  services.forEach(service => {
    const option = document.createElement('option');
    option.value = service._id;
    option.textContent = service.serviceName;
    serviceSelect.appendChild(option);
  });

};


// ======================================
// ========== Add Data to schedule-appointment-form
// ======================================
const setupScheduleAppointmentForm = async() => {
  try{
    const allUsers = await fetchUsers();
    const technicians = allUsers.filter(user => user.roles.includes('technician') || user.roles.includes('veterinarian'));

    //Personal Select Element
    const personalSelectElement = document.querySelector('.appointment-schedule-form #available-personnel');
     if(!personalSelectElement) return;

    technicians.forEach(technician => {
      const prefix = technician.roles.includes('veterinarian') ? 'Doc.' : technician.roles.includes('technician') ? 'Mr.' : '';
      const middleInitial = technician.middleName ? technician.middleName.charAt(0).toUpperCase() + '.' : '';
      const technicianFullname = `${prefix} ${technician.firstName} ${middleInitial} ${technician.lastName}`;

      const option = document.createElement('option');
      option.value = technician._id;
      option.textContent = technicianFullname;

      personalSelectElement.appendChild(option);
    })

  } catch(err) {
    console.log(err)
  }
}


// ======================================
// ==========Toggle Popup Add Appointment Form
// ======================================
const toggleAddAppointmentForm = () => {
  const formContainer = document.querySelector('.add-appointment-container');
  const closeFormBtn = document.querySelector('.add-appointment-container__close-form-btn');
  const showFormBtn = document.querySelector('.appointment-section__add-btn');

  if(!formContainer || !closeFormBtn || !showFormBtn) return

  showFormBtn.addEventListener('click', () => formContainer.classList.add('show'));
  closeFormBtn.addEventListener('click', () => formContainer.classList.remove('show'));
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
//            Dito ko cinall ang mga handleFuntions na (Accept, Reschedule, Remove) Appointment
// ======================================
const handleAppointmentSelectActions = () => {
   document.addEventListener('renderAppointments', () => {
    const appointments = document.querySelectorAll('.appointment-table .appointment');

    appointments.forEach(appointment => {
      const actionSelect = appointment.querySelector('.select-appointment-action');
      if(!actionSelect) return;

      actionSelect.addEventListener('change', () => {
        const selectedOption = actionSelect.selectedOptions[0];
        const appointmentId = actionSelect.dataset.appointmentId;

        if(actionSelect.value === 'accept'){
          toggleAcceptAppointmentForm(actionSelect);
          handleAcceptAppointment(appointmentId);
          populateAppointmentDateAndTime(appointmentId);
          populateFilteredMedicines(appointmentId);
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
// ========== Handle to Disabled Select Action Options Based on the Apointment Status
// ======================================
const handleDisabledActionOptions = () => {
  document.addEventListener('renderAppointments', () => {
     const appointments = document.querySelectorAll('.appointment-table .appointment');

     appointments.forEach(appointment => {
      const appointmentStatusValue = appointment.querySelector('.td.status').dataset.statusValue;

      const actionOptions = appointment.querySelectorAll('.select-appointment-action option');
      actionOptions.forEach(option => {
        const optionValue = option.value

        if(appointmentStatusValue === 'accepted' && optionValue === 'accept') option.disabled = true
        else if(appointmentStatusValue === 'reschedule' && optionValue === 'reschedule') option.disabled = true
        else if(appointmentStatusValue === 'removed' && optionValue === 'remove') option.disabled = true
        else if(appointmentStatusValue === 'completed') option.disabled = true
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
            moreDetails.classList.add('show');
            console.log(moreDetails)
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
  handleDisabledActionOptions();
  handleAppointmentButtonsActions();
  filterAppointments();
  appointmentsSorting();
  searchAppointment();
  setupAddAppointmentForm();
  setupScheduleAppointmentForm();
  toggleAddAppointmentForm();
  toggleAppointentMoreDetails();
  viewBtnsFunctionality();
}

