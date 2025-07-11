import { fetchAppointments } from './../../api/fetch-appointments.js';
import { formatedDateForCalendar, formatTo12HourTime } from './../../utils/formated-date-time.js';
import { getServiceName } from '../../api/fetch-services.js';



// ======================================
// ========== Render Calendar
// ======================================
async function renderAppointmentCalendar() {
  const appointmentCalendarElement = document.getElementById('appointment-schedule-calendar');


  try {
const data = await fetchAppointments();

const appointments = data.filter(appointment => appointment.appointmentStatus === 'accepted');

    // appointments custom event
    const events = await Promise.all(
      appointments.map(async (appointment) => {
        const serviceName = await getServiceName(appointment.appointmentService);

        return {
          start: `${formatedDateForCalendar(appointment.appointmentDate)}T${appointment.appointmentTime}`,
          title: serviceName,
          appointmentId: appointment._id,
          appointmentService: serviceName,
          appointmentType: appointment.appointmentType,
          appointmentTime: appointment.appointmentTime,
          appointmentAdress: `${appointment.municipality}, ${appointment.barangay}`,
        };
      })
    );

    // calendar
    const calendar = new FullCalendar.Calendar(appointmentCalendarElement, {
      initialView: 'dayGridMonth',
      events: events,
      eventContent: (content) => {
        const event = content.event;
        const {appointmentId, appointmentService, appointmentType, appointmentTime, appointmentAdress} = event.extendedProps;

        return {
          html: `
            <div class="custom-event appointment-type-${appointmentType.toLowerCase()}"  data-appointment-id=${appointmentId}>
              <p class="custom-event__title"><span class="label">Title:</span> ${appointmentService}</p>
              <p class="custom-event__type"><span class="label">Type:</span> ${appointmentType[0].toUpperCase() + appointmentType.slice(1).toLowerCase()}</p>
              <p class="custom-event__time"><span class="label">Time:</span> ${formatTo12HourTime(appointmentTime)}</p>
              <p class="custom-event__time"><span class="label">Adress:</span> ${appointmentAdress}</p>
            </div>
          `
        };
      }
    });

    calendar.render();

  } catch (err) {
    console.error('Error loading appointments:', err);
  }
};


// ======================================
// ========== Compute Appointments TYpes
// ======================================
async function computeVisitAndServicePercentages() {
  try {
    const appointments =  await fetchAppointments();

    const total = appointments.length;

    let serviceCount = 0;
    let visitCount = 0;

    appointments.forEach(appointment => {
      if (appointment.appointmentType === 'Service' || appointment.appointmentType === 'service') {
        serviceCount++;
      } else if (appointment.appointmentType === 'Visit' || appointment.appointmentType === 'visit') {
        visitCount++;
      }
    });

    const servicePercent = Math.round((serviceCount / total) * 100);
    const visitPercent = Math.round((visitCount / total) * 100);

    document.querySelector('.total-service-type .appointment-schedule-container__total--value').innerHTML = `${servicePercent}<span class="percent-value">%</span>`;
    document.querySelector('.total-visit-type .appointment-schedule-container__total--value').innerHTML = `${visitPercent}<span class="percent-value">%</span>`;

  } catch (error) {
    console.log(error);
  }
};



export default  function handleAppointmentCalendarContent(){
  renderAppointmentCalendar();
  computeVisitAndServicePercentages()
}

