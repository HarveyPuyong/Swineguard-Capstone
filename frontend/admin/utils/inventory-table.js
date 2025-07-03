import {formattedDate} from './formated-date-time.js';
import formatItemStatus from './format-item-status.js';

function renderInventoryTable(inventories, table) {
    let inventoryTableHTML = '';
    
    inventories.forEach(item => {
      const status = formatItemStatus(item.itemStatus);

      inventoryTableHTML+= `
        <div class="medicine status-${status}" data-item-id=${item._id}>
            <p class="td medicine-name">${item.itemName}</p>
            <p class="td medicine-dosage">${item.dosage}</p>
            <p class="td quantity">${item.quantity}</p>
            <p class="td status" data-status-value=${status}>
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

    
    if(table) table.innerHTML = inventoryTableHTML;

    document.dispatchEvent(new Event('renderInventory')); 
}

export default renderInventoryTable;