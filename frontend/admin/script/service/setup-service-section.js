import handleRenderServices from "./dispay-services.js";
import handleAddService from "./add-service.js";
import handleEditService from "./edit-service.js";


// ======================================
// ========== Toggle Add Service Form
// ======================================
const toggleAddServiceForm = () => {
  const addServiceForm = document.querySelector('#add-service-form');
  const showFormBtn = document.querySelector('.service-section__show-add-service-form-btn');
  const closeFormBtn = document.querySelector('#add-service-form .service-form__cancel-btn');

  showFormBtn.addEventListener('click', () => addServiceForm.classList.add('show'))
  closeFormBtn.addEventListener('click', () => addServiceForm.classList.remove('show'))
}


// ======================================
// ========== Toggle Edit Service Form 
//            Dito ko na call ang function handleEditService()       
// ======================================
const toggleEditServiceForm = () => {
  document.addEventListener('renderServices', () => {
    const editForm = document.querySelector('#edit-service-form');
    const closeForm = document.querySelector('#edit-service-form .service-form__cancel-btn')
    const editButtons = document.querySelectorAll('.service-card__edit-btn');

    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        editForm.classList.add('show');

        const serviceId = button.dataset.serviceId;
        handleEditService(serviceId);
      });
    });

    closeForm.addEventListener('click', () => editForm.classList)
  });
}


// ======================================
// ========== Main Function - Setup Service Section
// ======================================
export default function setupServiceSection() {
  handleRenderServices();
  toggleAddServiceForm();
  toggleEditServiceForm();
  handleAddService();

}