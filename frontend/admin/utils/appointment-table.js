import { formattedDate, formatTo12HourTime } from './formated-date-time.js';
import { getMedicineName } from './../api/fetch-medicine.js';
import { getTechnicianName } from './../api/fetch-technicians.js';
import { getServiceName } from './../api/fetch-services.js';
import fetchUser from '../script/auth/fetchUser.js';

async function appointmentsTable(appointments, table) {
  const user = await fetchUser();
  const role = user.roles;

  //console.log(role[0])

  let appointmentTableHTML = '';
  if (appointments.length === 0) {
    appointmentTableHTML = `
      <div class="no-service-card">
        <p class='no-service__header'>No Appointments<p>
        <p class='no-service__ds'>Click 'add' to create an appointments or wait for the swine raisers to request an appointment.<p>
      </div>
    `;
    table.innerHTML = appointmentTableHTML;
  }

  for (const appointment of appointments) {
    //const medicineName = 'To be Update';
    const TechnicianName = await getTechnicianName(appointment.vetPersonnel);
    const serviceName = await getServiceName(appointment.appointmentService);
    const medicineName = await getMedicineName(appointment.medicine);

    const clinicalSignsContainer = document.querySelector('#clinical-signs-display');

    const clinicalSignsHTML = (appointment.clinicalSigns && appointment.clinicalSigns.length > 0)
      ? `<ul>${appointment.clinicalSigns.map(sign => `<li>• ${sign}</li>`).join('')}</ul>`
      : "None"
    ;

    const appointment_date = new Date(appointment.appointmentDate)
    let isAppointmentPastDate = appointment.appointmentStatus === 'accepted' && appointment_date <= new Date();
    //console.log(isAppointmentPastDate)

    appointmentTableHTML += `
      <div class="appointment status-${appointment.appointmentStatus}" data-id=${appointment._id}>
        <div class="appointment__details">
          <p class="td first-name">${appointment.clientFirstname}</p>
          <p class="td last-name">${appointment.clientLastname}</p>
          <p class="td appointment-name">${serviceName}</p>
          <p class="td date-time ${isAppointmentPastDate}">${formattedDate(appointment.appointmentDate)} at ${formatTo12HourTime(appointment.appointmentTime)}</p>
          <p class="td status status--${appointment.appointmentStatus.toLowerCase()}"
             data-status-value=${appointment.appointmentStatus.toLowerCase()}>
             ${appointment.appointmentStatus}
          </p>
          <p class="td action">
            <select class="select-appointment-action" data-appointment-id=${appointment._id} name="appointment-action" id="appointment-action" ${role[0] === 'admin' || appointment.appointmentStatus === 'completed' ? 'disabled' : ''}>
              <option value="">Action</option>
              <option value="accept" ${appointment.appointmentStatus === 'reschedule' ? 'disabled' : ''}>Accept</option>
              <option value="reschedule" ${appointment.appointmentStatus === 'pending' ? 'disabled' : ''}>Reschedule</option>
              <option value="remove">Remove</option>
            </select> 
          </p>
          <p class="td toggle-more-details-btn" data-value="toggle-more-details">View</p>  
        </div>
        <div class="appointment__more-details">
          <div class="appointment__more-details-heading">Appointment Details:</div>
          <div class="appointment__more-details-columns">
            <div class="column left">
              <p class="column__detail">
                <span class="column__detail-label">Appointment ID:</span>
                <span class="column__detail-value">${appointment._id}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Appointment Type:</span>
                <span class="column__detail-value">${appointment.appointmentType}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Date sent:</span>
                <span class="column__detail-value appointment-date-send">${formattedDate(appointment.createdAt)}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Schedule:</span>
                <span class="column__detail-value">${formattedDate(appointment.appointmentDate)} at ${formatTo12HourTime(appointment.appointmentTime)}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Address:</span>
                <span class="column__detail-value">${appointment.municipality}, ${appointment.barangay}, Marinduqe</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Note:</span>
                <span class="column__detail-value scrollable-text" id="clinical-signs-display">${clinicalSignsHTML}</span>
              </p>
            </div>
            <div class="column right"> 
              <p class="column__detail">
                <span class="column__detail-label">Swine Type:</span>
                <span class="column__detail-value">${appointment.swineType}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Swine Count:</span>
                <span class="column__detail-value">${appointment.swineCount}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Medicine:</span>
                <span class="column__detail-value">${medicineName}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Medicine Amount:</span>
                <span class="column__detail-value amount">${appointment.medicineAmount ? appointment.medicineAmount : 'Not set'} <span class="amount">(ml)</span></span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Personnel:</span>
                <span class="column__detail-value">${TechnicianName}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Email:</span>
                <span class="column__detail-value email">${appointment.clientEmail}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Phone:</span>
                <span class="column__detail-value">0${appointment.contactNum}</span>
              </p>
            </div>
          </div>
          <div class="buttons-container">
            <button data-appointment-id=${appointment._id} id="print-download-btn" class="print-download-btn btn">Print & Download</button>
            <button data-appointment-id=${appointment._id} id="restore-btn" class="restore-btn btn" ${role[0] === 'admin' ? 'disabled' : ''}>Restore</button>
            <button data-appointment-id=${appointment._id} id="delete-btn" class="delete-btn btn" ${role[0] === 'admin' ? 'disabled' : ''}>Delete</button>
          </div>
        </div>
      </div>
    `;
  }

  if (table) table.innerHTML = appointmentTableHTML;

  document.dispatchEvent(new Event('renderAppointments'));
}

