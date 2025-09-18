import { fetchAppointments } from "../../api/fetch-appointments.js"
import createCompleteTaskForm from "../../components/complete-task-form.js"


//=============================
//=== Toggle COmplete Task From
//=============================
const toggleCompleteTaskForm = () => {
    const complete_Task_Form_Container = document.querySelector('#tech-complete-task-form__container');
    complete_Task_Form_Container.classList.add('show');
}