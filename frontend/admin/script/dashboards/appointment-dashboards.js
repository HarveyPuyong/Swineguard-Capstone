import toPercent from "../../utils/toPercent.js";


const appointmentsDashboard = async () => {
  try {
    const response = await axios.get('http://localhost:2500/appointment/all', { withCredentials: true });

    const appointments = response?.data;

    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(app => app.appointmentStatus === 'pending').length;
    const ongoingAppointments = appointments.filter(app => app.appointmentStatus === 'ongoing').length;
    const completedAppointments = appointments.filter(app => app.appointmentStatus === 'completed').length;
    const rescheduleAppointments = appointments.filter(app => app.appointmentStatus === 'reschedule').length;

    const pendingPercent = toPercent(pendingAppointments, totalAppointments);
    const ongoingPercent = toPercent(ongoingAppointments, totalAppointments);
    const completedPercent = toPercent(completedAppointments, totalAppointments);
    const reschedulePercent = toPercent(rescheduleAppointments, totalAppointments);


    const dashboardHTML = `
          <div class="dashboard__card total-appointments total-card">
            <img class="dashboard__card-icon" src="images-and-icons/icons/appointment-icon.png" alt="calendar-icon" >
            <p class="dashboard__card-label">
              Total Appointments: 
              <span class="dashboard__card-label--value">${totalAppointments}</span>
            </p>
          </div>
          <div class="dashboard__card completed-appointments">
            <p class="dashboard__card-label">
              Completed: 
              <span class="dashboard__card-label--value">${completedAppointments}</span>
            </p>
            <div class="dashboard__card-progress-bar-container">
              <div class="dashboard__card-progress-bar">
                <div class="dashboard__card-progress-barOverflow"></div>
                <div class="dashboard__card-progress-value" style="width:${completedPercent}%"></div>
              </div>
              <div class="dashboard__card-progress-slicer"></div>
              <p class="dashboard__card-progress-txt">${completedPercent}%</p>
            </div>
          </div>
          <div class="dashboard__card pending-appointments">
            <p class="dashboard__card-label">
              Pending: 
              <span class="dashboard__card-label--value">${pendingAppointments}</span>
            </p>
            <div class="dashboard__card-progress-bar-container">
              <div class="dashboard__card-progress-bar">
                <div class="dashboard__card-progress-barOverflow"></div>
                <div class="dashboard__card-progress-value" style="width:${pendingPercent}%"></div>
              </div>
              <div class="dashboard__card-progress-slicer"></div>
              <p class="dashboard__card-progress-txt">${pendingPercent}%</p>
            </div>
          </div>
          <div class="dashboard__card ongoing-appointments">
            <p class="dashboard__card-label">
              Ongoing: 
              <span class="dashboard__card-label--value">${ongoingAppointments}</span>
            </p>
            <div class="dashboard__card-progress-bar-container">
              <div class="dashboard__card-progress-bar">
                <div class="dashboard__card-progress-barOverflow"></div>
                <div class="dashboard__card-progress-value" style="width:${ongoingPercent}%"></div>
              </div>
              <div class="dashboard__card-progress-slicer"></div>
              <p class="dashboard__card-progress-txt">${ongoingPercent}%</p>
            </div>
          </div>
          <div class="dashboard__card reschedule-appointments">
            <p class="dashboard__card-label">
              Reschedule: 
              <span class="dashboard__card-label--value">${rescheduleAppointments}</span>
            </p>
            <div class="dashboard__card-progress-bar-container">
              <div class="dashboard__card-progress-bar">
                <div class="dashboard__card-progress-barOverflow"></div>
                <div class="dashboard__card-progress-value" style="width:${reschedulePercent}%"></div>
              </div>
              <div class="dashboard__card-progress-slicer"></div>
              <p class="dashboard__card-progress-txt">${reschedulePercent}%</p>
            </div>
          </div>
    `;

    document.querySelector('.appointment-dashboard .dashboard__cards-container').innerHTML = dashboardHTML;

  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};


export default appointmentsDashboard;