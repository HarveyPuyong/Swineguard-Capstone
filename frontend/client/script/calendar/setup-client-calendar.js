import handleClientCalendarContent from "./client-calendar.js";

const toggleCalendar = () => {
    const scheduleBtn = document.querySelector('#appointments-section .go-to-schedules-section-btn');
    const backBtn = document.querySelector('#appointments-section .back-to-appointment-list-btn');

    const calendarContainer = document.querySelector('#appointments-section .client-schedule-container');
    const appointmentListContainer = document.querySelector('#appointments-section .appointments-card-list');

    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', () => {
            backBtn.classList.add('show');
            calendarContainer.classList.add('show');
            appointmentListContainer.classList.add('hide');
            scheduleBtn.classList.add('hide');

            handleClientCalendarContent();
        })
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            backBtn.classList.remove('show');
            calendarContainer.classList.remove('show');
            scheduleBtn.classList.remove('hide');
            calendarContainer.classList.add('hide');
            appointmentListContainer.classList.remove('hide');
            appointmentListContainer.classList.add('show');
        })
    }

}

export default function handleClientSchedule () {
    toggleCalendar();
}