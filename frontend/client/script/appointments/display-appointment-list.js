import {fetchAppointments} from "./../../../admin/api/fetch-appointments.js"
import { getServiceName } from "../../../admin/api/fetch-services.js";
import fetchClient from "../auth/fetch-client.js";
import { formattedDate, formatTo12HourTime } from "../../../admin/utils/formated-date-time.js";

const displayAppointmentCardList = async() => {
    try {
        const client = await fetchClient();
        const clientId = client._id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointments = await fetchAppointments();
        const filteredAppointments = appointments.filter(appointment => 
                                    appointment.clientId === clientId)
                                    .sort((a, b) => {
                                    const aDate = new Date(a.createdAt);
                                    const bDate = new Date(b.createdAt);

                                    const aIsToday = aDate >= today;
                                    const bIsToday = bDate >= today;

                                    // Put today's appointments first
                                    if (aIsToday && !bIsToday) return -1;
                                    if (!aIsToday && bIsToday) return 1;

                                    // Then sort newest to oldest
                                    return bDate - aDate;
                                });

        let appointmentHTML = '';

        for (const appointment of filteredAppointments) {
            const serviceName = await getServiceName(appointment.appointmentService);
            appointmentHTML += `
                <div class="appointment-card">
                    <div class="appointment-card__image-container ${appointment.appointmentStatus}">
                        <img class="appointment-card__image-container--img" src="images-and-icons/icons/Veterenarian-icon.png" alt="appointment-card-image">
                        <p class="appointment-card__image-container--label">Swine ${appointment.appointmentType.charAt(0).toUpperCase() + appointment.appointmentType.slice(1)}</p>
                    </div>
                    <div class="appointment-card__details-and-more-details-container">
                        <div class="appointment-card__details-container">
                            <p class="appointment-card__title appointment-card__detail">
                            <span class="appointment-card__detail--label">Title:</span>
                            <span class="appointment-card__detail--value">${serviceName}</span>
                            </p>
                            <p class="appointment-card__count appointment-card__detail">
                            <span class="appointment-card__detail--label">SwinesCount:</span>
                            <span class="appointment-card__detail--value">${appointment.swineCount} Swines</span>
                            </p>
                            <p class="appointment-card__date--first-dose appointment-card__detail">
                            <span class="appointment-card__detail--label">Appointment Date:</span>
                            <span class="appointment-card__detail--value">${formattedDate(appointment.appointmentDate)} <span class="dose-status"style="display:none;">(1st Dose)</span></span>
                            </p>
                        </div>
                        
                        <div class="appointment-card__more-details-container">
                            <p class="appointment-card__time appointment-card__detail">
                            <span class="appointment-card__detail--label">Time:</span>
                            <span class="appointment-card__detail--value">${formatTo12HourTime(appointment.appointmentTime)}</span>
                            </p>
                            <p class="appointment-card__status appointment-card__detail">
                            <span class="appointment-card__detail--label">Status:</span>
                            <span class="appointment-card__detail--value">${appointment.appointmentStatus.charAt(0).toUpperCase() + appointment.appointmentStatus.slice(1)}</span>
                            </p>

                            <p class="appointment-card__date--second-dose appointment-card__detail" style="display:none;">
                            <span class="appointment-card__detail--label">Second Dose Date:</span>
                            <span class="appointment-card__detail--value">(To be update) <span class="dose-status">(2nd Dose)</span></span>
                            </p>
                            
                        </div>
                    </div>

                    <button class="appointment-card__toggle-more-details-btn" data-set-appointment-id="${appointment._id}">View More</button>
                </div>
            `;
        };

        document.querySelector('.appointments-card-list').innerHTML = appointmentHTML;
        document.dispatchEvent(new Event('renderClientAppointmentList')); 

    } catch (err) {
        console.error("Error loading services:", err);
    }
}

export default displayAppointmentCardList;