import fetchInventory from "../../api/fetch-inventory.js";
import {inventoryTable, adminPageInventoryTable} from '../../utils/inventory-table.js';
import formatItemStatus from '../../utils/format-item-status.js';

const displayLessStockInventory = async () => {
  try {
    const inventory = await fetchInventory();

    const filteredInventory = inventory.filter(item => {
      const status = formatItemStatus(item.itemStatus);
      return status === 'less-stock' || status === 'out-of-stock';
    });

    const inventoryTableElement = document.querySelector('#dashboard-section .inventory-table__tbody');
    const adminInventoryTableElement = document.querySelector('.admin-page__section-wrapper #dashboard-section .inventory-table__tbody');

    inventoryTable(filteredInventory, inventoryTableElement);
    adminPageInventoryTable(filteredInventory, adminInventoryTableElement);

  } catch (error) {
    console.error(error);
  }
};

export default displayLessStockInventory;
