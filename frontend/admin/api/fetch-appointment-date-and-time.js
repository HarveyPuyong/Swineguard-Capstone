// getDateAndTime.js
import api from '../utils/axiosConfig.js';
import { getServiceName } from './fetch-services.js';

const dateInputField = document.getElementById('set-date');
const timeInputField = document.getElementById('set-time');
const dateInputFieldRescheduleForm = document.getElementById('reschedule-set-date');
const timeInputFieldRescheduleForm = document.getElementById('reschedule-set-time');
const serviceName = document.querySelector('.appointment-schedule-form__heading');

async function populateAppointmentDateAndTime(appointmentId) {
    try {
        const response = await api.get(`http://localhost:2500/appointment/${appointmentId}`, {withCredentials: true});
        const appointment = response?.data;
       

        dateInputField.value = appointment.appointmentDate?.split('T')[0];
        timeInputField.value = appointment.appointmentTime;
        dateInputFieldRescheduleForm.value = appointment.appointmentDate?.split('T')[0];
        timeInputFieldRescheduleForm.value = appointment.appointmentTime;
        

    } catch (error) {
        console.log(error);
    }
}

export default populateAppointmentDateAndTime;
