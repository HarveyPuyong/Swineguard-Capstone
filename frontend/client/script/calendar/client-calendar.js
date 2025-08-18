import {fetchAppointments} from "../../../admin/api/fetch-appointments.js"
import { getServiceName } from "../../../admin/api/fetch-services.js";
import { formatedDateForCalendar, formatTo12HourTime } from "../../../admin/utils/formated-date-time.js";
import fetchClient from "../auth/fetch-client.js"


// ======================================
// ========== Display Calendar 
// ======================================
const renderCalendar = async() => {
    const calendarContainer = document.querySelector('.client-schedule-container');

    try {
        const data = await fetchAppointments();
        const user = await fetchClient();
        const { _id } = user;

        const appointments = data.filter(appointment => appointment.appointmentStatus === 'accepted' && appointment.clientId === _id);

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

export default function handleClientCalendarContent(){
    renderCalendar();
}