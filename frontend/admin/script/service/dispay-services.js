import {fetchServices} from "../../api/fetch-services.js";

async function handleRenderServices () {
  try {
    const services = await fetchServices();

    let serviceCardHTML = '';

    if (services.length === 0) {
      serviceCardHTML = `
        <div class="no-service-card">
          <p class='no-service__header'>No Services<p>
          <p class='no-service__ds'>Click 'add' to create a services and fill up the corresponding input fields.<p>
        </div>
      `;
      document.querySelector('#services-section .services-card-list').innerHTML = serviceCardHTML;
    }

    services.forEach(service => {
      serviceCardHTML += `
        <div class="service-card">
          <div class="service-card__image">
            <img src="images-and-icons/icons/services-icon.png" alt="Service Image" />
            <div class="service-card__label">Service</div>
          </div>

          <div class="service-card__name-and-description">
            <div class="service-title">
              <h3 class="service-card__name">${service.serviceName}</h3> (<span>${service.serviceType ? service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1) : "Not set"}</span>)
            </div>

            <div class="service-card__description">
              <span class="service-card__description--label">Description: </span>
              <span class="service-card__description--value">${service.description}</span><br><br>
            </div>

          </div>   
          
          <div class="services-btn">
            <button class="service-card__edit-btn" data-service-id="${service._id}">Edit</button>
            <button class="service-card__delete-btn" data-service-id="${service._id}">Delete</button>
          </div>
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