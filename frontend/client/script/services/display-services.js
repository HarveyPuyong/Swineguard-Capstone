import {fetchServices} from './../../../admin/api/fetch-services.js';

const displayServices = async() => {
    try {
        const services = await fetchServices();
        let servicesHTML = '';

        services.forEach(service => {
            const maxLength = 110;
            const shortText = service.description.length > maxLength 
                ? service.description.slice(0, maxLength) + '...'
                : service.description;
            servicesHTML += `
                <div class="service-card">
                    <h2 class="services-card__title">${service.serviceName}</h2>
                    <p class="services-card__description">
                        <span class="services-card__description--details">&nbsp; &nbsp; &nbsp;&nbsp;${shortText}</span>
                        <span class="services-card__description--more-details">&nbsp; &nbsp; &nbsp;&nbsp;${service.description}</span>
                    </p>

                    <button class="service-card-show-more-description-btn">Read more...</button>
                </div>
            `; 
        });

        document.querySelector('.services-card-list').innerHTML = servicesHTML;

        document.dispatchEvent(new Event('renderClientServices')); 


    } catch (err) {
    console.error("Error loading services:", err);
  }
}


export default displayServices;
