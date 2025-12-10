import handleClientCalendarContent from "./client-calendar.js";

const toggleCalendar = () => {
    const scheduleBtn = document.querySelector('#appointments-section .go-to-schedules-section-btn');
    const backBtn = document.querySelector('#appointments-section .back-to-appointment-list-btn');

    const calendarContainer = document.querySelector('#appointments-section .client-schedule-container');
    const appointmentListContainer = document.querySelector('#appointments-section .appointments-card-list');

    const legendContainer = document.querySelector('.appointment-schedule-container__type-identifier-container');

    const filterSelectTag = document.querySelector('.filter-appointments__select-tag');

    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', () => {
            backBtn.classList.add('show');
            calendarContainer.classList.add('show');
            appointmentListContainer.classList.add('hide');
            scheduleBtn.classList.add('hide');

            filterSelectTag.style.display = "none";

            legendContainer.classList.add('show');

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
            filterSelectTag.style.display = "flex";
            legendContainer.classList.remove('show');
        })
    }

}

export default function handleClientSchedule () {
    toggleCalendar();
}