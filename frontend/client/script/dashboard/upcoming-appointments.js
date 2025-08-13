import { fetchAppointments } from "../../../admin/api/fetch-appointments.js";
import fetchClient from "../auth/fetch-client.js";
import { getServiceName } from "../../../admin/api/fetch-services.js";
import { formattedDate, formatTo12HourTime } from "../../../admin/utils/formated-date-time.js";

const displayUpcomingAppointments = async() => {

    const { _id } = await fetchClient();
    const appointments = await fetchAppointments();

    const filteredAppointments = appointments.filter((appointment) => 
                                                      appointment.clientId === _id && 
                                                      appointment.appointmentStatus === 'accepted' || 
                                                      appointment.appointmentStatus === 'pending');

    let upcomingAppointmentsHTML = '';

    for (const appointment of filteredAppointments) {
        const serviceName = await getServiceName(appointment.appointmentService);
        const date = formattedDate(appointment.appointmentDate);
        const time = formatTo12HourTime(appointment.appointmentTime);

        upcomingAppointmentsHTML += `
            <div class="vaccination">
                <p class="vaccination-title">${serviceName} <span class="upcoming-status">(${appointment.appointmentStatus})</span> </p> 
                <p class="vaccination-date">${date} at ${time}</p>
            </div>
        `;   
    }

    if (filteredAppointments.length === 0) {
        document.querySelector('.upcoming-vaccinations-list').innerHTML =`<p>No upcoming appointments</p>`;
    } else {
        document.querySelector('.upcoming-vaccinations-list').innerHTML = upcomingAppointmentsHTML;
        document.dispatchEvent(new Event('renderUpcomingAppointments'));
    }

}

export default displayUpcomingAppointments;