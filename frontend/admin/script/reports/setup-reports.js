import { fetchSwineReports, fetchInventoryReports } from "../../api/fetch-report.js";
import fetchSwinePopulation from "../../api/fetch-swine-population.js";

async function populateReportDates() {
  try {

    const swineReports = await fetchSwineReports();
    const inventoryReports = await fetchInventoryReports();
    const swinePopulationData = await fetchSwinePopulation();
    
    //console.log("inventoryReports:", inventoryReports);

    const selectTag = document.querySelector('.past-report-container .reports-content__select-year');
    const inventorySelectTag = document.querySelector('.display-inventory-records .reports-content__select-year');
    const swinePopulationSelectTag = document.querySelector('#population-year');
    if (!selectTag) return;

    selectTag.innerHTML = '<option value="">Select Year</option>';

    // Extract unique years
    const uniqueYears = [...new Set(swineReports.map(report => report.year))];
    const uniqueInventoryYears = [...new Set(inventoryReports.map(r => r.year))];
    const uniqueSwinePopulationYears = [...new Set(swinePopulationData.map(r => r.year))];

    uniqueYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;

        selectTag.appendChild(option);
    });

    uniqueInventoryYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;

        inventorySelectTag.appendChild(option);
    });

    uniqueSwinePopulationYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;

        swinePopulationSelectTag.appendChild(option);
    });



    // Optional: Show no records message
    if (uniqueYears.length === 0) {
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = 'No reports available';
      selectTag.appendChild(option);
    }

    if (uniqueInventoryYears.length === 0) {
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = 'No reports available';
      inventorySelectTag.appendChild(option);
    }

    if (uniqueSwinePopulationYears.length === 0) {
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = 'No reports available';
      swinePopulationSelectTag.appendChild(option);
    }


    // ======================================
    // ========== Set Up swine Date Heading
    // ======================================
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const monthList = [ "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" ];
    document.querySelector('.report-container .report-container__month').textContent = monthList[month];
    document.querySelector('.inventory-section__report-contents .report-container__month').textContent = monthList[month];
    document.querySelector('.appointment-section__report-contents .report-container__month').textContent = monthList[month];

  } catch (err) {
    console.error('Failed to fetch report dates:', err);
  }
}


// Call this on page load
export default populateReportDates;