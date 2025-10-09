import displayTaskList from "./display-appoinment-task.js";
import {completeAppointmentRequest,
        setupCompleteAppointmentFormListener } from "../appointments/complete-restore-delete-appointment.js";
import renderSwineGraph from "./swine-graph.js";
import { fetchAppointments } from "../../api/fetch-appointments.js";
import fetchUser from "../auth/fetchUser.js";
import { getServiceName } from "../../api/fetch-services.js";
import { fetchMedicines } from "../../api/fetch-medicine.js";
import { fetchInventoryStocks } from "../../api/fetch-inventory-stock.js";
import { formatedDateForCalendar } from "../../utils/formated-date-time.js";
import { handleUnderMonitoringSwine } from "./handle-under-monitoring.js";
import { getSwineFourDigitId } from "../../../client/client-utils/get-swine-data.js";



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
    const causeInput = document.querySelector('.detail-label__cause-of-death');
    const deathNumInput = document.querySelector('.detail-label__num-of-deaths');
    const checkBoxContainer = document.querySelector(".check-box__swine-Ids");

    completeButton.forEach(btn => {
        btn.addEventListener('click', () => {
            const appointmentId = btn.dataset.setAppointmentId;

            completeAppointmentRequest(appointmentId);
            displayTaskList();
            completeTaskForm.classList.add('show');
            setupPersonnelCompleteForm(appointmentId);

            // ✅ Store the appointmentId for later use (like monitoring)
            completeTaskForm.dataset.appointmentId = appointmentId;

        })
    });
    cancelButton.addEventListener('click', () => {
        completeTaskForm.classList.remove('show');
        completeTaskForm.reset();

        // Reset everything to default hidden state
        causeInput.classList.remove('hide');
        deathNumInput.classList.remove('hide');
        checkBoxContainer.classList.remove('hide'); // Remove if there is hide

        causeInput.classList.add('hide'); // then Readd the hide
        deathNumInput.classList.add('hide');
        checkBoxContainer.classList.add('hide');
        checkBoxContainer.innerHTML = '';

        // Remove stored appointmentId
        delete completeTaskForm.dataset.appointmentId;
    });

}


// ======================================
// ========== CHandle Mark as Under Monitoring
// ======================================
const handleUnderMonitoringBtn = async() => {
    const completeTaskForm = document.querySelector('.complete-task-form');
    const addToMonitoringList = document.querySelector('#complete-task-form__monitoring-btn');

    addToMonitoringList.addEventListener('click', () => {
        // ✅ Get appointment ID from form dataset
        const appointmentId = completeTaskForm.dataset.appointmentId;

        //alert(`Appointment Id: ${appointmentId}`);
        handleUnderMonitoringSwine(appointmentId);

    });
}



