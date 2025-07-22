// ======================================
// ========== Toggle Add Swine Form
// ======================================
const toggleAddSwineForm = () => {
  const form = document.querySelector('#add-swine-form');

  const showFormBtn = document.querySelector('.show-add-swine-form-btn').
    addEventListener('click', () => form.classList.add('show'));
  
  const closeFormBtn = document.querySelector('.add-swine-form__cancel-btn').
    addEventListener('click', () => form.classList.remove('show'));
}


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
// ========== Main Function - Setup Swines Section
// ======================================
export default function setupSwinesSection() {
 toggleAddSwineForm();
 toggleSwineFullDetails();
}