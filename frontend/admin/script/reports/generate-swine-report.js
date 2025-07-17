// Imports for data
import fetchSwines from "../../api/fetch-swines.js";
import fetchUsers from "../../api/fetch-users.js";
import addressesData from "../../static-data/addresses.js";

// ======================================
// ==========Handle Reports Appointment
// ======================================
const monthSelectTag = document.querySelector('.reports-content__select-month').value;
const yearSelectTag = document.querySelector('.reports-content__select-year');

let doughnutChartInstance = null;
let barChartInstance = null;

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

  // Extract counts in same order as the labels (municipality)
  const swineCounts = municipality.map(muni => municipalitySwineCount[muni]);

  const donutCanvas = document.querySelector('#swines-section #report-container__doughnut-chart')?.getContext('2d');

  if (donutCanvas) {
    if (doughnutChartInstance !== null) {
      doughnutChartInstance.destroy();
    }

    doughnutChartInstance = new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: municipality,
        datasets: [{
          label: 'Swine Count by Municipality',
          data: swineCounts,
          backgroundColor: ['#41B8D5', '#506E9A', '#2D8BBA', '#6CE5E8', '#9C27B0', '#03A9F4'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: context => `${context.label}: ${context.parsed} swines`
            }
          }
        }
      }
    });
  }

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
          municipal: municipality,
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
    const swinesTable = Object.values(groupedData);

    new Tabulator("#swines-report-table", {
      data: swinesTable,
      layout: "fitColumns",
      responsiveLayout: true,
      groupBy: "municipal", // 👈 Group by municipality
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
} 

generateSwineReports();

export default generateSwineReports;