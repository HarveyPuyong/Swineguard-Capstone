import fetchInventory from '../api/fetch-inventory.js';
import { returnStockNumber } from '../api/fetch-inventory-stock.js';
import { inventoryTable } from '../utils/inventory-table.js';

async function initInventoryFiltering() {
  const table = document.querySelector('#inventory-section .inventory-table__tbody');
  const buttons = document.querySelectorAll('.inventory-filtering-tab__btn button');

  if (!table || buttons.length === 0) return;

  // Fetch all medicine documents
  const inventories = await fetchInventory();

  // Default view: show all "in stock"
  await renderFilteredInventory(inventories, table, 'in stock');

  // Button click behavior
  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.classList.contains('in-stock__btn')) {
        await renderFilteredInventory(inventories, table, 'in stock');
      } else if (btn.classList.contains('less-stock__btn')) {
        await renderFilteredInventory(inventories, table, 'less stock');
      } else if (btn.classList.contains('out-of-stock__btn')) {
        await renderFilteredInventory(inventories, table, 'out of stock');
      }
    });
  });
}

async function renderFilteredInventory(inventories, table, filterType) {
  const filtered = [];

  for (const item of inventories) {
    const totalQuantity = await returnStockNumber(item._id);

    let stockStatus = '';
    if (totalQuantity === 0) stockStatus = 'out of stock';
    else if (totalQuantity < 20) stockStatus = 'less stock';
    else stockStatus = 'in stock';

    if (stockStatus === filterType) {
      filtered.push(item);
    }
  }

  await inventoryTable(filtered, table);
}

//Button Counts number
async function apointmentCount() {
  
}



export default initInventoryFiltering;
