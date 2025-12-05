import { displayTaskList, getStatusFilter } from "./display-appoinment-task.js";
import {completeAppointmentRequest,
        setupCompleteAppointmentFormListener,
        setupFollowUpAppointmentFormListener } from "../appointments/complete-restore-delete-appointment.js";
import renderSwineGraph from "./swine-graph.js";
import { fetchAppointments } from "../../api/fetch-appointments.js";
import { getServiceName } from "../../api/fetch-services.js";
import { fetchMedicines } from "../../api/fetch-medicine.js";
import { fetchInventoryStocks } from "../../api/fetch-inventory-stock.js";
import { formatedDateForCalendar } from "../../utils/formated-date-time.js";
import { handleUnderMonitoringSwine } from "./handle-under-monitoring.js";
import { getSwineFourDigitId } from "../../../client/client-utils/get-swine-data.js";
import handleAppointmentCalendarContent from "../appointments/appointment-calendar.js";
import { renderSchedulesFromCalendar } from "./render-vet-schedules.js";
import fetchUser from "../auth/fetchUser.js";
import { handleAddNewScheduleFromSection } from "./handle-schedule-from-calendar.js";
import { editTotalAppointment } from "./set-num-of-appointment.js";
import { renderMaxApptPerDay } from "../../components/vet-max-appointment.js";
import { getItemCategory } from "../../api/fetch-inventory-stock.js";


