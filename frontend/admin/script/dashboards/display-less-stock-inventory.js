import fetchInventory from "../../api/fetch-inventory.js";
import {inventoryTable, adminPageInventoryTable} from '../../utils/inventory-table.js';
import formatItemStatus from '../../utils/format-item-status.js';

async function displayLessStockInventory (){
  try {
    const inventory = await fetchInventory();

    const filteredInventory = inventory.filter(item => {
      //const status = formatItemStatus(item.itemStatus);
      // return status === 'less-stock' || status === 'out-of-stock';
      return 'Upcoming';
    });

    const inventoryTableElement = document.querySelector('#dashboard-section .inventory-table__tbody');
    const adminInventoryTableElement = document.querySelector('.admin-page__section-wrapper #dashboard-section .inventory-table__tbody');

    if(inventoryTableElement) inventoryTable(filteredInventory, inventoryTableElement);
    if(adminInventoryTableElement) adminPageInventoryTable(filteredInventory, adminInventoryTableElement);

    document.dispatchEvent(new Event('renderInventory')); 
  } catch (error) {
    console.error(error);
  }
};

export default displayLessStockInventory;
