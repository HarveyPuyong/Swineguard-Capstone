// getDateAndTime.js
import api from '../utils/axiosConfig.js';
import { getServiceName } from './fetch-services.js';

const dateInputField = document.getElementById('set-date');
const timeInputField = document.getElementById('set-time');
const serviceName = document.querySelector('.appointment-schedule-form__heading');

async function populateAppointmentDateAndTime(appointmentId) {
    try {
        const response = await api.get(`http://localhost:2500/appointment/${appointmentId}`, {withCredentials: true});
        const appointment = response?.data;
        //const acquiredServices = await getServiceName(appointment.appointmentService)

        dateInputField.value = appointment.appointmentDate?.split('T')[0];
        timeInputField.value = appointment.appointmentTime;
        //serviceName.innerHTML = `Appointment Schedule Form <span class="acceptForm-title">(${acquiredServices || 'Service'})</span>`;

    } catch (error) {
        console.log(error);
    }
}

export default populateAppointmentDateAndTime;
