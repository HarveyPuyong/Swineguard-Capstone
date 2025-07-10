import handleRenderServices from "./dispay-services.js";
import popupAlert from './../../utils/popupAlert.js';
import api from '../../utils/axiosConfig.js';

function handleEditService (serviceId){
  const editServiceForm = document.querySelector('#edit-service-form');

  editServiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log(e)

    const serviceFormData = {
      serviceName: editServiceForm.querySelector('.service-name-input').value.trim(),
      description: editServiceForm.querySelector('.service-description-input').value.trim()
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