import { fetchAppointments } from './../../api/fetch-appointments.js';
import { formatedDateForCalendar, formatTo12HourTime, formattedDate } from './../../utils/formated-date-time.js';
import { getServiceName } from '../../api/fetch-services.js';
import { getTechnicianName } from '../../api/fetch-technicians.js';
import fetchUser from '../auth/fetchUser.js';
import { handleAddNewSchedule } from '../veterinarian/handle-schedule-from-calendar.js';
import { fetchSchedules } from "../../api/fetch-schedules.js";

// ======================================
// ========== Render Calendar
// ======================================
async function renderAppointmentCalendar() {
  const appointmentCalendarElement = document.getElementById('appointment-schedule-calendar');

  try {
    const data = await fetchAppointments();
    const vetPersonalSched = await fetchSchedules();

    const appointments = data.filter(
      (appointment) =>
        appointment.appointmentStatus === 'accepted' ||
        appointment.appointmentStatus === 'reschedule'
    );

    // Map Appointments
    const appointmentEvents = await Promise.all(
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
          type: 'appointment',
        };
      })
    );

    // Map Vet Personal Schedules
    const personalEvents = await Promise.all(
      vetPersonalSched.map(async (sched) => {
        const technicianName = await getTechnicianName(sched.userId);

        return {
          start: formatedDateForCalendar(sched.date),
          title: sched.title,
          description: sched.description,
          veterinarian: technicianName, // display this in the calendar popup
          type: 'personal',
          classNames: ['vet-personal-event'],
        };
      })
    );

    // Combine both
    const allEvents = [...appointmentEvents, ...personalEvents];

    // Calendar
    const calendar = new FullCalendar.Calendar(appointmentCalendarElement, {
      initialView: 'dayGridMonth',
      events: allEvents,
      eventContent: (content) => {
        const event = content.event;
        if (event.extendedProps.type === 'personal') {
          return {
            html: `<div class="vet-personal-event-box">${event.title}</div>`,
          };
        }
        const { appointmentService, appointmentType, appointmentTime } = event.extendedProps;
        return {
          html: `
            <div class="custom-event appointment-type-${appointmentType.toLowerCase()}">
              <p class="custom-event__title">${appointmentService}</p>
              <p class="custom-event__time">${formatTo12HourTime(appointmentTime)}</p>
            </div>
          `,
        };
      },
      dateClick: function (info) {
        showAppointmentsForDate(info.dateStr, allEvents);
      },
    });

    calendar.render();
  } catch (err) {
    console.error('Error loading appointments:', err);
  }
}

// ======================================
// ========== Show Appointments & Personal Schedules
// ======================================
async function showAppointmentsForDate(clickedDate, allEvents) {
  const overlay = document.querySelector('.calendar-overlay');
  const dateTitle = document.querySelector('.current-clicked-date');
  const taskList = document.querySelector('.task-list__for-the-day');
  const closeBtn = document.querySelector('.close-calendar-popup');

  // User Role
  const user = await fetchUser();
  const userRole = user.roles[0];
  const userId = user._id;

  // Format date
  const dateObj = new Date(clickedDate);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateTitle.textContent = dateObj.toLocaleDateString('en-US', options);

  // Filter tasks for that day
  const tasksForDay = allEvents.filter((e) => e.start.startsWith(clickedDate));

  if (tasksForDay.length === 0) {
    taskList.innerHTML = `<p>No tasks on this date.</p>`;
  } else {
    // Separate by type
    let html = '';

    const personal = tasksForDay.filter(e => e.type === 'personal');
    const appointments = tasksForDay.filter(e => e.type === 'appointment');

    if (personal.length) {
      html += `<h3>Personal Schedule</h3>`;
      html += personal.map(e => `
        <div class="calendar-task personal-sched">
          <p><strong>📌 ${e.title}</strong></p>
          <p>Vet: ${e.veterinarian}</p>
          <p>Description: ${e.description || 'No description'}</p>
        </div><hr>
      `).join('');
    }

    if (appointments.length) {
      html += `<h3>Appointments</h3>`;
      html += appointments.map(e => `
        <div class="calendar-task">
          <p><strong>${e.appointmentService}</strong></p>
          <p>Type: ${e.appointmentType}</p>
          <p>Time: ${formatTo12HourTime(e.appointmentTime)}</p>
          <p>Address: ${e.appointmentAdress}</p>
          <p>Personnel: ${e.appointmentPersonnel}</p>
        </div><hr>
      `).join('');
    }

    taskList.innerHTML = html;
  }

  // Veterinarian: add new schedule
  if (userRole === 'veterinarian') {
    const clicked = new Date(clickedDate);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (clicked >= today) {
      taskList.insertAdjacentHTML(
        'beforeend',
        `<button class="add-schedule-btn">+ New Schedule</button>`
      );

      const newScheduleBtn = taskList.querySelector(".add-schedule-btn");
      const newScheduleForm = document.querySelector(".vet-schedule-form");
      const popUpTasks = document.querySelector(".pop-up__calendar-tasks");

      newScheduleBtn.addEventListener('click', () => {
        newScheduleForm.classList.add('show');
        popUpTasks.classList.add('hide');
        document.getElementById('clicked-date').textContent = `Date: ${formattedDate(clickedDate)}`;
        handleAddNewSchedule(clickedDate, userId);
        renderAppointmentCalendar();
      });
    }
  }



  overlay.classList.add('show');

  // Close overlay
  closeBtn.onclick = () => overlay.classList.remove('show');
  overlay.onclick = (e) => {
    const newScheduleForm = document.querySelector('.vet-schedule-form');
    const popUpTasks = document.querySelector('.pop-up__calendar-tasks');
    if (e.target === overlay) {
      overlay.classList.remove('show');
      newScheduleForm.classList.remove('show');
      popUpTasks.classList.remove('hide');
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
// ========== Export
// ======================================
export default function handleAppointmentCalendarContent() {
  renderAppointmentCalendar();
  computeVisitAndServicePercentages();

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