const toggleAppointentDetails = () => {
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
}

const changeColorStatus = (value, element) =>{
    if (value === 'pending') {
      element.style.setProperty('--color', 'rgb(37, 37, 37)');
      element.style.setProperty('--BGcolor', 'rgba(0, 0, 0, 0.19)');
    } else if (value === 'ongoing') {
      element.style.setProperty('--color', 'rgb(55, 119, 255)');
      element.style.setProperty('--BGcolor', 'rgba(73, 130, 254, 0.24)');
    } else if (value === 'completed') {
      element.style.setProperty('--color', 'rgb(0, 153, 71)');
      element.style.setProperty('--BGcolor', 'rgba(29, 255, 135, 0.13)');
    } else if (value === 'reschedule') {
      element.style.setProperty('--color', 'rgb(153, 115, 0)');
      element.style.setProperty('--BGcolor', 'rgba(255, 191, 0, 0.30)');
    } else if (value === 'removed'){
      element.style.setProperty('--color', 'rgb(210, 17, 17)'); 
      element.style.setProperty('--BGcolor', 'rgba(226, 35, 35, 0.21)');
    } else{
      element.style.setProperty('--color', 'var(--main-color)');
      element.style.setProperty('--BGcolor', 'rgba(29, 255, 135, 0.67)');
    }
}

const appointmentStatusColor = () => {
  const appointments = document.querySelectorAll('.appointment-table .appointment'); 
  appointments.forEach(appointment => {
    const status = appointment.querySelector('.status');
    const statusValue =  status.innerText.toLowerCase();
    changeColorStatus(statusValue, status)
  });
}

const filterAppointment = () => {
  const selectStatus = document.querySelector('.filter-apointments-status');

  selectStatus.addEventListener('change', () => {
    const selectedValue = selectStatus.value.toLowerCase();
    changeColorStatus(selectedValue, selectStatus);

    document.querySelectorAll('.appointment-table .appointment .td.status')
      .forEach(status => {
        const statusValue = status.innerText.toLowerCase();
        const appointment = status.parentElement.parentElement;
        appointment.style.display = 'none';

        if(selectedValue === 'all'){
          const appointment = status.parentElement.parentElement;
          appointment.style.display = 'block';
        } else if (selectedValue === statusValue) {
          const appointment = status.parentElement.parentElement;
          appointment.style.display = 'block';
        }
    });
  });
}

const addAppointment = () => {
  const addAppointmentForm = document.querySelector('.add-appointment-container');

  const addAppointmentBtn = document.querySelector('.appointment-section__add-btn')
    .addEventListener('click', () => addAppointmentForm.style.display = 'block');

  const closeFormBtn = document.querySelector('.add-appointment-container__close-form-btn')
    .addEventListener('click', () => addAppointmentForm.style.display = 'none');
}

const searchAppointment = () => {
  const input = document.querySelector('.appointment-section__search-input');
  const appointments = document.querySelectorAll('.appointment');

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
};


export {toggleAppointentDetails, appointmentStatusColor, filterAppointment, addAppointment, searchAppointment}