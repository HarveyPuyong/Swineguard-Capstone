import { fetchAppointments } from "../../api/fetch-appointments.js";
import { formatTo12HourTime, formattedDate } from "../../utils/formated-date-time.js";
import { getServiceName } from "../../api/fetch-services.js";

const handleNotification = () => {
    const notifBtn = document.querySelector('.header__notification');
    const notifContainer = document.querySelector('.notification');

    notifBtn.addEventListener('click', () => {
        notifContainer.classList.toggle('show');
        notifContainer.classList.toggle('hide');
    });
};

const displayNotificationList = async() => {
    const appointments = await fetchAppointments();
    const filteredAppointment = appointments.filter(appointment => appointment.appointmentStatus === 'pending');

    let notificationHTML = '';

    for (const appt of filteredAppointment) {
        const serviceName = await getServiceName(appt.appointmentService);
        notificationHTML += `
            <div class="notif">
                <p class="notif-title">New Pending Appointment</p>
                <p class="notif-short-text">Raiser request <strong>${serviceName}</strong> services on ${formattedDate(appt.appointmentDate)} at ${formatTo12HourTime(appt.appointmentTime)}</p>
                <p class="notif-user-name">Requested by ${appt.clientFirstname}</p>
            </div>
        `;
    };

    document.querySelector('.notification .notif-list').innerHTML = notificationHTML;
    document.dispatchEvent(new Event('renderNotification'));

    const notifCountTag = document.querySelector('.header__notification-label').textContent = filteredAppointment.length;
}


export {
    handleNotification,
    displayNotificationList
};