// Imports for data
import fetchSwines from "../../api/fetch-swines.js";
import fetchUsers from "../../api/fetch-users.js";
import addressesData from "../../static-data/addresses.js";
import api from "../../utils/axiosConfig.js";
import popupAlert from "../../utils/popupAlert.js";
import {fetchSwineReports} from "../../api/fetch-report.js";

// Buttons
const downloadCurrentBtn = document.querySelector('.current-download-report-btn');
const downloadPastBtn = document.querySelector('.past-download-report-btn');
const saveBtn = document.querySelector('.reports-content__save-report-btn');

// Tables
const tableContainer = document.querySelector('#display-monthly-swines-report-table');
const monthList = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

if (downloadCurrentBtn) {
  downloadCurrentBtn.addEventListener('click', () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const fileName = `swine-report-${monthList[month]}-${year}.pdf`;

    if (tableContainer._tabulator) {
      tableContainer._tabulator.download("pdf", fileName, {
        orientation: "landscape",
        title: `Swine Report - ${monthList[month]}/${year}`,
        jsPDF: { format: 'legal' } 
      });
    } else {
      alert("No table to export!");
    }
  });
}

if (downloadPastBtn) {
  downloadPastBtn.addEventListener('click', () => {
    const year = document.querySelector('.reports-content__select-year')?.value || 'AllYears';
    const month = document.querySelector('.reports-content__select-month')?.value || 'AllMonths';
    const fileName = `swine-report-${monthList[month-1]}-${year}.pdf`;

    if (tableContainer._tabulator) {
      tableContainer._tabulator.download("pdf", fileName, {
        orientation: "landscape",
        title: `Swine Report - ${monthList[month-1]}/${year}`,
        jsPDF: { format: 'legal' } 
      });
    } else {
      alert("No table to export!");
    }
  });
}

// ======================================
// ==========Handle Reports Appointment
// ======================================

let doughnutChartInstance = null;
let swinesTable = [];

// Get all Municipalities and Barangays from the JSON
const municipality = Object.keys(addressesData);

let barangay = [];
municipality.forEach(muni => {
    barangay.push(...addressesData[muni]);
});

