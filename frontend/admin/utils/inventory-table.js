import {formattedDate} from './formated-date-time.js';
import formatItemStatus from './format-item-status.js';
import filteredNumber from './filter-number.js';

    const upcoming = 'Upcoming';


// ======================================
// ==========IC Page Appointment Table
// ======================================
function inventoryTable(inventories, table) {
  let inventoryTableHTML = '';

  //console.log(inventories)

  if (!inventories || inventories.length === 0) {
    inventoryTableHTML = `
      <div class="no-medicine">
        <p>No Medicine Available</p>
      </div>
    `;
  } else {
    inventories.forEach(item => {
      //const status = formatItemStatus(item.itemStatus);

      inventoryTableHTML += `
        <div class="medicine status-${upcoming}" data-item-id=${item._id}>
          <p class="td medicine-name">${item.itemName}</p>
          <p class="td quantity">${upcoming}</p>
          <p class="td status" data-status-value=${upcoming}>
            ${upcoming}
          </p>
        </div>
      `;
    });
  }

  if (table) table.innerHTML = inventoryTableHTML;
  document.dispatchEvent(new Event('renderInventoryPreHeading'));
}


// ======================================
// ==========Admin Page Appointment Table
// ======================================
function adminPageInventoryTable(inventories, table) {
    let inventoryTableHTML = '';
    
    inventories.forEach(item => {
      //const status = formatItemStatus(item.itemStatus);

      inventoryTableHTML+= `
        <div class="medicine status-${upcoming}" data-item-id=${upcoming}>
            <p class="td medicine-name">${item.itemName}</p>
            <p class="td quantity">${upcoming}</p>
            <p class="td status" data-status-value=${upcoming}>
              ${upcoming}
            </p>
          </div>
        `
    });

    
    if(table) table.innerHTML = inventoryTableHTML;
}



export {inventoryTable, adminPageInventoryTable};