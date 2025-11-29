import addressesData from '../../static-data/addresses.js';
import updateSidenav from "../../utils/updateSidenav.js"; // Import the updateSidenav utility function from the utils folder
import handleAddAppointment from "./add-appointment.js";
import handleRenderAppointments from "./display-appointment.js";
import { setupAppointmentFormListener, acceptAppointmentRequest } from "./accept-appointment.js";
import { setupReschedAppointmentFormListener, rescheduleAppointmentRequest } from './reschedule-appointment.js';
import handleRemoveAppointment from "./remove-appointment.js";
import { handleRestoreAppointment,
         handleDeleteAppointment,} from "./complete-restore-delete-appointment.js";
import handleAppointmentCalendarContent from "./appointment-calendar.js";
import fetchUsers from "../../api/fetch-users.js"
import populateAppointmentDateAndTime from "../../api/fetch-appointment-date-and-time.js";
import {fetchServices} from '../../api/fetch-services.js';
import { getServiceName } from '../../api/fetch-services.js'; 
import { fetchAppointments } from '../../api/fetch-appointments.js';
import populateFilteredMedicines from '../../utils/filter-service-medicine.js';
import { handleReportChange } from '../reports/generate-appointment-reports.js';
import initAppointmentFiltering from '../../utils/filter-appointment-data.js';
import { fetchNumOfAppt } from '../../api/fetch-schedules.js';




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
// ========== View Button (Appointment Table Content, Technicians Section, Appointment Calendar Schedule) Buttons Functionality
// ======================================
const viewBtnsFunctionality = () => {
  const appointmentTableContent = document.querySelector('.appointment-table-content');
  const appointmentSchedContent = document.querySelector('.appointment-schedule-content');
  const appointmentsSection = document.getElementById('appointments-section');
  const techniciansSection = document.getElementById('technicians-section');
  const staffSection = document.getElementById('staff-section');
  const generateReportContainer = document.querySelector('.appointment-section__report-contents'); 

  const viewSchedBtn = document.querySelector('.appointment-section__view-schedules-btn');
  const viewTableBtn = document.querySelector('.appointment-section__view-appointments-table-btn');
  const viewTechniciansBtn = document.querySelector('.appointment-section__view-technicians-btn');
  const viewStaffBtn = document.querySelector('.appointment-section__view-staff-btn');
  const generateReportBtn = document.querySelector('.appointments-section__view-report-btn');
  const backToTableBtn = document.querySelector('.appointment-section__report-contents .reports-content__back-table-btn');

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

  if (generateReportBtn) generateReportBtn.addEventListener('click', ()=> {
                          appointmentTableContent.classList.remove('show');
                          generateReportContainer.classList.add('show');

                          setTimeout(() => {
                            handleReportChange();
                          }, 100);
                        });
  
  if (backToTableBtn) backToTableBtn.addEventListener('click', () => {
                      generateReportContainer.classList.remove('show');

                      appointmentTableContent.classList.add('show');
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
const setupScheduleAppointmentForm = async (appointmentId) => {
  try {
    const todayStr = new Date().toDateString(); // current date as string

    const allUsers = await fetchUsers();
    const technicians = allUsers.filter(user =>
      user.roles.includes('technician') || user.roles.includes('veterinarian')
    );

    const maxApptPerDayList = await fetchNumOfAppt(); // [{ userId, totalAppointment }, ...]

    const appointments = await fetchAppointments();
    const appointment = appointments.find(app => app._id === appointmentId);
    const serviceName = await getServiceName(appointment.appointmentService);
    document.querySelector('.appointment-schedule-form__service-name').innerText = serviceName;

    // Service Type
    const serviceTypeSelectTag = document.getElementById('set-appointment-type');
    serviceTypeSelectTag.value = appointment.appointmentType;
    // Reset button
    // serviceTypeSelectTag.addEventListener('click', () => {
    //   serviceTypeSelectTag.value = ""; // or selectedIndex = 0
    // });

    const personnelSelectElement = document.querySelector('.appointment-schedule-form #available-personnel');
    if (!personnelSelectElement) return;

    personnelSelectElement.innerHTML = '<option value="">Select personnel</option>';

    technicians.forEach(technician => {
      const prefix = technician.roles.includes('veterinarian') ? 'Doc.' : 'Mr.';
      const middleInitial = technician.middleName ? technician.middleName.charAt(0).toUpperCase() + '.' : '';
      const technicianFullname = `${prefix} ${technician.firstName} ${middleInitial} ${technician.lastName}`;

      // Get this vet's max appointments per day
      const vetMaxObj = maxApptPerDayList.find(v => v.userId === technician._id);
      const maxAppointments = vetMaxObj?.totalAppointment || 5;

      // Count assigned appointments for **today**
      const assignedToday = appointments.filter(app =>
        app.vetPersonnel === technician._id &&
        (app.appointmentStatus === 'accepted' || app.appointmentStatus === 'reschedule') &&
        new Date(app.appointmentDate).toDateString() === todayStr
      );

      const isOverloaded = assignedToday.length >= maxAppointments;

      const option = document.createElement('option');
      option.value = technician._id;
      option.textContent = `${technicianFullname} ${isOverloaded ? '(Fully booked)' : ''}`;
      if (isOverloaded) option.disabled = true;

      personnelSelectElement.appendChild(option);
    });

  } catch (err) {
    console.error(err);
  }
};














// ======================================
// ========== Add Data to reschedule-appointment-form
// ======================================
const setupRescheduleAppointmentForm = async(appointmentId) => {
  try {
    const allUsers = await fetchUsers();
    const technicians = allUsers.filter(user =>
      user.roles.includes('technician') || user.roles.includes('veterinarian')
    );

    //Personal Select Element
    const personnelSelectElement = document.querySelector('.appointment-reschedule-form #reschedule-available-personnel');
    if (!personnelSelectElement) return;

    // get current appointment
    const appointments = await fetchAppointments();
    const appointment = appointments.find(app => app._id === appointmentId);

    // populate select
    technicians.forEach(technician => {
      const prefix = technician.roles.includes('veterinarian')
        ? 'Doc.'
        : technician.roles.includes('technician')
          ? 'Mr.'
          : '';
      const middleInitial = technician.middleName
        ? technician.middleName.charAt(0).toUpperCase() + '.'
        : '';
      const technicianFullname = `${prefix} ${technician.firstName} ${middleInitial} ${technician.lastName}`;

      const option = document.createElement('option');
      option.value = technician._id;
      option.textContent = technicianFullname;

      // ✅ Pre-select if previously assigned
      if (appointment.vetPersonnel === technician._id) {
        option.selected = true;
      }

      personnelSelectElement.appendChild(option);
    });

    // set service name
    const serviceName = await getServiceName(appointment.appointmentService);
    document.querySelector('.appointment-reschedule-form__service-name').innerText = `${serviceName}`;

    // set appointment type
    const appointment_type = appointment.appointmentType ? appointment.appointmentType : 'Not set';
    document.querySelector('#reschedule-appointment-type').value = appointment_type;

  } catch (err) {
    console.log(err);
  }
};



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



const toggleRescheduleAppointmentForm = () => {
  // Reschedule Form
  const rescheduleAppointmentForm = document.querySelector('.appointment-reschedule-form');
  rescheduleAppointmentForm.classList.add('show');

  const filterSelect = document.querySelector('.filter-apointments-status')
  const filterSelectTech = document.querySelector('#reschedule-available-personnel');

  const rescheduleCancelBtn = document.getElementById('reschedule-cancel-btn');

  rescheduleCancelBtn.addEventListener('click', () => {
    rescheduleAppointmentForm.classList.remove('show');
    rescheduleAppointmentForm.reset();
    filterSelect.selectedIndex = 0;
    filterSelectTech.innerHTML = '<option value="">Personnel</option>';
  });
}



// ======================================
// ==========Toggle Popup Accept Appointment Form
// ======================================
const toggleAcceptAppointmentForm = (actionSelect) => {
  const acceptAppointmentForm = document.querySelector('.appointment-schedule-form');
  const personnelSelectElement = document.querySelector('#available-personnel');

  acceptAppointmentForm.classList.add('show')

  const closeFormBtn = document.querySelector('.appointment-schedule-form__close-btn');
  if (!closeFormBtn) return;

  closeFormBtn.addEventListener('click', () => {
    acceptAppointmentForm.classList.remove('show');
    if(actionSelect) actionSelect.value = '' 
    personnelSelectElement.innerHTML = '<option value="">Personnel</option>';
  });


}


// ======================================
// ========== Appointment Select Actions
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
          acceptAppointmentRequest(appointmentId);
          populateAppointmentDateAndTime(appointmentId);
          setupScheduleAppointmentForm(appointmentId);
          populateFilteredMedicines(appointmentId);

        } else if(actionSelect.value === 'reschedule'){
          toggleRescheduleAppointmentForm();
          populateAppointmentDateAndTime(appointmentId);
          rescheduleAppointmentRequest(appointmentId);
          setupRescheduleAppointmentForm(appointmentId);
          
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
    const appointmentFormHardCopy = document.querySelector('.appointment-form__hard-copy');

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
          // else if(button.id === 'completed-btn') {
          //   completeAppointmentRequest(appointmentId)
          // }
          else if(button.id === 'print-download-btn') {
            //alert(`Print & Download has been clicked! \n Appointment Id: ${appointmentId}` )
            createAppointmentForm(appointmentId);
            appointmentFormHardCopy.classList.add('show');
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

    toggleClinicalSignImage();

  })
}


// ======================================
// ========== Toggle Clinical Signs 
// ======================================
const toggleClinicalSignImage = () => {
  const image = document.querySelectorAll('.admin-side__clinical-sign-img');
  const overlay = document.querySelector('.admin-clinical-signs-overlay');
  const popup = document.querySelector('.admin-popUp-image__clinical-sign-container');
  const hideBtn = document.querySelector('.admin-hide-btn__clinical-sign');

  image.forEach(img => {
    img.addEventListener('click', () => {
      const appointmentId = img.dataset.id;
      overlay.classList.add('show');
      handleClinicalPopUpImage(appointmentId);
    });
  })

    hideBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
  });

  // Optional: clicking outside popup closes it
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
}


// ======================================
// ========== Display Clinical Signs Image
// ======================================
const handleClinicalPopUpImage = async(appointmentId) => {
  const popUp_Image = document.querySelector('.admin-popUp-image__clinical-sign-container .clinical-signs__images');
  const appointments = await fetchAppointments();
  const appointment = appointments.find(app => app._id === appointmentId);

  popUp_Image.src = `${appointment.swineImage ? '/uploads/' + appointment.swineImage : "images-and-icons/icons/default-img__clinical-sign.png"}`;
}



    

// ======================================
// ========== Main Function - Setup Appointments Section
// ======================================
export default function setupAppointmentSection () {
  handleAddAppointment();
  handleRenderAppointments();
  initAppointmentFiltering();
  handleAppointmentSelectActions();
  handleDisabledActionOptions();
  handleAppointmentButtonsActions();
  // filterAppointments();
  searchAppointment();
  setupAddAppointmentForm();
  toggleAddAppointmentForm();
  toggleAppointentMoreDetails();
  viewBtnsFunctionality();
  setupAppointmentFormListener();
  setupReschedAppointmentFormListener();
}

