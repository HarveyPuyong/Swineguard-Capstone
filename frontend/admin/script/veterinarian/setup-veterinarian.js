import displayTaskList from "./display-appoinment-task.js";
import { handleCompleteAppointment } from "../appointments/complete-restore-delete-appointment.js";
import renderSwineGraph from "./swine-graph.js";


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
// ========== Complete Button Activation
// ======================================
const handleCompleteTaskBtn = () => {
    const completeButton = document.querySelectorAll('.schedule__toggle-complete-btn');
    completeButton.forEach(btn => {
        btn.addEventListener('click', () => {
            const appointmentId = btn.dataset.setAppointmentId;
            handleCompleteAppointment(appointmentId);
            displayTaskList();
        })
    })
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
}