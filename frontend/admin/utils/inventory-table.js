import { returnStockNumber } from '../api/fetch-inventory-stock.js';
import formatItemStatus from './format-item-status.js';

  const upcoming = 'Upcoming';


// ======================================
// ==========IC Page Appointment Table
// ======================================
async function inventoryTable(inventories, table) {
  let inventoryTableHTML = '';

  //console.log(inventories)

  if (!inventories || inventories.length === 0) {
    inventoryTableHTML = `
      <div class="no-medicine">
        <p>No Medicine Available</p>
      </div>
    `;
  } else {

    for (const item of inventories) {
      const totalQuantity = await returnStockNumber(item._id);
      let stockStatus = 'Not set.';

      if (totalQuantity === 0) { stockStatus = 'out of stock'; } 
      else if ( totalQuantity < 30) { stockStatus = 'less stock'; }
      else if ( totalQuantity >= 30) { stockStatus = 'in stock'; }

      inventoryTableHTML += `
        <div class="medicine status-${formatItemStatus(stockStatus)}" data-item-id=${item._id}>
          <p class="td medicine-name">${item.itemName}</p>
          <p class="td quantity">${totalQuantity}</p>
          <p class="td status" data-status-value=${formatItemStatus(stockStatus)}>
            ${stockStatus.charAt(0).toUpperCase() + stockStatus.slice(1)}
          </p>
        </div>
      `;
    } 
    
    // inventories.forEach(item => {
    //   //const status = formatItemStatus(item.itemStatus);

    //   inventoryTableHTML += `
    //     <div class="medicine status-${upcoming}" data-item-id=${item._id}>
    //       <p class="td medicine-name">${item.itemName}</p>
    //       <p class="td quantity">${item._id}</p>
    //       <p class="td status" data-status-value=${upcoming}>
    //         ${upcoming}
    //       </p>
    //     </div>
    //   `;
    // });

  }

  if (table) table.innerHTML = inventoryTableHTML;
  document.dispatchEvent(new Event('renderInventoryPreHeading'));
}


// ======================================
// ==========Admin Page Appointment Table
// ======================================
async function adminPageInventoryTable(inventories, table) {
  let inventoryTableHTML = '';

  if (!inventories || inventories.length === 0) {
    inventoryTableHTML = `
      <div class="no-medicine">
        <p>No Medicine Available</p>
      </div>
    `;
  } else {

    for (const item of inventories) {
      const totalQuantity = await returnStockNumber(item._id);
      let stockStatus = 'Not set.';

      if (totalQuantity === 0) { stockStatus = 'out of stock'; } 
      else if ( totalQuantity < 30) { stockStatus = 'less stock'; }
      else if ( totalQuantity >= 30) { stockStatus = 'in stock'; }

      inventoryTableHTML += `
        <div class="medicine status-${formatItemStatus(stockStatus)}" data-item-id=${item._id}>
          <p class="td medicine-name">${item.itemName}</p>
          <p class="td quantity">${totalQuantity}</p>
          <p class="td status" data-status-value=${formatItemStatus(stockStatus)}>
            ${stockStatus.charAt(0).toUpperCase() + stockStatus.slice(1)}
          </p>
        </div>
      `;
    } 
  }

    
  if(table) table.innerHTML = inventoryTableHTML;
}



export {inventoryTable, adminPageInventoryTable};