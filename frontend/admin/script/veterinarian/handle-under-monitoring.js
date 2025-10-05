import api from "../../utils/axiosConfig.js";
import popupAlert from "../../utils/popupAlert.js";
import displayTaskList from "./display-appoinment-task.js";


const handleUnderMonitoringSwine = async (appointmentId) => {
    const completeTaskForm = document.querySelector('.complete-task-form');
    try{
        const response = await api.patch(`/appointment/monitoring/${appointmentId}`);

        if(response.status === 200){
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