const generateSwineReports = async() => {

  // ============================
  // Doughnut Chart
  // ============================
  const swines = await fetchSwines();
  const raisers = await fetchUsers();

  // Create a map of userId → municipality
  const userMunicipalityMap = {};
  raisers.forEach(user => {
    userMunicipalityMap[user._id] = user.municipality;
  });

  // Count swines per municipality
  const municipalitySwineCount = {};
  municipality.forEach(muni => municipalitySwineCount[muni] = 0); // initialize to 0

  swines.forEach(swine => {
    const userId = swine.clientId;
    const userMunicipality = userMunicipalityMap[userId];

    if (userMunicipality && municipalitySwineCount.hasOwnProperty(userMunicipality)) {
      municipalitySwineCount[userMunicipality]++;
    }
  });

  // Prepare data for ApexCharts
  const swineCounts = municipality.map(muni => municipalitySwineCount[muni]);
  const donutElement = document.querySelector('.current-report-container .current-doughnut-chart');

  if (donutElement) {
    // If there's an existing chart instance, destroy or reassign it
    if (window.apexDonutInstance) {
      window.apexDonutInstance.destroy();
    }

    const options = {
      series: swineCounts,
      chart: {
        type: 'donut',
        height: 752,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        }
      },
      labels: municipality,
      dataLabels: {
        enabled: true,
        formatter: (val, opts) => {
          return `${Math.round(val)}%`;
        }
      },
      legend: {
        fontSize: '18px',
        position: 'right'
      },
      tooltip: {
        y: {
          formatter: (value, opts) => `${value} swines`
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            fontSize: '18px',
            position: 'right'
          }
        }
      }]
    };

    window.apexDonutInstance = new ApexCharts(donutElement, options);
    window.apexDonutInstance.render();
  }

  // console.log('swines:', swines);
  // console.log('raisers:', raisers);
  // console.log('userMunicipalityMap:', userMunicipalityMap);
  // console.log('municipalitySwineCount:', municipalitySwineCount);
  // console.log('swineCounts:', swineCounts);

  // ============================
  // Swine Table
  // ============================
  const swineTypeList = ['piglet', 'grower', 'sow', 'boar'];

  // Step 1: Map clientId to municipality and barangay
  const userMap = {};
  raisers.forEach(user => {
    userMap[user._id] = {
      municipality: user.municipality,
      barangay: user.barangay
    };
  });

  // Step 2: Group swines per municipality & barangay
  const groupedData = {};

  swines.forEach(swine => {
    const user = userMap[swine.clientId];
    if (!user) return;

    const { municipality, barangay } = user;
    const key = `${municipality}--${barangay}`;

    if (!groupedData[key]) {
      groupedData[key] = {
        municipality: municipality,
        barangay: barangay,
        total: 0,
        piglet: 0,
        grower: 0,
        sow: 0,
        boar: 0,
      };
    }

    // Update swine counts
    groupedData[key].total++;
    if (swineTypeList.includes(swine.type)) {
      groupedData[key][swine.type]++;
    }
  });

  // Step 3: Convert to array
  swinesTable = Object.values(groupedData);

  new Tabulator("#swines-report-table", {
    data: swinesTable,
    layout: "fitColumns",
    responsiveLayout: true,
    groupBy: "municipality", // 👈 Group by municipality
    columns: [
      { title: "Barangay", field: "barangay" },
      { title: "No. of Swine", field: "total", hozAlign: "center" },
      { title: "Piglet", field: "piglet", hozAlign: "center" },
      { title: "Grower", field: "grower", hozAlign: "center" },
      { title: "Sow", field: "sow", hozAlign: "center" },
      { title: "Boar", field: "boar", hozAlign: "center" },
    ]
  });

  //appointment schedule calendar
  document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('appointment-schedule-calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: [
        { title: 'Health Surveillance', date: '2025-05-01' },
        { title: 'Castration', date: '2025-05-02' },
        { title: 'Check Ups', date: '2025-05-09' }
      ]
    });
    calendar.render();
  });


  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {

      const currentDate = new Date();

      const reportData = {
        month: currentDate.getMonth() + 1 ,
        year: parseInt(currentDate.getFullYear()),
        swineData: swinesTable  // swinesTable must be globally available
      };

      try {
        const response = await api.post(`/report/save`, reportData);
        if (response.status === 200) {
          popupAlert('success', 'Success!', 'Swine monthly report saved.');
        } 

      } catch (error) {
          console.error("Full error object:", error);

          if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
          }

          if (error.response && error.response.status === 409) {
            const confirmOverwrite = confirm(error.response.data?.message || "Report already exists. Overwrite?");
            if (confirmOverwrite) {
              try {
                const overwriteResponse = await api.post(`/report/save`, { 
                  ...reportData, 
                  overwrite: true 
                });
                popupAlert('success', 'Success!', overwriteResponse.data.message);
              } catch (overwriteErr) {
                popupAlert('error', 'Error!', 'Failed to overwrite the report.');
              }
            }
          } else {
            popupAlert('error', 'Error!', 'Failed to save the report.');
            console.error('Unexpected error:', error);
          }
        }
    });
  }
  
} 


// ==========================
// Display Data from the DB (all-time DB)
// ==========================