// ======================================
// ==========Admin Page Appointment Table
// ======================================
async function adminPageAppointmentTable(appointments, table) {
  let appointmentTableHTML = '';
  
  if (appointments.length === 0) {
    appointmentTableHTML = `
      <div class="no-service-card">
        <p class='no-service__header'>No Appointments<p>
        <p class='no-service__ds'>It will be displayed if there is an accepted one.<p>
      </div>
    `;
    table.innerHTML = appointmentTableHTML;
  }

  for (const appointment of appointments) {
    const serviceName = await getServiceName(appointment.appointmentService);

    appointmentTableHTML +=  `
      <div class="appointment status-${appointment.appointmentStatus}" data-id=${appointment._id}>
        <div class="appointment__details">
          <p class="td first-name">${appointment.clientFirstname}</p>
          <p class="td last-name">${appointment.clientLastname}</p>
          <p class="td appointment-name">${serviceName}</p>
          <p class="td date-time">${formattedDate(appointment.appointmentDate)} at ${formatTo12HourTime(appointment.appointmentTime)}</p>
          <p class="td status status--${appointment.appointmentStatus.toLowerCase()}"
                              data-status-value=${appointment.appointmentStatus.toLowerCase()}>
                              ${appointment.appointmentStatus}
          </p>
          <p class="td toggle-more-details-btn" data-value="toggle-more-details">View</p>  
        </div>
        <div class="appointment__more-details">
          <div class="appointment__more-details-heading">Appointment Details:</div>
          <div class="appointment__more-details-columns">
            <!-- more details left column -->
            <div class="column left">
              <p class="column__detail">
                <span class="column__detail-label">Appointment ID:</span>
                <span class="column__detail-value">${appointment._id}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Appointment Type:</span>
                <span class="column__detail-value">${appointment.appointmentType}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Date sent:</span>
                <span class="column__detail-value appointment-date-send">${formattedDate(appointment.createdAt)}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Actual Schedule:</span>
                <span class="column__detail-value">${formattedDate(appointment.appointmentDate)} at ${formatTo12HourTime(appointment.appointmentTime)}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Adress:</span>
                <span class="column__detail-value">${appointment.municipality}, ${appointment.barangay}, Marinduqe</span>
              </p>
            </div>
            <!-- more details right column -->
            <div class="column right"> 
              <p class="column__detail">
                <span class="column__detail-label">Swine Type:</span>
                <span class="column__detail-value">${appointment.swineType}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Swine Count:</span>
                <span class="column__detail-value">${appointment.swineCount}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Medicine:</span>
                <span class="column__detail-value">${appointment.medicine ? appointment.medicine : 'not set'}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Medicine Amount:</span>
                <span class="column__detail-value amount">${appointment.medicineAmount ? appointment.medicineAmount : 'Not set'} <span class="amount">(ml)</span></span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Personnel:</span>
                <span class="column__detail-value">${appointment.vetPersonnel}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Email:</span>
                <span class="column__detail-value email">${appointment.clientEmail}</span>
              </p>
              <p class="column__detail">
                <span class="column__detail-label">Phone:</span>
                <span class="column__detail-value">0${appointment.contactNum}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      `;
  };


  if(table) table.innerHTML = appointmentTableHTML;

  document.dispatchEvent(new Event('renderAppointments')); 
}


export {appointmentsTable, adminPageAppointmentTable};

