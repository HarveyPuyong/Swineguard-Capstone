import handleRenderServices from "./dispay-services.js";
import popupAlert from './../../utils/popupAlert.js';
import api from '../../utils/axiosConfig.js';

function handleEditService (serviceId){
  const editServiceForm = document.querySelector('#edit-service-form');

  editServiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedRadio_With_ClinicalSigns = editServiceForm.querySelector('input[name="edit__clinical-signs"]:checked');
    
    const serviceFormData = {
      serviceName: editServiceForm.querySelector('.service-name-input').value.trim(),
      description: editServiceForm.querySelector('.service-description-input').value.trim(),
      withClinicalSigns: selectedRadio_With_ClinicalSigns.value,
    }

    try {
      const response = await api.put(`/service/edit/${serviceId}`, serviceFormData);

      if(response.status === 200){
        popupAlert('success', 'Success', `Service "${serviceFormData.serviceName}" edit successully`).
          then(() => {
            editServiceForm.reset();
            editServiceForm.classList.remove('show');
            handleRenderServices();
        });   
      }
    
    } catch (error) {
      console.log(error)
    }
  })

}


export default handleEditService;