// ======================================
// ========== Complete Button Activation completeTaskForm__name
// ======================================
const setupPersonnelCompleteForm = async (appointmentId) => {
    const completeForm = document.querySelector('.complete-task-form');
    const appoinmentNameTxtView = completeForm.querySelector('#completeTaskForm__name');
    const medicineSelectTag = completeForm.querySelector('#completeTaskForm__set-medicine-list');
    const medicineVarSelectTag = completeForm.querySelector('#completeTaskForm__set-medicine-var');
    const appoinmentAmountInput = completeForm.querySelector('#completeTaskForm__set-medicine-amount');

    //Date Today
    const today = new Date();
    today.setHours(0,0,0,0);

    const appoinments = await fetchAppointments();
    const appoinment = appoinments.find(app => app._id === appointmentId);
    const serviceName = await getServiceName(appoinment.appointmentService);

    const medicines = await fetchMedicines();
    const stocks = await fetchInventoryStocks();

    // --- Fill medicine dropdown ---
    medicineSelectTag.innerHTML = `<option value="">Select Medicine</option>`;
    medicines.forEach(med => {
        const option = document.createElement('option');
        option.value = med._id;
        option.textContent = med.itemName;
        medicineSelectTag.appendChild(option);
    });

    // --- Disable variations until a medicine is selected ---
    medicineVarSelectTag.disabled = true;
    appoinmentAmountInput.disabled = true;
    medicineVarSelectTag.innerHTML = `<option value="">Select Variation</option>`;

    // --- Listen for changes on medicine dropdown ---
    medicineSelectTag.addEventListener('change', () => {
        const selectedMedicineId = medicineSelectTag.value;

        // Reset variations
        medicineVarSelectTag.innerHTML = `<option value="">Select Variation</option>`;
        
        if (!selectedMedicineId) {
            medicineVarSelectTag.disabled = true;
            return;
        }

        // Filter stocks by selected medicine
        const selectedMedicineVariation = stocks.filter(stock => stock.medicineId === selectedMedicineId && new Date(stock.expiryDate) >= today);

        // Populate variation dropdown
        selectedMedicineVariation.forEach(v => {
            const option = document.createElement('option');
            option.value = v._id;
            option.textContent = `${v.content} ml (${formatedDateForCalendar(v.expiryDate)})`;
            medicineVarSelectTag.appendChild(option);
        });

        // Enable dropdown if we have variations
        medicineVarSelectTag.disabled = selectedMedicineVariation.length === 0;
    });

    medicineVarSelectTag.addEventListener('change', () => {
        if (!medicineVarSelectTag.value) {
            // No variation selected → keep amount input disabled
            appoinmentAmountInput.disabled = true;
            appoinmentAmountInput.value = "";
        } else {
            // A variation is selected → enable amount input
            appoinmentAmountInput.disabled = false;
            appoinmentAmountInput.value = 0;
        }
    });

    // --- Set appointment name ---
    appoinmentNameTxtView.value = serviceName;

    // Set up the addToMonitoringList Button
    const findAppointment = appoinments.find(app => app._id === appointmentId);
    const addToMonitoringList = document.querySelector('#complete-task-form__monitoring-btn');
    const causeOFDeathBox = document.querySelector('.swine-cause__death');
    const isUnderMonitoring = findAppointment.underMonitoring;

    if (isUnderMonitoring === true) {
        addToMonitoringList.disabled = true;
        //addToMonitoringList.textContent = 'Under Monitoring';
        causeOFDeathBox.classList.add('show');
    } else {
        causeOFDeathBox.classList.remove('show');
        addToMonitoringList.disabled = false;
    }


    // Select Swine Health Status
    const newSwineStatusSelectTag = document.querySelector('#completeTaskForm__select-swine-health-status');
    const causeInput = document.querySelector('.detail-label__cause-of-death');
    const deathNumInput = document.querySelector('.detail-label__num-of-deaths');
    const checkBoxContainer = document.querySelector(".check-box__swine-Ids");

    // 🔧 Remove any previous listener by cloning the node (clean way)
    const clonedSelect = newSwineStatusSelectTag.cloneNode(true);
    newSwineStatusSelectTag.parentNode.replaceChild(clonedSelect, newSwineStatusSelectTag);

    clonedSelect.addEventListener('change', async() => {
        if (clonedSelect.value === 'sick') {
            causeInput.classList.remove('hide');
            deathNumInput.classList.add('hide');
            checkBoxContainer.classList.add('hide');
        } 
        else if (clonedSelect.value === 'deceased') {
            causeInput.classList.remove('hide');

            if (appoinment.swineIds && appoinment.swineIds.length === 0) {
                deathNumInput.classList.remove('hide');
                checkBoxContainer.classList.add('hide');
            } 
            else if (appoinment.swineIds && appoinment.swineIds.length > 0) {
                deathNumInput.classList.add('hide');
                checkBoxContainer.classList.remove('hide');

                // Render swine checkboxes
                checkBoxContainer.innerHTML = '';
                const listOfSwineId = appoinment.swineIds;

                const header = document.createElement('p');
                header.textContent = 'Number of Deaths:';
                header.classList.add('swine-checkbox__header');
                checkBoxContainer.appendChild(header);

                for ( const swineId of listOfSwineId ) {

                    const fourDigitId = await getSwineFourDigitId(swineId);
                    const checkbox = document.createElement('label');

                    checkbox.innerHTML = `
                        <label>
                            <input type="checkbox" value="${swineId}"> ${fourDigitId}
                        </label>
                    `;
                    checkBoxContainer.appendChild(checkbox);
                };
                
            }
        } 
        else {
            causeInput.classList.add('hide');
            deathNumInput.classList.add('hide');
            checkBoxContainer.classList.add('hide');
            checkBoxContainer.innerHTML = '';
        }
    });

    
};


// ======================================
// Filtering for complete and pending
// ======================================
const filterTaskList = () => {
    
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
    handleUnderMonitoringBtn();
}