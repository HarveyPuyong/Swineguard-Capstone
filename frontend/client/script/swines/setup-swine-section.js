import displayClientSwines from "./display-swine.js";


// ======================================
// ========== Toggle Swine Full Details
// ======================================
const toggleSwineFullDetails = () => {
  const swineFullDetailsContainer = document.querySelector('.swines-full-info');
  const swines = document.querySelectorAll('.swine-card');

  swines.forEach(swine => {
    swine.addEventListener('click', () => {
      swineFullDetailsContainer.classList.add('show')
    });
  });

  const backBtn = document.querySelector('.swines-full-info__back-btn').
    addEventListener('click', () => swineFullDetailsContainer.classList.remove('show'));
}


// ======================================
// ========== Toggle Edit Mode
// ======================================
const toggleEditMode = () => {
  const swineFullInfoContiner = document.querySelector('#swines-full-info');

  const enableEditModeBtn = document.querySelector('.swines-full-info__edit-btn.enable-edit-mode-btn');
  const disableEditModeBtn = document.querySelector('.swines-full-info__cancel-btn.disable-edit-mode-btn');

  enableEditModeBtn.addEventListener('click', () => {
    swineFullInfoContiner.classList.remove('view-mode');
    swineFullInfoContiner.classList.add('edit-mode');
    console.log(swineFullInfoContiner)
  });

  disableEditModeBtn.addEventListener('click', () => {
    swineFullInfoContiner.classList.add('view-mode');
    swineFullInfoContiner.classList.remove('edit-mode');
  });
}


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
// ========== Main Function - Setup Swines Section
// ======================================
export default function setupSwinesSection() {
  displayClientSwines();
  toggleAddSwineForm();
  toggleSwineFullDetails();
  toggleEditMode();
}