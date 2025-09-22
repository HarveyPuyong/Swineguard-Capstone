import fetchInventory from "../../api/fetch-inventory.js";
import { fetchInventoryStocks } from "../../api/fetch-inventory-stock.js";
import toPercent from "../../utils/toPercent.js";
import formatItemStatus from './../../utils/format-item-status.js';


const upcoming = 'Upcoming';

const LOW_STOCK_THRESHOLD = 20;
const inventoryDashboard = async () => {
  try {
    const medicines = await fetchInventory();
    const stocks = await fetchInventoryStocks();

    let totalStocks = 0;
    stocks.forEach(stock => {
      totalStocks += stock.quantity;
    });

    // Summarize total quantity per medicine
    const stockSummary = medicines.map(med => {
        const relatedStocks = stocks.filter(s => s.medicineId === med._id);
        const totalQuantity = relatedStocks.reduce((sum, s) => sum + s.quantity, 0);
        return { name: med.itemName, quantity: totalQuantity };
    });

    // Categorize
    const lowStocks = stockSummary.filter(item => item.quantity > 0 && item.quantity < LOW_STOCK_THRESHOLD);
    const outOfStocks = stockSummary.filter(item => item.quantity === 0);
    const inStock = stockSummary.filter(item => item.quantity >= LOW_STOCK_THRESHOLD);

    const totalMedicineNum = lowStocks.length + outOfStocks.length + inStock.length;
    const lowStockPercentage = ((lowStocks.length / totalMedicineNum) * 100).toFixed(1);
    const outOfStockPercentage = ((outOfStocks.length / totalMedicineNum) * 100).toFixed(1);
    const inStockPercentage = ((inStock.length / totalMedicineNum) * 100).toFixed(1); 

    const dashboardHTML = `
      <!-- Total stocks card -->
      <div class="dashboard__card total-stocks total-card">
        <img class="dashboard__card-icon" src="images-and-icons/icons/stocks-icon.png" alt="stocks-icon">
        <p class="dashboard__card-label">
          Total Medicine Stocks: 
          <span class="dashboard__card-label--value">${totalStocks}</span>
        </p>
      </div>

      <!-- In-stock card -->
      <div class="dashboard__card in-stocks">
        <p class="dashboard__card-label">
          Medicine with stocks: 
          <span class="dashboard__card-label--value">${inStock.length}</span>
        </p>
        <div class="dashboard__card-progress-bar-container">
          <div class="dashboard__card-progress-bar">
            <div class="dashboard__card-progress-barOverflow"></div>
            <div class="dashboard__card-progress-value" style="width:${inStockPercentage}%"></div>
          </div>
          <div class="dashboard__card-progress-slicer"></div>
          <p class="dashboard__card-progress-txt">${inStockPercentage}%</p>
        </div>
      </div>

      <!-- Out-of-stock card -->
      <div class="dashboard__card out-of-stocks">
        <p class="dashboard__card-label">
          Medicine with no stocks: 
          <span class="dashboard__card-label--value">${outOfStocks.length}</span>
        </p>
        <div class="dashboard__card-progress-bar-container">
          <div class="dashboard__card-progress-bar">
            <div class="dashboard__card-progress-barOverflow"></div>
            <div class="dashboard__card-progress-value" style="width:${outOfStockPercentage}%"></div>
          </div>
          <div class="dashboard__card-progress-slicer"></div>
          <p class="dashboard__card-progress-txt">${outOfStockPercentage}%</p>
        </div>
      </div>

      <!-- Less stock card -->
      <div class="dashboard__card less-stocks">
        <p class="dashboard__card-label">
          Medicine with less stocks: 
          <span class="dashboard__card-label--value">${lowStocks.length}</span>
        </p>
        <div class="dashboard__card-progress-bar-container">
          <div class="dashboard__card-progress-bar">
            <div class="dashboard__card-progress-barOverflow"></div>
            <div class="dashboard__card-progress-value" style="width:${lowStockPercentage}%"></div>
          </div>
          <div class="dashboard__card-progress-slicer"></div>
          <p class="dashboard__card-progress-txt">${lowStockPercentage}%</p>
        </div>
      </div>

    `;

    const inventoryDashboard = document.querySelector('.inventory-dashboard .dashboard__cards-container');

    if (inventoryDashboard) inventoryDashboard.innerHTML = dashboardHTML;

  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};


export default inventoryDashboard;