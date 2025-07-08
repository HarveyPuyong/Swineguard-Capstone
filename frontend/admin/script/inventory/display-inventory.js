import fetchInventory from '../../api/fetch-inventory.js';
import {inventoryTable, adminPageInventoryTable} from '../../utils/inventory-table.js';


const handleRenderInventory = async() => {
  try {
    const data = await fetchInventory();
    const inventories = data.slice().reverse(); 

    const inventoryTableElement = document.querySelector('#inventory-section .inventory-table__tbody');
    const AdminInventoryTableElement = document.querySelector('.admin-page__section-wrapper #inventory-section .inventory-table__tbody');

    inventoryTable(inventories, inventoryTableElement);
    adminPageInventoryTable(inventories, AdminInventoryTableElement);

  } catch (error) {
    console.log(error)
  }
}

export default handleRenderInventory;