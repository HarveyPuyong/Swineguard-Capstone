import { fetchSchedules } from "../../api/fetch-schedules.js";
import fetchUser from "../auth/fetchUser.js";
import { formattedDate } from "../../utils/formated-date-time.js";
import { handleEditScheduleFromSection } from "./handle-schedule-from-calendar.js";

const renderSchedulesFromCalendar = async () => {
    
    // Get Vet Id
    const user = await fetchUser();
    const vetId = user._id;

    const role = user.roles[0];

    if (role !== "veterinarian") {
        return;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    
    const vetSchedules = await fetchSchedules();
    const filterSchedule = vetSchedules.filter(sched => sched.userId === vetId);

    let todayVetSchedulesHTML = '';
    let upcomingVetSchedulesHTML = '';
    let pastVetSchedulesHTML = '';

    filterSchedule.forEach(schedule => {
        const schedDate = new Date(schedule.date).setHours(0, 0, 0, 0);

        const card = `
            <div class="schedule-card">
                <button class="vet-sched__edit-btn" data-set="${schedule._id}">Edit</button>
                <p class="schedule-heading">${formattedDate(schedule.date)}</p>
                <p><strong>Title: </strong>${schedule.title}</p>
                <p><strong>Description: </strong>${schedule.description}</p>
            </div>
        `;

        if (schedDate === today) {
            todayVetSchedulesHTML += card;

        } else if (schedDate > today) {
            // 👉 This is UPCOMING, not past
            upcomingVetSchedulesHTML += card;

        } else {
            // 👉 This is truly past
            pastVetSchedulesHTML += card;
        }
    });

    document.querySelector('.past-events').innerHTML = pastVetSchedulesHTML || "<p>No past events.</p>";
    document.querySelector('.today-events').innerHTML = todayVetSchedulesHTML || "<p>No events today.</p>";
    document.querySelector('.upcoming-events').innerHTML = upcomingVetSchedulesHTML || "<p>No upcoming events.</p>";

    handleVetScheduleEditBtn();
}



const handleVetScheduleEditBtn = async() => {
    const editBtn = document.querySelectorAll('.vet-sched__edit-btn');
    const overlay = document.querySelector('.availability-overlay');
    const setMaxAppForm = document.querySelector('.availability-set__max-appointment');
    const newScheduleForm = document.querySelector('.availability-vet-schedule-form');
    const editScheduleForm = document.querySelector('.availability-vet-schedule-form-edit');

    const saveBtn = document.getElementById('availability-chedule__save-btn-edit');
    const backBtn = document.getElementById('availability-schedule__back-btn-edit');


    editBtn.forEach(btn => {
        const id = btn.dataset.set;
        btn.addEventListener('click', () => {
            overlay.classList.add("show");
            editScheduleForm.classList.add("show");
            newScheduleForm.classList.remove("show");
            setMaxAppForm.classList.remove("show");

            // Set Up Form
            setUpEditScheduleForm(id);

            //Edit Form
            handleEditScheduleFromSection(id);
        })
    });

    backBtn.addEventListener('click', () => {
        overlay.classList.remove("show");
        editScheduleForm.classList.remove("show");
        newScheduleForm.reset();
    })
}


const setUpEditScheduleForm = async (scheduleId) => {
    // Populate the data in the Form
    const vetSchedules = await fetchSchedules();
    const filteredSchedule = vetSchedules.find(sched => sched._id === scheduleId)
    const formatToDateOnly = (isoDate) => isoDate.split("T")[0];

    document.getElementById('availability-schedule-title-edit').value = filteredSchedule.title;
    document.getElementById('availability-schedule-description-edit').value = filteredSchedule.description;
    document.getElementById('availability-schedule-date-edit').value = formatToDateOnly(filteredSchedule.date);
}


export {
    renderSchedulesFromCalendar
}