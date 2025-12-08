import handleRenderServices from "./dispay-services.js";
import popupAlert from './../../utils/popupAlert.js';
import api from '../../utils/axiosConfig.js';

function handleAddService (){
  const addServiceForm = document.querySelector('#add-service-form');

  addServiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedRadio = addServiceForm.querySelector('input[name="service__type"]:checked');
    let selectedRadio_With_ClinicalSigns = addServiceForm.querySelector('input[name="clinical-signs"]:checked');

    if (!selectedRadio) {
      popupAlert("error", "Error", "Please fill the required fields (Service Type).");
      return; // stop the form from submitting
    }
    if (!selectedRadio_With_ClinicalSigns) {
      selectedRadio_With_ClinicalSigns = false;
    }

    const serviceFormData = {
      serviceName: addServiceForm.querySelector('.service-name-input').value.trim(),
      description: addServiceForm.querySelector('.service-description-input').value.trim(),
      withClinicalSigns: selectedRadio_With_ClinicalSigns.value,
      serviceType: selectedRadio.value
    }

    console.log(serviceFormData);

    try {
      const response = await api.post('/service/add', serviceFormData);

      if(response.status === 201){
        popupAlert('success', 'Success', `New service "${serviceFormData.serviceName}" successully created`).
          then(() => {
            addServiceForm.reset();
            addServiceForm.classList.remove('show');
            handleRenderServices();
        });   
      }
    
    } catch (error) {
      // ✅ Handle backend validation messages
      if (error.response && error.response.data && error.response.data.message) {
        popupAlert("error", "Error", error.response.data.message);
      } else {
        popupAlert("error", "Error", "Something went wrong while adding the service.");
      }

      console.error("Add service error:", error);
    }
  })

}

const getSelectedApplicableMedicines = () => {
  const checkboxes = document.querySelectorAll('.service-medicine-list input[type="checkbox"]:checked');
  const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.value);
  return selectedValues;
};


export default handleAddService;