import { fetchSchedules } from "../../api/fetch-schedules.js";
import fetchUser from "../auth/fetchUser.js";
import { formattedDate } from "../../utils/formated-date-time.js";

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
}



export {
    renderSchedulesFromCalendar
}