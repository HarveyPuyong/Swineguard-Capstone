import {fetchAppointments} from "../../../admin/api/fetch-appointments.js"
import { getServiceName } from "../../../admin/api/fetch-services.js";
import { formatedDateForCalendar, formatTo12HourTime } from "../../../admin/utils/formated-date-time.js";
import fetchClient from "../auth/fetch-client.js"
import { fetchSchedules } from "../../../admin/api/fetch-schedules.js";
import { getTechnicianName } from "../../../admin/api/fetch-technicians.js";


// ======================================
// ========== Display Calendar 
// ======================================
const renderCalendar = async() => {
    const calendarContainer = document.querySelector('.client-schedule-container');

    try {
        const data = await fetchAppointments();
        const user = await fetchClient();
        const { _id } = user;

        const appointments = data.filter(appointment => appointment.appointmentStatus === 'accepted' || appointment.appointmentStatus === 'accepted');

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
            const calendar = new FullCalendar.Calendar(calendarContainer, {
                initialView: 'dayGridMonth',
                events: events,
                eventContent: (content) => {
                const event = content.event;
                const {appointmentId, appointmentService, appointmentTime} = event.extendedProps;

                return {
                    html: `
                    <div class="client-appointment-schedule"  data-appointment-id=${appointmentId}>
                        <p class="custom-event__title">${appointmentService}</p>
                        <p class="custom-event__time">${formatTo12HourTime(appointmentTime)}</p>
                    </div>
                    `
                };
                }
            });

            calendar.render();

    } catch (err) {
        console.error('Error loading appointments:', err);
    }

}

async function renderAppointmentCalendar() {
  const appointmentCalendarElement = document.querySelector('.client-schedule-container');

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
          start: sched.date, // ISO string from DB
          allDay: true,
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
  const user = await fetchClient();
  const userRole = user.roles[0];
  const userId = user._id;

  // Format date
  const dateObj = new Date(clickedDate);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateTitle.textContent = dateObj.toLocaleDateString('en-US', options);

  // Filter tasks for that day
  //const tasksForDay = allEvents.filter((e) => e.start.startsWith(clickedDate));
  // Filter tasks for that day
  const tasksForDay = allEvents.filter((e) => {
    const eventDate = new Date(e.start);
    const clicked = new Date(clickedDate);
    return eventDate.toDateString() === clicked.toDateString();
  });

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

  // User: request appointment
  if (userRole === 'user') {
    const clicked = new Date(clickedDate);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (clicked >= today) { 
        taskList.insertAdjacentHTML(
            'beforeend',
            `<button class="request-appointment-btn__calendar">Request Appointment</button>`
        );

        const requestBtn = taskList.querySelector(".request-appointment-btn__calendar");
        requestBtn.addEventListener("click", () => {
            //alert("Request Appointment at Date:" + clickedDate);
            const form = document.querySelector('#request-appointment-form');
            const popUpTasks = document.querySelector('.pop-up__calendar-tasks');
            form.classList.add('show');
            overlay.classList.remove('show');
            popUpTasks.classList.remove('hide');

            document.querySelector('#input-date').value = clickedDate;
        });
    }
    
  }

  overlay.classList.add('show');

  // Close overlay
  closeBtn.onclick = () => overlay.classList.remove('show');
  overlay.onclick = (e) => {
    const popUpTasks = document.querySelector('.pop-up__calendar-tasks');
    if (e.target === overlay) {
      overlay.classList.remove('show');
      popUpTasks.classList.remove('hide');
    }
  };
}


export default function handleClientCalendarContent(){
    renderAppointmentCalendar();
}