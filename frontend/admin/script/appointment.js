export const toggleAppointentDetails = () => {
  const appointments = document.querySelectorAll('.appointment-table .appointment')
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