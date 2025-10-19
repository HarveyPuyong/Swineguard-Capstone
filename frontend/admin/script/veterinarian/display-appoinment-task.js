import { fetchAppointments } from "../../api/fetch-appointments.js";
import fetchUser from "../auth/fetchUser.js";
import { getServiceName } from "../../api/fetch-services.js";
import { getMedicineName } from "../../api/fetch-medicine.js";
import { formatTo12HourTime, formattedDate } from "../../utils/formated-date-time.js";

let statusFilter = "pending";

const getStatusFilter = (filterType) => {
    
    if (filterType === "" || filterType === null) {
        return statusFilter = "pending";
    }

    return statusFilter = filterType;
}; 


const displayTaskList = async () => {


    const { _id } = await fetchUser();
    let allAppointments = (await fetchAppointments())
        .filter(({ vetPersonnel }) => vetPersonnel === _id);

    // Update task counters
    const pendingCount = allAppointments.filter(a => a.appointmentStatus !== 'completed').length;
    const completedCount = allAppointments.filter(a => a.appointmentStatus === 'completed').length;

    document.querySelector('.pending_schedule-btn .vet-task__count').textContent = pendingCount;
    document.querySelector('.completed_schedule-btn .vet-task__count').textContent = completedCount;

    // Apply filter
    let filteredAppointments = allAppointments.filter(appointment => {
        if (statusFilter === "pending") {
            return appointment.appointmentStatus !== "completed";
        } else if (statusFilter === "completed") {
            return appointment.appointmentStatus === "completed";
        }
        return true;
    });

    // Sort so incomplete is first
    filteredAppointments.sort((a, b) => {
        if (a.appointmentStatus === 'completed' && b.appointmentStatus !== 'completed') return 1;
        if (a.appointmentStatus !== 'completed' && b.appointmentStatus === 'completed') return -1;
        return 0;
    });

    let taskListHTML = '';

    for (const appointment of filteredAppointments) {
        const serviceName = await getServiceName(appointment.appointmentService);
        const medicineName = await getMedicineName(appointment.medicine);

        const clinicalSignsHTML = (appointment.clinicalSigns && appointment.clinicalSigns.length > 0)
            ? `<ul>${appointment.clinicalSigns.map(sign => `<li>• ${sign}</li>`).join('')}</ul>`
            : "None";

        taskListHTML += `
            <div class="schedule">
                <div class="schedule-info">
                    <div class="schedule-detail">
                        <div class="appointment-name">
                            ${serviceName} 
                            ${appointment.underMonitoring ? '<span class="appointment-monitoring">(Under Monitoring)</span>' : ''}
                        </div>
                        <div class="detail date">
                            <span class="detail-label">Date:</span>
                            <span class="detail-value">${formattedDate(appointment.appointmentDate)}</span>
                        </div>
                        <div class="detail time">
                            <span class="detail-label">Time:</span>
                            <span class="detail-value">${formatTo12HourTime(appointment.appointmentTime)}</span>
                        </div>
                        <div class="detail client">
                            <span class="detail-label">Client:</span>
                            <span class="detail-value">${appointment.clientFirstname} ${appointment.clientLastname}</span>
                        </div>
                        <div class="detail address">
                            <span class="detail-label">Address:</span>
                            <span class="detail-value">${appointment.municipality}, ${appointment.barangay}, Marinduqe</span>
                        </div>
                    </div>
                    <div class="schedule-more-details">
                        <div class="detail contact">
                            <span class="detail-label">Contact:</span>
                            <span class="detail-value">${appointment.contactNum}</span>
                        </div>
                        <div class="detail email">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${appointment.clientEmail}</span>
                        </div>
                        <div class="detail swine-type">
                            <span class="detail-label">Swine Type:</span>
                            <span class="detail-value">${appointment.swineType}</span>
                        </div>
                        <div class="detail swine-count">
                            <span class="detail-label">Swine Count:</span>
                            <span class="detail-value">${appointment.swineCount}</span>
                        </div>
                        <div class="detail personnel-clinical-signs">
                            <span class="detail-label">Clinical Signs:</span>
                            <span class="detail-value">${clinicalSignsHTML}</span>
                        </div>
                        <div class="detail medicine">
                            <span class="detail-label">Medicine:</span>
                            <span class="detail-value">${medicineName}</span>
                        </div>
                        <div class="detail medicine-amount">
                            <span class="detail-label">Amount:</span>
                            <span class="detail-value">${appointment.medicineAmount ? appointment.medicineAmount : '0'}</span>
                        </div>
                    </div>
                </div>
                <div class="schedule__buttons-container">
                    <button class="schedule__toggle-complete-btn" 
                        data-set-appointment-id="${appointment._id}"
                        ${appointment.appointmentStatus === 'completed' ? 'disabled' : ''}>
                        ${appointment.appointmentStatus === 'completed' ? 'Completed' : 'Complete'}
                    </button>
                    <button class="schedule__toggle-more-details-btn">View More</button>
                </div>
            </div>
        `;
    }

    if (!taskListHTML) {
        taskListHTML = `<p class="no-task-msg">${statusFilter === "completed" ? "No completed tasks." : "No pending tasks."}</p>`;
    }

    document.querySelector('.schedule-list').innerHTML = taskListHTML;
    document.dispatchEvent(new Event('renderTaskList'));
};



export { displayTaskList, getStatusFilter };