const displaySwineReport = async () => {
  const reports = await fetchSwineReports();
  if (!reports || reports.length === 0) {
    document.querySelector('#display-monthly-swines-report-table').innerHTML = 'No Data for this month';
    return };

  const yearSelect = document.querySelector('.reports-content__select-year');
  const monthSelect = document.querySelector('.reports-content__select-month');
  const donutElement = document.querySelector(".record-pie-chart");

  let chart; // holds ApexCharts instance

  const updateDonutChart = (filteredReports) => {
    let mogpogTotal = 0;
    let boacTotal = 0;
    let gasanTotal = 0;
    let buenavistaTotal = 0;
    let staCruzTotal = 0;
    let torrijosTotal = 0;

    filteredReports.forEach(report => {
      report.swineData.forEach(entry => {
        switch (entry.municipality) {
          case "Mogpog": mogpogTotal += entry.total; break;
          case "Boac": boacTotal += entry.total; break;
          case "Gasan": gasanTotal += entry.total; break;
          case "Buenavista": buenavistaTotal += entry.total; break;
          case "SantaCruz": staCruzTotal += entry.total; break;
          case "Torrijos": torrijosTotal += entry.total; break;
        }
      });
    });

    const series = [mogpogTotal, boacTotal, gasanTotal, buenavistaTotal, staCruzTotal, torrijosTotal];

    if (chart) {
      chart.updateSeries(series);
    } else {
      const options = {
        series,
        chart: {
          type: 'donut',
          toolbar: {
            show: true, // ✅ show the dropdown menu
            tools: {
              download: true,  // allows image download
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
              customIcons: [] // you can add your own buttons here if needed
            }
          }
        },
        legend: {
          fontSize: '18px',  // ✅ now properly applied
          position: 'right'
        },
        labels: ['Mogpog', 'Boac', 'Gasan', 'Buenavista', 'Sta Cruz', 'Torrijos'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: 'bottom' }
          }
        }]
      };
      chart = new ApexCharts(donutElement, options);
      chart.render();
    }
  };

  // Render Table
  const renderFilteredTable = (year, month) => {
    const filteredReports = reports.filter(report =>
      (!year || report.year === parseInt(year)) &&
      (!month || report.month === parseInt(month))
    );

    // Update donut chart with filtered data
    updateDonutChart(filteredReports);

    const aggregatedDataMap = {};

    filteredReports.forEach(report => {
      report.swineData.forEach(entry => {
        const key = `${entry.municipality}--${entry.barangay}`;

        if (!aggregatedDataMap[key]) {
          aggregatedDataMap[key] = {
            municipality: entry.municipality,
            barangay: entry.barangay,
            total: 0,
            piglet: 0,
            grower: 0,
            sow: 0,
            boar: 0,
          };
        }

        aggregatedDataMap[key].total += entry.total;
        aggregatedDataMap[key].piglet += entry.piglet;
        aggregatedDataMap[key].grower += entry.grower;
        aggregatedDataMap[key].sow += entry.sow;
        aggregatedDataMap[key].boar += entry.boar;
      });
    });

    const aggregatedSwineData = Object.values(aggregatedDataMap);

    if (tableContainer._tabulator) {
      tableContainer._tabulator.destroy();
    }

    tableContainer._tabulator = new Tabulator(tableContainer, {
      data: aggregatedSwineData,
      layout: "fitColumns",
      responsiveLayout: true,
      groupBy: "municipality",
      columns: [
        { title: "Barangay", field: "barangay" },
        { title: "No. of Swine", field: "total", hozAlign: "center" },
        { title: "Piglet", field: "piglet", hozAlign: "center" },
        { title: "Grower", field: "grower", hozAlign: "center" },
        { title: "Sow", field: "sow", hozAlign: "center" },
        { title: "Boar", field: "boar", hozAlign: "center" },
      ]
    });
  };

  // Initial render (all data)
  renderFilteredTable();

  // Event listeners to update chart and table
  yearSelect?.addEventListener('change', () => {
    const selectedYear = yearSelect.value;
    const selectedMonth = monthSelect.value;
    renderFilteredTable(selectedYear, selectedMonth);
  });

  monthSelect?.addEventListener('change', () => {
    const selectedYear = yearSelect.value;
    const selectedMonth = monthSelect.value;
    renderFilteredTable(selectedYear, selectedMonth);
  });
};

export {
  generateSwineReports,
  displaySwineReport
};
