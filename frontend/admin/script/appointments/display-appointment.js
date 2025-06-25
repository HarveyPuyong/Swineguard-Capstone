const handleRenderAppointments = async() => {
  try {
    const response = await axios.get('http://localhost:2500/appointment/all', {withCredentials: true});

    const data = response?.data;

    let appointmentTableHTML = '';

    data.forEach(appointment => {
      appointmentTableHTML +=  `
        <div class="appointment status-${appointment.appointmentStatus}" data-id=${appointment._id}>
          <div class="appointment__details">
            <p class="td first-name">${appointment.clientFirstname}</p>
            <p class="td last-name">${appointment.clientLastname}</p>
            <p class="td appointment-name">${appointment.appointmentTitle}</p>
            <p class="td date-time">${appointment.appointmentDate} at ${appointment.appointmentTime}</p>
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
                  <span class="column__detail-value appointment-date-send">${appointment.createdAt}</span>
                </p>
                <p class="column__detail">
                  <span class="column__detail-label">Actual Schedule:</span>
                  <span class="column__detail-value">${appointment.appointmentDate} at ${appointment.appointmentTime}</span>
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
                <button class="completed-btn btn">Completed</button>
                <button class="set-schedule-btn btn">Set Schedule</button>
                <button class="restore-btn btn">Restore</button>
                <button class="delete-btn btn">Delete</button>
            </div>
          </div>
        </div>
        `;
    });


    const appointmentsTables = document.querySelectorAll('.appointment-table')
      .forEach(table => {
        const tableBody = table.querySelector('.appointment-table__tbody');
        tableBody.innerHTML = appointmentTableHTML;
    });

    /// Custom event na magagamit lang pagkatapos ma render lahat ng appointment data
    // — ginagamit ito para gumana ang search filter at ibang functionality na kelangan ng data
    document.dispatchEvent(new Event('renderAppointments')); 
  } catch (error) {
    console.log(error)
  }
}

export default handleRenderAppointments;