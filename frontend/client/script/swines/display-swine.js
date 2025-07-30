import fetchSwines from './../../../admin/api/fetch-swines.js';
import fetchClient from '../auth/fetch-client.js';

const displayClientSwines = async() => {
    try {
        const user = await fetchClient();
        const userId = user._id;

        const swines = await fetchSwines();
        const filterClientSwine = swines.filter(swine => swine.clientId === userId);
        let swineHTML = '';

        filterClientSwine.forEach(swine => {
            swineHTML += `
            <div class="swine-card ${swine.status}">
                <img class="swine-card__image" src="images-and-icons/icons/swine-image.png" alt="swine-image">
                <div class="swine-card__swine-info">
                    <p class="swine-card__id">${swine._id}</p>
                    <p class="swine-card__type">${swine.type}</p>
                    <p class="swine-card__status">${swine.status.charAt(0).toUpperCase() + swine.status.slice(1)}</p>
                </div>
                <i class="swine-card__delete-btn fa-solid fa-trash" data-set-swine-id="${swine._id}"></i>
            </div>
            `; 
        });

        document.querySelector('.swines-card-list').innerHTML = swineHTML;

        document.dispatchEvent(new Event('renderClientSwine')); 


    } catch (err) {
    console.error("Error loading services:", err);
  }
}


export default displayClientSwines;
