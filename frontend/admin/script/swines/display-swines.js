import fetchUsers from "./../../api/fetch-users.js"
import fetchSwines from "./../../api/fetch-swines.js";

const handleRenderSwines = async() => {
  try{
    const swines = await fetchSwines();
    const users = await  fetchUsers();

    let swinesTableHTML = '';

    swines.forEach(swine => {
      const swinesOwnerId = swine.clientId;
      const swinesOwner = users.find(user => user._id === swinesOwnerId);

      const swinesOwnerName = `${swinesOwner.firstName} ${swinesOwner.middleName} ${swinesOwner.lastName}`;
      const swinesOwnerAdress = `${swinesOwner.barangay} ${swinesOwner.municipality}`;

      const swineBirthdate = new Date(swine.birthdate); 
      const today = new Date(); 
      const swineAge = today.getFullYear() - swineBirthdate.getFullYear() - (today < new Date(today.getFullYear(), swineBirthdate.getMonth(), swineBirthdate.getDate()) ? 1 : 0);



      swinesTableHTML += `
          <div class="swine">
            <div class="swine__details">
              <p class="td type" data-type-value="${swine.type}">${swine.type}</p>
              <p class="td breed">${swine.breed}</p>
              <p class="td age">${swineAge}months</p>
              <p class="td sex">${swine.sex}</p>
              <p class="td weight">${swine.weight}kg</p>
              <p class="td health-status">${swine.status}</p>
              <p class="td owner">${swinesOwnerName}</p>
              <button class="td toggle-more-details-btn">View</button> 
            </div>
            <div class="swine__more-details">
              <div class="swine__more-details-heading">Swine Details:</div>
              <div class="swine__more-details-columns">
                <!-- more details left column -->
                <div class="column left">
                  <p class="column__detail">
                    <span class="column__detail-label">Swine ID:</span>
                    <span class="column__detail-value swine-id">${swine._id}</span>
                  </p>
                  <p class="column__detail">
                    <span class="column__detail-label">Type:</span>
                    <span class="column__detail-value">${swine.type}</span>
                  </p>
                  <p class="column__detail">
                    <span class="column__detail-label">Breed:</span>
                    <span class="column__detail-value">${swine.breed}</span>
                  </p>
                  <p class="column__detail">
                    <span class="column__detail-label">Age:</span>
                    <span class="column__detail-value">${swine.birthdate} (month)</span>
                  </p>
                  <p class="column__detail">
                    <span class="column__detail-label">Sex:</span>
                    <span class="column__detail-value">${swine.sex}</span>
                  </p>
                </div>
                <!-- more details right column -->
                <div class="column right"> 
                  <p class="column__detail">
                    <span class="column__detail-label">Health Status:</span>
                    <span class="column__detail-value">${swine.status}</span>
                  </p>
                  <p class="column__detail">
                    <span class="column__detail-label">Weight:</span>
                    <span class="column__detail-value">${swine.weight}kg</span>
                  </p>
                  <p class="column__detail">
                    <span class="column__detail-label">Owner:</span>
                    <span class="column__detail-value">${swinesOwnerName}</span>
                  </p>
                  <p class="column__detail">
                    <span class="column__detail-label">Location:</span>
                    <span class="column__detail-value swine-location">${swinesOwnerAdress}, Marinduque</span>
                  </p>
                  <p class="column__detail">
                    <span class="column__detail-label">Medication:</span>
                    <span class="column__detail-value swine-medication">Deworming</span>
                  </p>
                </div>
              </div>
            </div>                  
          </div>
        `;
       });
    

      const swinesTableElement = document.querySelector('#swines-section .swines-table__tbody');

      if(swinesTableElement) swinesTableElement.innerHTML = swinesTableHTML;

      document.dispatchEvent(new Event('renderSwinesTable'));

  }catch(err){
    console.log(err);
  }
}


export default handleRenderSwines;