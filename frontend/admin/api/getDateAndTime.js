// getDateAndTime.js
import api from './../utils/axiosConfig.js';

const dateInputField = document.getElementById('set-date');
const timeInputField = document.getElementById('set-time');
const serviceName = document.querySelector('.appointment-schedule-form__heading');

async function populateDateAndTime(appointmentId) {
    try {
        const response = await api.get(`http://localhost:2500/appointment/${appointmentId}`, {withCredentials: true});
        const appointment = response?.data;

        dateInputField.value = appointment.appointmentDate?.split('T')[0];
        timeInputField.value = appointment.appointmentTime;
        serviceName.innerHTML = `Appointment Schedule Form <span class="acceptForm-title">(${appointment.appointmentTitle || 'Service'})</span>`;

    } catch (error) {
        console.log(error);
    }
}

export default populateDateAndTime;
