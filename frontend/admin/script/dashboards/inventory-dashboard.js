import toPercent from "../../utils/toPercent.js";
import formatItemStatus from './../../utils/formatItemStatus.js'


const inventoryDashboard = async () => {
  try {
    const response = await axios.get('http://localhost:2500/inventory/all', { withCredentials: true });

    const inventory = response?.data;

    const totalItems = inventory.length;

    const inStockItem = inventory.filter(item => formatItemStatus(item.itemStatus) === 'in-stock').length;
    const outOfStockItem = inventory.filter(item => formatItemStatus(item.itemStatus) === 'out-of-stock').length;
    const lessStockItem = inventory.filter(item => formatItemStatus(item.itemStatus) === 'less-stock').length;
    const expiredItem = inventory.filter(item => formatItemStatus(item.itemStatus) === 'expired').length;

    const inStockPercent = toPercent(inStockItem, totalItems);
    const outOfStockPercent = toPercent(outOfStockItem, totalItems);
    const lessStockPercent = toPercent(lessStockItem, totalItems);
    const expiredPercent = toPercent(expiredItem, totalItems);



    const dashboardHTML = `
      <!-- Total stocks card -->
      <div class="dashboard__card total-stocks total-card">
        <img class="dashboard__card-icon" src="images-and-icons/icons/stocks-icon.png" alt="stocks-icon">
        <p class="dashboard__card-label">
          Total Stocks: 
          <span class="dashboard__card-label--value">${totalItems}</span>
        </p>
      </div>

      <!-- In-stock card -->
      <div class="dashboard__card in-stocks">
        <p class="dashboard__card-label">
          In Stocks: 
          <span class="dashboard__card-label--value">${inStockItem}</span>
        </p>
        <div class="dashboard__card-progress-bar-container">
          <div class="dashboard__card-progress-bar">
            <div class="dashboard__card-progress-barOverflow"></div>
            <div class="dashboard__card-progress-value" style="width:${inStockPercent}%"></div>
          </div>
          <div class="dashboard__card-progress-slicer"></div>
          <p class="dashboard__card-progress-txt">${inStockPercent}%</p>
        </div>
      </div>

      <!-- Out-of-stock card -->
      <div class="dashboard__card out-of-stocks">
        <p class="dashboard__card-label">
          Out of Stocks: 
          <span class="dashboard__card-label--value">${outOfStockItem}</span>
        </p>
        <div class="dashboard__card-progress-bar-container">
          <div class="dashboard__card-progress-bar">
            <div class="dashboard__card-progress-barOverflow"></div>
            <div class="dashboard__card-progress-value" style="width:${outOfStockPercent}%"></div>
          </div>
          <div class="dashboard__card-progress-slicer"></div>
          <p class="dashboard__card-progress-txt">${outOfStockPercent}%</p>
        </div>
      </div>

      <!-- Less stock card -->
      <div class="dashboard__card less-stocks">
        <p class="dashboard__card-label">
          Less Stocks: 
          <span class="dashboard__card-label--value">${lessStockItem}</span>
        </p>
        <div class="dashboard__card-progress-bar-container">
          <div class="dashboard__card-progress-bar">
            <div class="dashboard__card-progress-barOverflow"></div>
            <div class="dashboard__card-progress-value" style="width:${lessStockPercent}%"></div>
          </div>
          <div class="dashboard__card-progress-slicer"></div>
          <p class="dashboard__card-progress-txt">${lessStockPercent}%</p>
        </div>
      </div>

      <!-- Expired stock card -->
      <div class="dashboard__card expired-stocks">
        <p class="dashboard__card-label">
          Expired: 
          <span class="dashboard__card-label--value">${expiredItem}</span>
        </p>
        <div class="dashboard__card-progress-bar-container">
          <div class="dashboard__card-progress-bar">
            <div class="dashboard__card-progress-barOverflow"></div>
            <div class="dashboard__card-progress-value" style="width:${expiredPercent}%"></div>
          </div>
          <div class="dashboard__card-progress-slicer"></div>
          <p class="dashboard__card-progress-txt">${expiredPercent}%</p>
        </div>
      </div>
    `;


    const inventoryDashboard = document.querySelector('.inventory-dashboard .dashboard__cards-container');

    if (inventoryDashboard) {
      inventoryDashboard.innerHTML = dashboardHTML;
    }

  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};


export default inventoryDashboard;