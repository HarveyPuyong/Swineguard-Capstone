import displayTaskList from "./display-appoinment-task.js";
import {completeAppointmentRequest,
        setupCompleteAppointmentFormListener } from "../appointments/complete-restore-delete-appointment.js";
import renderSwineGraph from "./swine-graph.js";
import { fetchAppointments } from "../../api/fetch-appointments.js";
import fetchUser from "../auth/fetchUser.js";
import { getServiceName } from "../../api/fetch-services.js";
import { fetchMedicines } from "../../api/fetch-medicine.js";



// ======================================
// ========== Toggle Appointment Task List
// ======================================
const toggleAppointmentTask = () => {
  const viewMoreBtns = document.querySelectorAll('.schedule__toggle-more-details-btn');

  viewMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const taskContainer = btn.closest('.schedule').querySelector('.schedule-more-details');
        taskContainer.classList.toggle('show');
        btn.textContent = btn.textContent === "View More" ? "View Less" : "View More";
    });
  });
};


// ======================================
// ========== Complete Button Activation completeTaskForm__name
// ======================================
const handleCompleteTaskBtn = () => {
    const completeButton = document.querySelectorAll('.schedule__toggle-complete-btn');
    const cancelButton = document.querySelector('#complete-task-form__cancel-btn');
    const completeTaskForm = document.querySelector('.complete-task-form');
    completeButton.forEach(btn => {
        btn.addEventListener('click', () => {
            const appointmentId = btn.dataset.setAppointmentId;
            completeAppointmentRequest(appointmentId);
            displayTaskList();
            completeTaskForm.classList.add('show');
            setupPersonnelCompleteForm(appointmentId);

        })
    })
    cancelButton.addEventListener('click', () => {
        completeTaskForm.classList.remove('show');
        completeTaskForm.reset();
    })
}


// ======================================
// ========== Complete Button Activation completeTaskForm__name
// ======================================
const setupPersonnelCompleteForm = async(appoinmentId) => {
    const completeForm = document.querySelector('.complete-task-form');
    const appoinmentNameTxtView = completeForm.querySelector('#completeTaskForm__name');
    const medicineSelectTag = completeForm.querySelector('#completeTaskForm__set-medicine-list');
    const appoinmentAmountInput = completeForm.querySelector('#completeTaskForm__set-medicine-amount');

    const appoinments = await fetchAppointments();
    const appoinment = appoinments.find(app => app._id === appoinmentId);
    const serviceName = await getServiceName(appoinment.appointmentService);

    const medicines = await fetchMedicines();

    medicineSelectTag.innerHTML = `<option value="">Select Medicine</option>`;

    medicines.forEach(med => {
        const option = document.createElement('option');
        option.value = med._id;
        option.textContent = med.itemName;
        
        medicineSelectTag.appendChild(option);
    })

    appoinmentNameTxtView.value = serviceName;

}


// ======================================
// ✅ Event listener for dynamic content
// ======================================
document.addEventListener('renderTaskList', () => {
    toggleAppointmentTask();
    handleCompleteTaskBtn();
});



export default function setupVeterinarian () {
    displayTaskList();
    renderSwineGraph();
    setupCompleteAppointmentFormListener();
}