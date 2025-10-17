import fetchInventory from "../../api/fetch-inventory.js";
import {inventoryTable, adminPageInventoryTable} from '../../utils/inventory-table.js';
import { returnStockNumber } from "../../api/fetch-inventory-stock.js";

async function displayLessStockInventory (){
  try {
    const inventories = await fetchInventory();

    let filteredInventory = [];

    for (const item of inventories) {
      const totalQuantity = await returnStockNumber(item._id);
      if (totalQuantity <= 20) {
        filteredInventory.push(item);
      }
    };

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
