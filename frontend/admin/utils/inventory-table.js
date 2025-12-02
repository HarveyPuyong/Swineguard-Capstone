import { returnStockNumber, fetchInventoryStocks, returnItemCount } from '../api/fetch-inventory-stock.js';
import formatItemStatus from './format-item-status.js';

  const upcoming = 'Upcoming';


// ======================================
// ==========IC Page Appointment Table
// ======================================
async function inventoryTable(inventories, table) {

  let inventoryTableHTML = '';

  if (!inventories || inventories.length === 0) {
    inventoryTableHTML = `
      <div class="no-medicine">
        <p>No Medicine Available</p>
      </div>
    `;
  } else {
    const allStocks = await fetchInventoryStocks();
    const today = new Date();

    for (const item of inventories) {
      const totalQuantity = await returnStockNumber(item._id);
      const itemCount =  await returnItemCount(item._id);

      // 🔎 get this medicine's stock entries
      const relatedStocks = allStocks.filter(s => s.medicineId === item._id);

      // 🔎 check expired
      const expiredItem = relatedStocks.filter(s => new Date(s.expiryDate) < today).length;

      let stockStatus = 'Not set.';

      if (totalQuantity === 0) { 
        stockStatus = 'out of stock';
      } else if (totalQuantity < 20) { 
        stockStatus = 'less stock'; 
      } else { 
        stockStatus = 'in stock'; 
      }

      inventoryTableHTML += `
        <div class="medicine status-${formatItemStatus(stockStatus)}" data-item-id=${item._id}>
          <p class="td medicine-name">${item.itemName}</p>
          <p class="td quantity">${totalQuantity}</p>
          <p class="td item-count">${itemCount}</p>
          <p class="td status" data-status-value=${formatItemStatus(stockStatus)}>
            ${stockStatus.charAt(0).toUpperCase() + stockStatus.slice(1)}
          </p>
          <p class="td category" >
            ${item.category?item.category:"Not set"}
          </p>
          <p class="td number-of-expired">
            ${expiredItem > 0 ? `${expiredItem} <span>(expired)</span>` : ""}
          </p>
        </div>
      `;
    }
        
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


// ======================================
// ==========Render button counts
// ======================================
const renderButtonsCount = async (inventories) => {
  const allStocks = await fetchInventoryStocks();

  // const inStockBtn = document.getElementById('in-stock__btn-count');
  const lessStockBtn = document.getElementById('less-stock__btn-count');
  const outOfStockBtn = document.getElementById('out-of-stock__btn-count');

  // let itemCount_inStock = 0;
  let itemCount_lessStock = 0;
  let itemCount_OutofStock = 0;

  for (const item of inventories) {
    const totalQuantity = await returnStockNumber(item._id);
    //const relatedStocks = allStocks.filter(s => s.medicineId === item._id);
    if (totalQuantity === 0) {
      itemCount_OutofStock++;
    } else if (totalQuantity < 20) {
      itemCount_lessStock++;
    }
  }

  // Always visible, even when 0
  const updateButton = (btn, count) => {
    btn.style.display = 'inline-block';
    btn.textContent = count;
  };

  // updateButton(inStockBtn, itemCount_inStock);
  updateButton(lessStockBtn, itemCount_lessStock);
  updateButton(outOfStockBtn, itemCount_OutofStock);

};







export {inventoryTable, adminPageInventoryTable, renderButtonsCount};