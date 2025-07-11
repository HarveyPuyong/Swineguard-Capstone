import fetchInventory from '../../api/fetch-inventory.js';
import {inventoryTable, adminPageInventoryTable} from '../../utils/inventory-table.js';


async function handleRenderInventory() {
  try {
    const data = await fetchInventory();
    const inventories = data.slice().reverse(); 

    const inventoryTableElement = document.querySelector('#inventory-section .inventory-table__tbody');
    const adminInventoryTableElement = document.querySelector('.admin-page__section-wrapper #inventory-section .inventory-table__tbody');

    if(inventoryTableElement) inventoryTable(inventories, inventoryTableElement);
    if(adminInventoryTableElement) adminPageInventoryTable(inventories, adminInventoryTableElement);

    document.dispatchEvent(new Event('renderInventory')); 
  } catch (error) {
    console.log(error)
  }
}

export default handleRenderInventory;