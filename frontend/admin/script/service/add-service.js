import handleRenderServices from "./dispay-services.js";
import popupAlert from './../../utils/popupAlert.js';
import api from '../../utils/axiosConfig.js';

function handleAddService (){
  const addServiceForm = document.querySelector('#add-service-form');

  addServiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const serviceFormData = {
      serviceName: addServiceForm.querySelector('.service-name-input').value.trim(),
      description: addServiceForm.querySelector('.service-description-input').value.trim()
    }

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
      console.log(error)
    }
  })

}


export default handleAddService;