// Vet Id
const vet = await fetchUser();
const vetId = vet._id;



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
    const followUpButton = document.querySelectorAll('.schedule__toggle-follow-up-btn');
    const completeButton = document.querySelectorAll('.schedule__toggle-complete-btn');
    const cancelButton = document.querySelector('#complete-task-form__cancel-btn');
    const cancelButtonFollowUpForm = document.querySelector('#followUp-task-form__cancel-btn');
    const completeTaskForm = document.querySelector('.complete-task-form');
    const followUpTaskForm = document.querySelector('.follow-up-task-form');
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

    followUpButton.forEach(btn => {
        btn.addEventListener('click', () => {
            const appointmentId = btn.dataset.setAppointmentId;
            completeAppointmentRequest(appointmentId);
            followUpTaskForm.classList.add('show');
            setupPersonnelFollowUpForm(appointmentId);
            followUpTaskForm.dataset.appointmentId = appointmentId;
        })
    });

    cancelButtonFollowUpForm.addEventListener('click', () => {
        followUpTaskForm.classList.remove('show');
        followUpTaskForm.reset();
    })

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

    // Sort medicines alphabetically by itemName
    const sortedMedicines = medicines.sort((a, b) => {
        const nameA = a.itemName.toLowerCase();
        const nameB = b.itemName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    // --- Fill medicine dropdown ---
    medicineSelectTag.innerHTML = `<option value="">Select Medicine</option>`;
    medicines.forEach(med => {
        const option = document.createElement('option');
        option.value = med._id;
        option.textContent = `${med.itemName} (${med.category?.trim() || 'Not set'})`;
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
            option.textContent = `${v.content} ml (${v.quantity} pcs) (expry: ${formatedDateForCalendar(v.expiryDate)}) `;
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


    const medicineListContainer = document.querySelector("#medicine-list-container");
    const addMedicineBtn = document.querySelector("#add-medicine-btn");




    addMedicineBtn.addEventListener("click", () => {
        createMedicineEntry(medicineListContainer, medicines, stocks, today );
    });

    
};



// ======================================
// ========== Follow-Up Form Setup
// ======================================
const setupPersonnelFollowUpForm = async (appointmentId) => {

    // --- Select FOLLOW-UP form ---
    const form = document.querySelector('.follow-up-task-form');

    // --- Assign form elements (Follow-Up IDs) ---
    const appoinmentNameTxtView = form.querySelector('#followUpForm__name');
    const medicineSelectTag = form.querySelector('#followUpForm__medicine-list');
    const medicineVarSelectTag = form.querySelector('#followUpForm__medicine-var');
    const appoinmentAmountInput = form.querySelector('#followUpForm__medicine-amount');

    // Data fetch
    const today = new Date(); today.setHours(0,0,0,0); // Today
    const appointments = await fetchAppointments();
    const appointment = appointments.find(app => app._id === appointmentId);
    const serviceName = await getServiceName(appointment.appointmentService);

    const medicines = await fetchMedicines(); // ITo yung Medicines
    const stocks = await fetchInventoryStocks(); //Ito naman yung STocks


    // Sort medicines alphabetically by itemName
    const sortedMedicines = medicines.sort((a, b) => {
        const nameA = a.itemName.toLowerCase();
        const nameB = b.itemName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    // --- Populate Medicine List ---
    medicineSelectTag.innerHTML = `<option value="">Select Medicine</option>`;
    sortedMedicines.forEach(med => {
        const option = document.createElement('option');
        option.value = med._id;
        option.textContent = `${med.itemName} (${med.category?.trim() || 'Not set'})`;
        medicineSelectTag.appendChild(option);
    });

    // Disable variation + amount until selected
    medicineVarSelectTag.disabled = true;
    appoinmentAmountInput.disabled = true;
    medicineVarSelectTag.innerHTML = `<option value="">Select Variation</option>`;

    // --- Medicine -> Variations ---
    medicineSelectTag.addEventListener('change', () => {
        const selectedId = medicineSelectTag.value;

        medicineVarSelectTag.innerHTML = `<option value="">Select Variation</option>`;
        medicineVarSelectTag.disabled = true;
        appoinmentAmountInput.disabled = true;
        appoinmentAmountInput.value = "";

        if (!selectedId) return;

        const variations = stocks.filter(
            stock => stock.medicineId === selectedId && new Date(stock.expiryDate) >= today
        );

        variations.forEach(v => {
            const option = document.createElement('option');
            option.value = v._id;
            option.textContent = `${v.content} ml (${v.quantity} pcs) (exp: ${formatedDateForCalendar(v.expiryDate)})`;
            medicineVarSelectTag.appendChild(option);
        });

        medicineVarSelectTag.disabled = variations.length === 0;
    });

    // --- Enable amount when variation chosen ---
    medicineVarSelectTag.addEventListener('change', () => {
        if (!medicineVarSelectTag.value) {
            appoinmentAmountInput.disabled = true;
            appoinmentAmountInput.value = "";
        } else {
            appoinmentAmountInput.disabled = false;
            appoinmentAmountInput.value = 0;
        }
    });

    // --- Set appointment name ---
    appoinmentNameTxtView.value = serviceName;

    // ======================================
    //      🔥 Swine Status Logic (Follow-Up)
    // ======================================
    const swineStatusSelect = form.querySelector('#followUpForm__swine-status');
    const causeInput = form.querySelector('.detail-label__cause-of-death');
    const deathNumInput = form.querySelector('.detail-label__num-of-deaths');
    const checkBoxContainer = form.querySelector(".check-box__swine-Ids");

    // Clear previous listeners by cloning
    const clonedSwineStatus = swineStatusSelect.cloneNode(true);
    swineStatusSelect.parentNode.replaceChild(clonedSwineStatus, swineStatusSelect);

    clonedSwineStatus.addEventListener('change', async () => {
        const value = clonedSwineStatus.value;

        if (value === 'sick') {
            causeInput.classList.remove('hide');
            deathNumInput.classList.add('hide');
            checkBoxContainer.classList.add('hide');
        }

        else if (value === 'deceased') {
            causeInput.classList.remove('hide');

            if (!appointment.swineIds || appointment.swineIds.length === 0) {
                deathNumInput.classList.remove('hide');
                checkBoxContainer.classList.add('hide');
            } else {
                deathNumInput.classList.add('hide');
                checkBoxContainer.classList.remove('hide');

                // Render swine checkboxes
                checkBoxContainer.innerHTML = '';

                const header = document.createElement('p');
                header.textContent = 'Number of Deaths:';
                header.classList.add('swine-checkbox__header');
                checkBoxContainer.appendChild(header);

                for (const swineId of appointment.swineIds) {
                    const swineCode = await getSwineFourDigitId(swineId);
                    const wrap = document.createElement('label');

                    wrap.innerHTML = `
                        <label>
                            <input type="checkbox" value="${swineId}"> ${swineCode}
                        </label>
                    `;
                    checkBoxContainer.appendChild(wrap);
                }
            }
        }

        else { 
            causeInput.classList.add('hide');
            deathNumInput.classList.add('hide');
            checkBoxContainer.classList.add('hide');
            checkBoxContainer.innerHTML = '';
        }
    });

    // ======================================
    //      🔥 Dynamic Medicine Entries
    // ======================================
    const medicineListContainer = form.querySelector("#followUp-medicine-list-container"); // Ito yung conatiner
    const addMedicineBtn = form.querySelector("#followUp-add-medicine-btn");

    // ✅ Clear previous entries when opening the form
    medicineListContainer.innerHTML = '';
    

    // Add entry button
    addMedicineBtn.addEventListener("click", () => {
        createMedicineEntry(medicineListContainer, medicines, stocks, today );
    });

};











//
const setupTaskListFilters = () => {
    const pendingBtn = document.querySelector('.pending_schedule-btn');
    const completedBtn = document.querySelector('.completed_schedule-btn');

    if (!pendingBtn || !completedBtn) {
        console.warn('Task list buttons not found in DOM.');
        return;
    }

    // Button event listeners
    pendingBtn.addEventListener('click', async () => {
        getStatusFilter('pending');
        pendingBtn.classList.add('active');
        completedBtn.classList.remove('active');
        await displayTaskList();
    });

    completedBtn.addEventListener('click', async () => {
        getStatusFilter('completed');
        completedBtn.classList.add('active');
        pendingBtn.classList.remove('active');
        await displayTaskList();
    });
};



// ======================================
// ========== Toggle Clinical Signs 
// ======================================
const toggleClinicalSignImage = () => {
  const image = document.querySelectorAll('.vet-side__clinical-sign-img');
  const overlay = document.querySelector('.admin-clinical-signs-overlay');
  const popup = document.querySelector('.admin-popUp-image__clinical-sign-container');
  const hideBtn = document.querySelector('.admin-hide-btn__clinical-sign');

  image.forEach(img => {
    img.addEventListener('click', () => {
        const appointmentId = img.dataset.id;
        overlay.classList.add('show');
        handleClinicalPopUpImage(appointmentId);
    });
  })

    hideBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
  });

  // Optional: clicking outside popup closes it
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
}



// ======================================
// ✅ Event listener for dynamic content
// ======================================
document.addEventListener('renderTaskList', () => {
    toggleAppointmentTask();
    handleCompleteTaskBtn();
    setupTaskListFilters();
    toggleClinicalSignImage();
});



// ======================================
// ========== Display Clinical Signs Image
// ======================================
const handleClinicalPopUpImage = async(appointmentId) => {
  const popUp_Image = document.querySelector('.admin-popUp-image__clinical-sign-container .clinical-signs__images');
  const appointments = await fetchAppointments();
  const appointment = appointments.find(app => app._id === appointmentId);

  popUp_Image.src = `${appointment.swineImage ? '/uploads/' + appointment.swineImage : "images-and-icons/icons/default-img__clinical-sign.png"}`;
}




// ======================================
// ========== View Calendar Button 
// ======================================
const viewCalendarHandler = () => {
    const filterBtnContainer = document.querySelector('.filter-appointment__schedule');
    const scheduleTaskContainer = document.querySelector('#schedule-section .schedule-list');
    const calendarContainer = document.querySelector('.appointment-schedule-content');
    const viewCalendarBtn = document.querySelector('.vet-viewn-calendar-btn');

    viewCalendarBtn.addEventListener('click', () => {
        const isCalendarShown = calendarContainer.classList.contains('show');

        if (isCalendarShown) {
            // Go back to schedule view
            calendarContainer.classList.remove('show');
            scheduleTaskContainer.classList.remove('hide');
            filterBtnContainer.classList.remove('hide');
            viewCalendarBtn.textContent = "View Calendar";
        } else {
            // Go to calendar view
            scheduleTaskContainer.classList.add('hide');
            filterBtnContainer.classList.add('hide');
            calendarContainer.classList.add('show');
            viewCalendarBtn.textContent = "Your Schedules";
            handleAppointmentCalendarContent();
        }
    });
}



// ======================================
// ========== Set up Veterinarian Personal Schedule
// ======================================
const setUpVetPersonalSchedule = () => {
    const overlay = document.querySelector('.availability-overlay');
    const addNewScheBtn = document.getElementById('availability__add-new-schedule');
    const setMaxAppBtn = document.getElementById('availability__set-max-appointment');

    const backBtn = document.getElementById('availability-schedule__back-btn');
    const setMaxAppBackBtn = document.getElementById('max-num-input__back-btn');

    const newScheduleForm = document.querySelector('.availability-vet-schedule-form');
    const setMaxAppForm = document.querySelector('.availability-set__max-appointment');


    // Open "Add New Schedule"
    addNewScheBtn.addEventListener('click', () => {
        overlay.classList.add("show");
        newScheduleForm.classList.add("show");
        setMaxAppForm.classList.remove("show");
        handleAddNewScheduleFromSection(vetId);
    });

    // Open "Set Maximum Appointment"
    setMaxAppBtn.addEventListener('click', () => {
        overlay.classList.add("show");
        setMaxAppForm.classList.add("show");
        newScheduleForm.classList.remove("show");
        editTotalAppointment();
    });

    // Back button for Schedule form
    backBtn.addEventListener('click', () => {
        overlay.classList.remove("show");
        newScheduleForm.classList.remove("show");
        newScheduleForm.reset();
    });

    // Back button for Max App form
    setMaxAppBackBtn.addEventListener('click', () => {
        overlay.classList.remove("show");
        setMaxAppForm.classList.remove("show");
        setMaxAppForm.reset();
    });

    // Close when clicking outside the popup (overlay click)
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.classList.remove("show");

            // Hide both forms
            newScheduleForm.classList.remove("show");
            setMaxAppForm.classList.remove("show");

            // Reset both
            newScheduleForm.reset();
            setMaxAppForm.reset();
        }
    };
};




// ===============================================
// 🔥 Reusable Medicine Entry Creator
// ===============================================
function createMedicineEntry(container, medicines, stocks, today ) {
    
    const entry = document.createElement("div");
    entry.classList.add("medicine-entry");

    entry.innerHTML = `
        <select class="medicine-select">
            <option value="">Select Medicine</option>
        </select>

        <select class="variation-select" disabled>
            <option value="">Select Variation</option>
        </select>

        <input type="number" class="amount-input" placeholder="Amount" min="0" disabled>

        <button type="button" class="remove-entry-btn">X</button>
    `;

    container.appendChild(entry);

    const medSelect   = entry.querySelector(".medicine-select");
    const varSelect   = entry.querySelector(".variation-select");
    const amountInput = entry.querySelector(".amount-input");
    const removeBtn   = entry.querySelector(".remove-entry-btn");

    // Populate medicine dropdown
    medicines.forEach(med => {
        const option = document.createElement("option");
        option.value = med._id;
        option.textContent = `${med.itemName} (${med.category})`;
        medSelect.appendChild(option);
    });

    // Medicine change logic
    medSelect.addEventListener("change", async() => {
        const selected = medSelect.value;

        varSelect.innerHTML = `<option value="">Select Variation</option>`;
        varSelect.disabled = true;
        amountInput.disabled = true;
        amountInput.value = "";

        if (!selected) return;

        const variations = stocks.filter(
            stock => stock.medicineId === selected && new Date(stock.expiryDate) >= today
        );

        for (const v of variations) {
            const option = document.createElement("option");
            option.value = v._id;

            const medExt = await getItemCategory(v.medicineId);
            option.textContent = `${v.content ? v.content : ""} ${medExt} (${v.quantity} pcs) (exp: ${formatedDateForCalendar(v.expiryDate)})`;
            varSelect.appendChild(option);
        };

        varSelect.disabled = variations.length === 0;
    });

    // Variation change
    varSelect.addEventListener("change", () => {
        amountInput.disabled = !varSelect.value;
        amountInput.value = varSelect.value ? 0 : "";
    });

    // Remove this entry
    removeBtn.addEventListener("click", () => entry.remove());
}






export default async function setupVeterinarian () {
    await displayTaskList();
    renderSwineGraph();
    setupCompleteAppointmentFormListener();
    setupFollowUpAppointmentFormListener();
    handleUnderMonitoringBtn();
    viewCalendarHandler();
    renderSchedulesFromCalendar();
    setUpVetPersonalSchedule();
    renderMaxApptPerDay();
}