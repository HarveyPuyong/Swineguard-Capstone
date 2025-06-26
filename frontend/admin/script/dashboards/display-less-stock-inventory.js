import { formattedDate } from '../../utils/formated-date-time.js';
import formatItemStatus from './../../utils/formatItemStatus.js';

const displayLessStockInventory = async () => {
  try {
    const response = await axios.get('http://localhost:2500/inventory/all', { withCredentials: true });

    const inventories = response?.data;

    const filteredItems = inventories.filter(item => {
      const status = formatItemStatus(item.itemStatus);
      return status === 'less-stock' || status === 'out-of-stock';
    });

    let inventoryTableHTML = '';

    filteredItems.forEach(item => {
      const status = formatItemStatus(item.itemStatus);

      inventoryTableHTML += `
        <div class="medicine status-${status}" data-item-id="${item._id}">
            <p class="td medicine-name">${item.itemName}</p>
            <p class="td medicine-dosage">${item.dosage}</p>
            <p class="td quantity">${item.quantity}</p>
            <p class="td status status--${status}" data-status-value="${status}">
              ${item.itemStatus}
            </p>
            <p class="td exp-date">${formattedDate(item.expiryDate)}</p>
            <p class="td created-date">${formattedDate(item.createdAt)}</p>
            <p class="td updated-date">${formattedDate(item.updatedAt)}</p>
            <div class="td toggle-buttons-icon">
              <i class="icon fas fa-ellipsis-v"></i>
              <div class="buttons-container">
                <button id="edit-btn" data-item-id="${item._id}" type="button">Edit</button>
                <button id="remove-btn" data-item-id="${item._id}" type="button">Remove</button>
                <button id="restore-btn" data-item-id="${item._id}" type="button">Restore</button>
                <button id="delete-btn" data-item-id="${item._id}" type="button">Delete</button>
              </div>
            </div>
        </div>
      `;
    });

    const inventoryTable = document.querySelector('#dashboard-section .inventory-table__tbody');
    
    if (inventoryTable) {
      inventoryTable.innerHTML = inventoryTableHTML;
    }

  } catch (error) {
    console.log(error);
  }
};

export default displayLessStockInventory;
