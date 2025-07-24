import fetchSwineReports from "../../api/fetch-report.js";

async function populateReportDates() {
  try {

    const swineReports = await fetchSwineReports();

    const selectTag = document.querySelector('.reports-content__select-year');
    if (!selectTag) return;

    selectTag.innerHTML = '<option value="">Select Year</option>';

    // Extract unique years
    const uniqueYears = [...new Set(swineReports.map(report => report.year))];

    uniqueYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;

        selectTag.appendChild(option);
    });

    // Optional: Show no records message
    if (uniqueYears.length === 0) {
      const option = document.createElement('option');
      option.disabled = true;
      option.textContent = 'No reports available';
      selectTag.appendChild(option);
    }


  } catch (err) {
    console.error('Failed to fetch report dates:', err);
  }
}

// Call this on page load
export default populateReportDates;