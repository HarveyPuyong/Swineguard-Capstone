import {displayClientSwines, displayFullSwineDetails} from "./display-swine.js";
import addSwine from "./add-swine.js";
import {updateSwineDetails, setupSwineFormListener } from './edit-remove.js'

// ======================================
// ========== Toggle Swine Full Details
// ======================================
const toggleSwineFullDetails = () => {
  document.addEventListener('renderClientSwine', () => {
    const swineFullDetailsContainer = document.querySelector('#swines-full-info');
    const swines = document.querySelectorAll('.swine-card');

    swines.forEach(swine => {
      swine.addEventListener('click', async () => {
        const swineId = swine.getAttribute('data-set-swine-id');

        // ✅ Populate full swine details
        await displayFullSwineDetails(swineId);

        // ✅ Re-attach back button
        const backBtn = swineFullDetailsContainer.querySelector('.swines-full-info__back-btn');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            swineFullDetailsContainer.classList.remove('show');
          });
        }

        // ✅ Attach edit/cancel buttons
        toggleEditMode();  // ⬅ Moved here so it only runs after DOM is updated

        // ✅ Show panel
        swineFullDetailsContainer.classList.add('show');
      });
    });
  });
};

// ======================================
// ========== Toggle Edit Mode
// ======================================
const toggleEditMode = () => {
  const container = document.querySelector('#swines-full-info');
  const enableBtn = container.querySelector('.swines-full-info__edit-btn.enable-edit-mode-btn');
  const disableBtn = container.querySelector('.swines-full-info__cancel-btn.disable-edit-mode-btn');
  const swineHistory = container.querySelector('.medical-history__container');

  if (!enableBtn || !disableBtn) return;

  enableBtn.addEventListener('click', () => {
    const swineId = enableBtn.getAttribute('data-set-swine-id');
    //console.log(swineId)
    updateSwineDetails(swineId);
    container.classList.remove('view-mode');
    container.classList.add('edit-mode');
    swineHistory.classList.remove('show');
    swineHistory.classList.add('hide');
    
  });

  disableBtn.addEventListener('click', () => {
    container.classList.add('view-mode');
    container.classList.remove('edit-mode');
    swineHistory.classList.remove('hide');
    swineHistory.classList.add('show');
  });
};


// ======================================
// ========== Toggle Add Swine Form
// ======================================
const toggleAddSwineForm = () => {
  const form = document.querySelector('#add-swine-form');

  const showFormBtn = document.querySelector('.show-add-swine-form-btn').
    addEventListener('click', () => form.classList.add('show'));
  
  const closeFormBtn = document.querySelector('.add-swine-form__back-btn').
    addEventListener('click', () => form.classList.remove('show'));
}


// ======================================
// ========== Toggle Swine Medical and Healh History
// ======================================
const toggleMedicalAndHealthHistory = () => {
  document.addEventListener('renderFullSwineDetails', () => {
    const medicalHistoryContainer = document.querySelector('.medical-history__container');
    const healthHistoryContainer = document.querySelector('.health-history__container');

    const medicalHistoryBtn = document.querySelector(".swines-full-info .history-nav-btns .swine-medical-history-btn");
    const healthHistoryBtn = document.querySelector(".swines-full-info .history-nav-btns .swine-health-history-btn");

    medicalHistoryBtn.addEventListener('click', () => {
      medicalHistoryContainer.classList.add('show');
      medicalHistoryBtn.classList.add('active');
      healthHistoryContainer.classList.remove('show');
      healthHistoryBtn.classList.remove('active');
    });

    healthHistoryBtn.addEventListener('click', () => {
      medicalHistoryContainer.classList.remove('show');
      medicalHistoryBtn.classList.remove('active');
      healthHistoryContainer.classList.add('show');
      healthHistoryBtn.classList.add('active');
    });
  });
}


// ======================================
// ========== Main Function - Setup Swines Section
// ======================================
export default function setupSwinesSection() {
  displayClientSwines();
  toggleAddSwineForm();
  toggleSwineFullDetails();
  toggleEditMode();
  setupSwineFormListener();
  addSwine();
  toggleMedicalAndHealthHistory()
}