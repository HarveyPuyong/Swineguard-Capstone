import {formattedDate, formatTo12HourTime} from '../../utils/formated-date-time.js';
import formatItemStatus from './../../utils/formatItemStatus.js'


const handleRenderInventory = async() => {
  try {
    const response = await axios.get('http://localhost:2500/inventory/all', {withCredentials: true});

    const data = response?.data;
    const inventories = data.slice().reverse(); 

    let inventoryTableHTML = '';
    
    inventories.forEach(item => {
      inventoryTableHTML+= `
        <div class="medicine status-${formatItemStatus(item.itemStatus)}" data-item-id=${item._id}>
            <p class="td medicine-name">${item.itemName}t</p>
            <p class="td medicine-dosage">${item.dosage}</p>
            <p class="td quantity">${item.quantity}</p>
            <p class="td status" data-status-value=${formatItemStatus(item.itemStatus)}>
              ${item.itemStatus}
            </p>
            <p class="td exp-date">${formattedDate(item.expiryDate)}</p>
            <p class="td created-date">${formattedDate(item.createdAt)}</p>
            <p class="td updated-date">${formattedDate(item.updatedAt)}</p>
            <div class="td toggle-buttons-icon">
              <i class="icon fas fa-ellipsis-v"></i>
              <div class="buttons-container">
                <button id="edit-btn" data-item-id=${item._id} type="button">Edit</button>
                <button id="remove-btn" data-item-id=${item._id} type="button">Remove</button>
                <button id="restore-btn" data-item-id=${item._id} type="button">Restore</button>
                <button id="delete-btn" data-item-id=${item._id} type="button">Delete</button>
              </div>
            </div>
          </div>
        `
    });

    document.querySelector('#inventory-section .inventory-table__tbody').innerHTML = inventoryTableHTML;

    document.dispatchEvent(new Event('renderInventory')); 

  } catch (error) {
    console.log(error)
  }
}

export default handleRenderInventory;