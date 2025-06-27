// display-item.js
//import { formattedDate } from '../../utils/formated-date-time';


const handleRenderItems = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axios.get('http://localhost:2500/inventory/all', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });

    const data = response?.data;

    let itemTableHTML = 'No item yet';

    data.forEach(item => {
      itemTableHTML += `
        <div class="medicine">
          <p class="td id">${item._id.slice(0, 12)}...</p>
          <p class="td medicine-name">${item.itemName}</p>
          <p class="td medicine-dosage">${item.dosage}mg</p>
          <p class="td quantity">${item.quantity}</p>
          <p class="td status" data-status-value="${item.itemStatus.toLowerCase()}">${item.itemStatus}</p>
          <p class="td exp-date">${formattedDate(item.expiryDate)}</p>
          <p class="td created-date">${formattedDate(item.createdAt)}</p>
          <p class="td updated-date">${formattedDate(item.updatedAt)}</p>
          <div class="td toggle-buttons-icon">
            <i class="icon fas fa-ellipsis-v"></i>
            <div class="buttons-container">
              <button id="edit-btn" type="button">Edit</button>
              <button id="remove-btn" type="button">Remove</button>
            </div>
          </div>
        </div>
      `;
    });

    const container = document.querySelector('#inventory-section .inventory-table__tbody');
    container.innerHTML = itemTableHTML;

    // ✅ Fire event to indicate rendering is done
    document.dispatchEvent(new Event('inventoryRendered'));

  } catch (error) {
    console.log('Error rendering items:', error);
  }
};

function formattedDate(date) {
   return new Date(date).toISOString().split('T')[0];
}


export default handleRenderItems;
