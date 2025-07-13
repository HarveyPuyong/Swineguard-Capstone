import {fetchServices} from "../../api/fetch-services.js";

async function handleRenderServices () {
  try {
    const services = await fetchServices();

    let serviceCardHTML = '';

    services.forEach(service => {
      serviceCardHTML += `
        <div class="service-card">
          <div class="service-card__image">
            <img src="images-and-icons/icons/services-icon.png" alt="Service Image" />
            <div class="service-card__label">Service</div>
          </div>

          <div class="service-card__name-and-description">
            <h3 class="service-card__name">${service.serviceName}</h3>

            <div class="service-card__description">
              <span class="service-card__description--label">Description: </span>
              <span class="service-card__description--value">${service.description}</span><br><br>
              <span class="service-card__description--label">Applicable Medicine: </span>
              <span class="service-card__description--value">${service.applicableItemTypes}</span>
            </div>

          </div>       
          <button class="service-card__edit-btn" data-service-id="${service._id}">Edit</button>
        </div>
            `
    });


    const serviceCardListHTML = document.querySelector('#services-section .services-card-list');

    if(serviceCardHTML) serviceCardListHTML.innerHTML = serviceCardHTML;

    document.dispatchEvent(new Event('renderServices')); 
    
  } catch (error) {
    console.log(error)
  }
}

export default handleRenderServices;