import api from "../../utils/axiosConfig.js";
import popupAlert from "../../utils/popupAlert.js";
import {displayTaskList} from "./display-appoinment-task.js";
import { fetchAppointments } from "../../api/fetch-appointments.js";


const handleUnderMonitoringSwine = async (appointmentId) => {
    const completeTaskForm = document.querySelector('.complete-task-form');

    const appointments = await fetchAppointments(); // All appointment
    const appointment = appointments.find(app => app._id === appointmentId); // appointment found

    try{
        const response = await api.patch(`/appointment/monitoring/${appointmentId}`);

        if(response.status === 200){

            if (appointment.swineIds && appointment.swineIds.length > 0) {
                await api.patch(`/swine/is-under/monitoring`,{ swineIds: appointment.swineIds });
            } 

            popupAlert('success', 'Success!', 'Appointment under monitoring.')
                .then(() => {
                    displayTaskList();
                    completeTaskForm.classList.remove('show');
                    completeTaskForm.reset();
            });
        }

    } catch(err){
        const errMessage = err.response.data?.message || err.response.data?.error;
        popupAlert('error', 'Error!', errMessage);
    }
}

export {
    handleUnderMonitoringSwine
}