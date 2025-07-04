import { formattedDate, formatTo12HourTime } from './formated-date-time.js';


function renderAppointmentsTable(appointments, table) {
    let appointmentTableHTML = '';

    appointments.forEach(appointment => {
      appointmentTableHTML +=  `
        <div class="appointment status-${appointment.appointmentStatus}" data-id=${appointment._id}>
          <div class="appointment__details">
            <p class="td first-name">${appointment.clientFirstname}</p>
            <p class="td last-name">${appointment.clientLastname}</p>
            <p class="td appointment-name">${appointment.appointmentTitle}</p>
            <p class="td date-time">${formattedDate(appointment.appointmentDate)} at ${formatTo12HourTime(appointment.appointmentTime)}</p>
            <p class="td status status--${appointment.appointmentStatus.toLowerCase()}"
                                data-status-value=${appointment.appointmentStatus.toLowerCase()}>
                                ${appointment.appointmentStatus}
            </p>
            <p class="td action">
              <select class="select-appointment-action" data-appointment-id=${appointment._id} name="appointment-action" id="appointment-action">
                <option value="">Action</option>
                <option value="accept">Accept</option>
                <option value="reschedule">Reschedule</option>
                <option value="remove">Remove</option>
              </select> 
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
                  <span class="column__detail-label">Vaccine</span>
                  <span class="column__detail-value">${appointment.medicine}</span>
                </p>
                <p class="column__detail">
                  <span class="column__detail-label">Dosage:</span>
                  <span class="column__detail-value">${appointment.dosage}</span>
                </p>
                <p class="column__detail">
                  <span class="column__detail-label">Personnel:</span>
                  <span class="column__detail-value">${appointment.vetPersonnel}</span>
                </p>
                <p class="column__detail">
                  <span class="column__detail-label">Email:</span>
                  <span class="column__detail-value">${appointment.clientEmail}</span>
                </p>
                <p class="column__detail">
                  <span class="column__detail-label">Phone:</span>
                  <span class="column__detail-value">0${appointment.contactNum}</span>
                </p>
              </div>
            </div>
            <div class="buttons-container">
                <button data-appointment-id=${appointment._id} id="completed-btn" class="completed-btn btn">Completed</button>
                <button data-appointment-id=${appointment._id} id="set-schedule-btn" class="set-schedule-btn btn">Set Schedule</button>
                <button data-appointment-id=${appointment._id} id="restore-btn" class="restore-btn btn">Restore</button>
                <button data-appointment-id=${appointment._id} id="delete-btn" class="delete-btn btn">Delete</button>
            </div>
          </div>
        </div>
        `;
    });


    if(table) table.innerHTML = appointmentTableHTML;

    document.dispatchEvent(new Event('renderAppointments')); 
}


export default renderAppointmentsTable;