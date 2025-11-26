import { fetchAppointments } from './../../api/fetch-appointments.js';
import { formatedDateForCalendar, formatTo12HourTime, formattedDate } from './../../utils/formated-date-time.js';
import { getServiceName } from '../../api/fetch-services.js';
import { getTechnicianName } from '../../api/fetch-technicians.js';
import fetchUser from '../auth/fetchUser.js';


// ======================================
// ========== Render Calendar
// ======================================
async function renderAppointmentCalendar() {
  const appointmentCalendarElement = document.getElementById('appointment-schedule-calendar');

  try {
    const data = await fetchAppointments();


    const appointments = data.filter(
      (appointment) =>
        appointment.appointmentStatus === 'accepted' ||
        appointment.appointmentStatus === 'reschedule'
    );

    // appointments custom event
    const events = await Promise.all(
      appointments.map(async (appointment) => {
        const serviceName = await getServiceName(appointment.appointmentService);
        const technicianName = await getTechnicianName(appointment.vetPersonnel);

        return {
          start: `${formatedDateForCalendar(appointment.appointmentDate)}T${appointment.appointmentTime}`,
          title: serviceName,
          appointmentId: appointment._id,
          appointmentService: serviceName,
          appointmentType: appointment.appointmentType,
          appointmentTime: appointment.appointmentTime,
          appointmentAdress: `${appointment.municipality}, ${appointment.barangay}`,
          appointmentPersonnel: technicianName,
        };
      })
    );

    // calendar
    const calendar = new FullCalendar.Calendar(appointmentCalendarElement, {
      initialView: 'dayGridMonth',
      events: events,

      eventContent: (content) => {
        const event = content.event;
        const {
          appointmentId,
          appointmentService,
          appointmentType,
          appointmentTime,
          appointmentAdress,
          appointmentPersonnel,
        } = event.extendedProps;

        return {
          html: `
            <div class="custom-event appointment-type-${appointmentType.toLowerCase()}" data-appointment-id="${appointmentId}">
              <p class="custom-event__title"> ${appointmentService}</p>
              <p class="custom-event__time">${formatTo12HourTime(appointmentTime)}</p>
            </div>
          `,
        };
      },

      // <p class="custom-event__type"><span class="label">Type:</span> ${
      //   appointmentType[0].toUpperCase() + appointmentType.slice(1).toLowerCase()
      // }</p>

      
      dateClick: function (info) {
        const clickedDate = info.dateStr;
        showAppointmentsForDate(clickedDate, events);
      },
    });

    calendar.render();
  } catch (err) {
    console.error('Error loading appointments:', err);
  }
}



// ======================================
// ========== Show Appointments for Date
// ======================================
async function showAppointmentsForDate(clickedDate, events) {
  const overlay = document.querySelector('.calendar-overlay');
  const dateTitle = document.querySelector('.current-clicked-date');
  const taskList = document.querySelector('.task-list__for-the-day');
  const closeBtn = document.querySelector('.close-calendar-popup');

  //User Role
  const user = await fetchUser();
  const role = user.roles;
  const userRole = role[0];

  // Format readable date
  const dateObj = new Date(clickedDate);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateTitle.textContent = dateObj.toLocaleDateString('en-US', options);

  // Filter events matching that date
  const tasksForDay = events.filter((e) => e.start.startsWith(clickedDate));

  // Render them in the popup
  if (tasksForDay.length === 0) {
    taskList.innerHTML = `<p>No appointments on this date.</p>`;
  } else {
    taskList.innerHTML = tasksForDay
      .map(
        (e) => `
        <div class="calendar-task">
          <p><strong>${e.appointmentService}</strong></p>
          <p>Type: ${e.appointmentType}</p>
          <p>Time: ${formatTo12HourTime(e.appointmentTime)}</p>
          <p>Address: ${e.appointmentAdress}</p>
          <p>Personnel: ${e.appointmentPersonnel}</p>
          <hr>
        </div>
      `
      )
      .join('');
  }

  // 👉 Add Task Button for allowed roles
  const allowedRoles = ["veterinarian", "user"];
  // Allowed roles
  if (userRole === 'veterinarian') {
    const clicked = new Date(clickedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = clicked < today;

    if (!isPast) {
      taskList.insertAdjacentHTML(
        "beforeend",
        `<button class="add-schedule-btn">+ New Schedule</button>`
      );

      const newScheduleBtn = taskList.querySelector(".add-schedule-btn");
      const newScheduleForm = document.querySelector(".vet-schedule-form");
      const popUpTasks = document.querySelector(".pop-up__calendar-tasks");

      newScheduleBtn.addEventListener("click", () => {
        newScheduleForm.classList.add("show");
        popUpTasks.classList.add("hide");
        document.getElementById('clicked-date').textContent = `Date: ${formattedDate(clickedDate)}`;
      });
    }
  }

  if (userRole === 'user') {
    taskList.insertAdjacentHTML(
      "beforeend",
      `<button class="request-appointment-btn__calendar">Request Appointment</button>`
    );

    const requestBtn = taskList.querySelector(".request-appointment-btn__calendar");

    requestBtn.addEventListener("click", () => {
      alert("Request Appointment at Date:" + clickedDate);
    });
  }


  overlay.classList.add('show');

  // Close functionality
  closeBtn.onclick = () => overlay.classList.remove('show');
  overlay.onclick = (e) => {
    const newScheduleForm = document.querySelector('.vet-schedule-form');
    const popUpTasks = document.querySelector('.pop-up__calendar-tasks');

    // Clicked exactly outside (the overlay)
    if (e.target === overlay) {
      overlay.classList.remove('show');          // close popup
      newScheduleForm.classList.remove('show');  // hide form
      popUpTasks.classList.remove('hide');       // show tasks again
    }
  };
}



// ======================================
// ========== Compute Appointments Types
// ======================================
async function computeVisitAndServicePercentages() {
  try {
    const appointments = await fetchAppointments();
    const total = appointments.length;

    let serviceCount = 0;
    let visitCount = 0;

    appointments.forEach((appointment) => {
      if (appointment.appointmentType === 'service') {
        serviceCount++;
      } else if (appointment.appointmentType === 'visit') {
        visitCount++;
      }
    });

    const servicePercent = Math.round((serviceCount / total) * 100);
    const visitPercent = Math.round((visitCount / total) * 100);

    document.querySelector(
      '.total-service-type .appointment-schedule-container__total--value'
    ).innerHTML = `${servicePercent}<span class="percent-value">%</span>`;
    document.querySelector(
      '.total-visit-type .appointment-schedule-container__total--value'
    ).innerHTML = `${visitPercent}<span class="percent-value">%</span>`;
  } catch (error) {
    console.log(error);
  }
}

// ======================================
// ========== Default Export
// ======================================
export default function handleAppointmentCalendarContent() {
  renderAppointmentCalendar();
  computeVisitAndServicePercentages();

  // 👉 Add Back button listener ONCE here
  const backBtn = document.getElementById('schedule__back-btn');
  const newScheduleForm = document.querySelector('.vet-schedule-form');
  const popUpTasks = document.querySelector('.pop-up__calendar-tasks');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      newScheduleForm.classList.remove('show');
      popUpTasks.classList.remove('hide');
    });
  }
}
