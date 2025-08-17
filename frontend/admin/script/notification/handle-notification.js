import { fetchAppointments } from "../../api/fetch-appointments.js";
import { formatTo12HourTime, formattedDate } from "../../utils/formated-date-time.js";
import { getServiceName } from "../../api/fetch-services.js";
import fetchUsers from "../../api/fetch-users.js";
import { getTechnicianName } from "../../api/fetch-technicians.js";

const handleNotification = () => {
    const notifBtn = document.querySelector('.header__notification');
    const notifContainer = document.querySelector('.notification');

    notifBtn.addEventListener('click', () => {
        notifContainer.classList.toggle('show');
        notifContainer.classList.toggle('hide');
    });
};


const displayACNotificationList = async() => {
    const appointments = await fetchAppointments();
    const filteredAppointment = appointments.filter(appt => appt.appointmentStatus === 'pending');

    let notificationHTML = '';
    let notifCount = '';

    if (filteredAppointment.length === 0) {  
        notificationHTML = `
            <div class="notif">
                <p class="notif-title">No Notification</p>
            </div>
        `;
        notifCount = ''; 
        
    } else {
        for (const appt of filteredAppointment) {
            const serviceName = await getServiceName(appt.appointmentService);
            notificationHTML += `
                <div class="notif">
                    <p class="notif-title">New Pending Appointment</p>
                    <p class="notif-short-text">Raiser request <strong>${serviceName}</strong> services on ${formattedDate(appt.appointmentDate)} at ${formatTo12HourTime(appt.appointmentTime)}</p>
                    <p class="notif-short-text">Requested by <strong>${appt.clientFirstname}</strong></p>
                </div>
            `;
        }
        notifCount = filteredAppointment.length;
    }

    document.querySelector('.notification .notif-list').innerHTML = notificationHTML;
    document.querySelector('.header__notification-label').textContent = notifCount;
    document.dispatchEvent(new Event('renderACNotification'));
}


const displayAdminNotificationList = async() => {
    const users = await fetchUsers();
    const filteredUserAccount = users.filter(user => !user.isRegistered);

    let notificationHTML = '';
    let notifCount = '';

    if (filteredUserAccount.length === 0) {  
        notificationHTML = `
            <div class="notif">
                <p class="notif-title">No Notification</p>
            </div>
        `;
        notifCount = ''; 
        
    } else {
        for (const user of filteredUserAccount) {
            notificationHTML += `
                <div class="notif">
                    <p class="notif-title">New user account created</p>
                    <p class="notif-short-text">New account created named <strong>${user.firstName}</strong></p>
                </div>
            `;
        }
        notifCount = filteredUserAccount.length;
    }

    document.querySelector('.notification .notif-list').innerHTML = notificationHTML;
    document.querySelector('.header__notification-label').textContent = notifCount;
    document.dispatchEvent(new Event('renderAdminNotification'));
}


const displayVetNotification = async(staffId) => {
    
    const appointments = await fetchAppointments();
    const filteredAppointment = appointments.filter(appointment => appointment.vetPersonnel === staffId && appointment.appointmentStatus === 'accepted');

    let notificationHTML = '';
    let notifCount = '';

    if (filteredAppointment.length === 0) {  
        notificationHTML = `
            <div class="notif">
                <p class="notif-title">No Notification</p>
            </div>
        `;
        notifCount = ''; 
        
    } else {
        for (const appointment of filteredAppointment) {
            const serviceName = await getServiceName(appointment.appointmentService);
            notificationHTML += `
                <div class="notif">
                    <p class="notif-title">New Appointment Schedule</p>
                    <p class="notif-short-text">Raiser request <strong>${serviceName}</strong> services on ${formattedDate(appointment.appointmentDate)} at ${formatTo12HourTime(appointment.appointmentTime)}</p>
                    <p class="notif-short-text">Requested by <strong>${appointment.clientFirstname}</strong></p>                
                </div>
            `;
        }
        notifCount = filteredAppointment.length;
    }

    document.querySelector('.notification .notif-list').innerHTML = notificationHTML;
    document.querySelector('.header__notification-label').textContent = notifCount;
    document.dispatchEvent(new Event('renderVetNotification'));
}


const displayClientNotificationList = async(userId) => {
    const appointments = await fetchAppointments();
    const filteredAppointment = appointments.filter(appt => (appt.appointmentStatus === 'accepted' || appt.appointmentStatus === 'reschedule') && appt.clientId === userId);

    let notificationHTML = '';
    let notifCount = '';

    if (filteredAppointment.length === 0) {  
        notificationHTML = `
            <div class="notif">
                <p class="notif-title">No Notification</p>
            </div>
        `;
        notifCount = ''; 
        
    } else {
        for (const appt of filteredAppointment) {
            const serviceName = await getServiceName(appt.appointmentService);
            const vet = await getTechnicianName(appt.vetPersonnel);
            notificationHTML += `
                <div class="notif">
                    <p class="notif-title">Your Appointment has been ${appt.appointmentStatus.charAt(0).toUpperCase() + appt.appointmentStatus.slice(1)}</p>
                    <p class="notif-short-text">Appointment Service <strong>${serviceName}</strong> services on ${formattedDate(appt.appointmentDate)} at ${formatTo12HourTime(appt.appointmentTime)}</p>
                    <p class="notif-short-text">Personnel: <strong>${vet}</strong></p>
                </div>
            `;
        }
        notifCount = filteredAppointment.length;
    }

    document.querySelector('.notification .notif-list').innerHTML = notificationHTML;
    document.querySelector('.header__notification-label').textContent = notifCount;
    document.dispatchEvent(new Event('renderClientNotification'));
}


export {
    handleNotification,
    displayACNotificationList,
    displayAdminNotificationList,
    displayVetNotification,
    displayClientNotificationList
};