// Imports for data
import fetchSwines from "../../api/fetch-swines.js";
import fetchUsers from "../../api/fetch-users.js";
import addressesData from "../../static-data/addresses.js";
import api from "../../utils/axiosConfig.js";
import popupAlert from "../../utils/popupAlert.js";
import {fetchSwineReports} from "../../api/fetch-report.js";
import fetchSwinePopulation from "../../api/fetch-swine-population.js";
import fetchUser from "../auth/fetchUser.js";

// Buttons
const downloadCurrentBtn = document.querySelector('.current-download-report-btn');
const downloadPastBtn = document.querySelector('.past-download-report-btn');
const saveBtn = document.querySelector('.reports-content__save-report-btn');

// Tables
const tableContainer = document.querySelector('#display-monthly-swines-report-table');
const monthList = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];


const { firstName, lastName, middleName, sex } = await fetchUser();
const prefixMap = {
  male: "Mr",
  female: "Mrs",
};
const AdminPrefix = prefixMap[sex?.toLowerCase()] || "";

const AdminName = `${AdminPrefix}. ${firstName} ${middleName.charAt(0).toUpperCase()}. ${lastName}`;

if (downloadCurrentBtn) {
  downloadCurrentBtn.addEventListener('click', async () => {
    const reportTable = Tabulator.findTable("#swines-report-table")[0];
    if (!reportTable) {
      alert("No current report table found!");
      return;
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const fileName = `swine-report-${monthList[month]}-${year}.pdf`;

    // ✅ Get chart image (base64) from ApexCharts instance
    let chartImg = null;
    if (window.apexDonutInstance) {
      try {
        const dataURI = await window.apexDonutInstance.dataURI();
        chartImg = dataURI.imgURI; // base64 PNG
      } catch (err) {
        console.error("Error generating chart image:", err);
      }
    }

    reportTable.download("pdf", fileName, {
      orientation: "portrait",
      jsPDF: { format: 'legal' },
      autoTable: (doc) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 40;

        // Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("OFFICE OF THE MUNICIPAL AGRICULTURIST MARINDUQUE", pageWidth / 2, y, { align: "center" });

        y += 20;
        doc.setFontSize(12);
        doc.text(`SWINE INVENTORY ${year}`, pageWidth / 2, y, { align: "center" });

        y += 15;
        doc.text(`for ${monthList[month]} ${year}`, pageWidth / 2, y, { align: "center" });

        // ✅ Insert chart image if available
        if (chartImg) {
          y += 15;
          const imgWidth = pageWidth * 0.7;   // scale chart
          const imgHeight = imgWidth * 0.6;   // keep aspect ratio
          const x = (pageWidth - imgWidth) / 2;
          doc.addImage(chartImg, "PNG", x, y, imgWidth, imgHeight);
          y += imgHeight + 20; // move down after chart
        } else {
          y += 20; // spacing if no chart
        }

        // Table after chart
        return {
          startY: y,
          margin: { left: 20, right: 20 },
          styles: { lineColor: [0,0,0], lineWidth: 0.5, textColor: [0,0,0], fontSize: 10 },
          headStyles: { fillColor: [200,200,200], textColor: [0,0,0] },
          bodyStyles: { lineColor: [0,0,0], lineWidth: 0.5 },
          theme: "grid",
        };
      },
      documentProcessing: (doc) => {
        // === Add signatures ONLY ONCE, after table is done ===
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const yPos = pageHeight - 60;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        // Left signature
        doc.line(60, yPos - 15, 220, yPos - 15);
        doc.text(`${AdminName}`, 60, yPos);
        doc.text("Agriculture Technician II", 60, yPos + 15);

        // Right signature
        doc.line(pageWidth - 220, yPos - 15, pageWidth - 60, yPos - 15);
        doc.text("Dr. Josque M. Victoria", pageWidth - 220, yPos);
        doc.text("Provincial Veterinarian", pageWidth - 220, yPos + 15);

        // ✅ In addition to download, also open for printing
        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url);
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      },
    });
  });
}



if (downloadPastBtn) {
  downloadPastBtn.addEventListener('click', async () => {
    const pastTable = Tabulator.findTable("#display-monthly-swines-report-table")[0];
    if (!pastTable) {
      alert("No past report table found!");
      return;
    }

    // ✅ Use the chart instance created in displaySwineReport
    let chartImg = null;
    if (window.apexPastDonut) {
      try {
        const dataURI = await window.apexPastDonut.dataURI();
        chartImg = dataURI.imgURI; // base64 PNG
      } catch (err) {
        console.error("Error generating chart image:", err);
      }
    }

    const year = document.querySelector('.reports-content__select-year')?.value || 'AllYears';
    const month = document.querySelector('.reports-content__select-month')?.value || 'AllMonths';

    // ✅ Fix filename to avoid NaN when month = "AllMonths"
    let monthLabel = "AllMonths";
    if (!isNaN(month) && month > 0) {
      monthLabel = monthList[month - 1];
    }
    const fileName = `swine-report-${monthLabel}-${year}.pdf`;

    pastTable.download("pdf", fileName, {
      orientation: "portrait",
      jsPDF: { format: 'legal' },
      autoTable: (doc) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageMargin = 20;
        let y = 50;

        // Header line 1
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("OFFICE OF THE MUNICIPAL AGRICULTURIST MARINDUQUE", pageWidth / 2, y, { align: "center" });

        // Header line 2
        y += 25;
        doc.setFontSize(12);
        doc.text(`SWINE INVENTORY ${year}`, pageWidth / 2, y, { align: "center" });

        // Header line 3
        y += 15;
        doc.text(`for ${monthLabel} ${year}`, pageWidth / 2, y, { align: "center" });

        // ✅ Insert chart if available
        if (chartImg) {
          y += 15;
          const imgWidth = pageWidth * 0.7;
          const imgHeight = imgWidth * 0.6;
          const x = (pageWidth - imgWidth) / 2;
          doc.addImage(chartImg, "PNG", x, y, imgWidth, imgHeight);
          y += imgHeight + 20;
        } else {
          y += 20;
        }

        // Table after chart
        return {
          startY: y,
          margin: { left: pageMargin, right: pageMargin },
          styles: { lineColor: [0,0,0], lineWidth: 0.5, textColor: [0,0,0], fontSize: 10 },
          headStyles: { fillColor: [200,200,200], textColor: [0,0,0], lineColor: [0,0,0], lineWidth: 0.5 },
          bodyStyles: { lineColor: [0,0,0], lineWidth: 0.5 },
          theme: "grid",
        };
      },
      documentProcessing: (doc) => {
        // === Add signatures ONLY ONCE, after table is done ===
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const yPos = pageHeight - 60;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        // Left signature
        doc.line(60, yPos - 15, 220, yPos - 15);
        doc.text(`${AdminName}`, 60, yPos);
        doc.text("Agriculture Technician II", 60, yPos + 15);

        // Right signature
        doc.line(pageWidth - 220, yPos - 15, pageWidth - 60, yPos - 15);
        doc.text("Dr. Josque M. Victoria", pageWidth - 220, yPos);
        doc.text("Provincial Veterinarian", pageWidth - 220, yPos + 15);
        
        // ✅ In addition to download, also open for printing
        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url);
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      },
    });
  });
}






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
  const populations = await fetchSwinePopulation();

  //Date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const populationsFromManual = populations.filter(population => population.month === currentMonth && population.year === currentYear);

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


  // Data from manual inputs of admin
  const manualCounts = {};

  populationsFromManual.forEach(record => {
    const muni = record.municipality;

    // Sum all male + female counts per barangay
    const total = record.barangays.reduce((sum, b) => {
      const nativeCount =
      (b.native.boar || 0) +
      (b.native.gilt_sow || 0) +
      (b.native.grower || 0) +
      (b.native.piglet || 0)
    ;

    const crossBreedCount =
      (b.crossBreed.boar || 0) +
      (b.crossBreed.gilt_sow || 0) +
      (b.crossBreed.grower || 0) +
      (b.crossBreed.piglet || 0)
    ;

    return sum + nativeCount + crossBreedCount;

    }, 0);

    manualCounts[muni] = (manualCounts[muni] || 0) + total;
  });
  //console.log(manualCounts)


  // Merge the manual data
  for (const muni in manualCounts) {
    if (municipalitySwineCount.hasOwnProperty(muni)) {
      municipalitySwineCount[muni] += manualCounts[muni];
    } else {
      municipalitySwineCount[muni] = manualCounts[muni]; // if new municipality
    }
  }


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
        raisersCount: 0,
        maleRaisers: 0,
        femaleRaisers: 0,
        total: 0,
        piglet: 0,
        grower: 0,
        sow: 0,
        boar: 0
      };
    }

    // Count raiser and gender only once per client
    if (!groupedData[key][swine.clientId]) {
      groupedData[key][swine.clientId] = true; // mark raiser counted
      groupedData[key].raisersCount++; // ✅ update count

      const raiser = raisers.find(r => r._id === swine.clientId);
      if (raiser && raiser.sex) {
        if (raiser.sex.toLowerCase() === "male") {
          groupedData[key].maleRaisers++;
        } else if (raiser.sex.toLowerCase() === "female") {
          groupedData[key].femaleRaisers++;
        }
      }
    }

    // Update swine counts
    groupedData[key].total++;
    if (swineTypeList.includes(swine.type)) {
      groupedData[key][swine.type]++;
    }
  });


  // ============================
  // Merge manual barangay data
  // ============================
  populationsFromManual.forEach(record => {
    const muni = record.municipality;

    record.barangays.forEach(b => {
      const key = `${muni}--${b.barangay}`;
      const male = b.maleCount || 0;
      const female = b.femaleCount || 0;

      if (!groupedData[key]) {
        // ✅ Initialize with raiser counts right away
        groupedData[key] = {
          municipality: muni,
          barangay: b.barangay,
          raisersCount: male + female,
          maleRaisers: male,
          femaleRaisers: female,
          total: 0,
          piglet: 0,
          grower: 0,
          sow: 0,
          boar: 0
        };
      } else {
        // ✅ Add raisers if already exists
        groupedData[key].maleRaisers += male;
        groupedData[key].femaleRaisers += female;
        groupedData[key].raisersCount += male + female;
      }

      // ✅ Compute native + crossBreed totals
      const nativeCount =
        (b.native.boar || 0) +
        (b.native.gilt_sow || 0) +
        (b.native.grower || 0) +
        (b.native.piglet || 0);

      const crossBreedCount =
        (b.crossBreed.boar || 0) +
        (b.crossBreed.gilt_sow || 0) +
        (b.crossBreed.grower || 0) +
        (b.crossBreed.piglet || 0);

      const total = nativeCount + crossBreedCount;

      groupedData[key].total += total;
      groupedData[key].boar += (b.native.boar || 0) + (b.crossBreed.boar || 0);
      groupedData[key].sow += (b.native.gilt_sow || 0) + (b.crossBreed.gilt_sow || 0); // treating gilt_sow as sow
      groupedData[key].grower += (b.native.grower || 0) + (b.crossBreed.grower || 0);
      groupedData[key].piglet += (b.native.piglet || 0) + (b.crossBreed.piglet || 0);
    });
  });



  // Step 3: Convert to array
  swinesTable = Object.values(groupedData);

  new Tabulator("#swines-report-table", {
    data: swinesTable,
    layout: "fitColumns",
    responsiveLayout: true,
    groupBy: "municipality",
    columns: [
      { title: "Barangay", field: "barangay" },
      { title: "No. of Raisers", field: "raisersCount", hozAlign: "center" }, 
      { title: "Male", field: "maleRaisers", hozAlign: "center" },       
      { title: "Female", field: "femaleRaisers", hozAlign: "center" },
      { title: "No. of Swine", field: "total", hozAlign: "center" },
      { title: "Piglet", field: "piglet", hozAlign: "center" },
      { title: "Grower", field: "grower", hozAlign: "center" },
      { title: "Sow/Gilt", field: "sow", hozAlign: "center" },
      { title: "Boar", field: "boar", hozAlign: "center" } 
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
        month: currentDate.getMonth() + 1,
        year: parseInt(currentDate.getFullYear()),
        swineData: swinesTable.map(item => ({
          municipality: item.municipality,
          barangay: item.barangay,
          raisersCount: item.raisersCount,
          maleRaisers: item.maleRaisers,
          femaleRaisers: item.femaleRaisers,
          total: item.total,
          piglet: item.piglet,
          grower: item.grower,
          sow: item.sow,
          boar: item.boar
        }))
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
  if (!window.apexPastDonut) {
    window.apexPastDonut = null;
  }

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

    if (window.apexPastDonut) {
      // ✅ update old chart if it exists
      window.apexPastDonut.updateSeries(series);
    } else {
      // ✅ create the chart and assign globally
      const options = {
        series,
        chart: {
          type: 'donut',
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
              customIcons: []
            }
          }
        },
        legend: {
          fontSize: '18px',
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
      window.apexPastDonut = new ApexCharts(donutElement, options);
      window.apexPastDonut.render();
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
            raisersCount: entry.raisersCount || 0,
            maleRaisers: entry.maleRaisers || 0,
            femaleRaisers: entry.femaleRaisers || 0,
            total: entry.total || 0,
            piglet: entry.piglet || 0,
            grower: entry.grower || 0,
            sow: entry.sow || 0,
            boar: entry.boar || 0
          };
        } else {
          aggregatedDataMap[key].raisersCount += entry.raisersCount || 0;
          aggregatedDataMap[key].maleRaisers += entry.maleRaisers || 0;
          aggregatedDataMap[key].femaleRaisers += entry.femaleRaisers || 0;
          aggregatedDataMap[key].total += entry.total || 0;
          aggregatedDataMap[key].piglet += entry.piglet || 0;
          aggregatedDataMap[key].grower += entry.grower || 0;
          aggregatedDataMap[key].sow += entry.sow || 0;
          aggregatedDataMap[key].boar += entry.boar || 0;
        }
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
        { title: "No. of Raisers", field: "raisersCount", hozAlign: "center" },
        { title: "Male", field: "maleRaisers", hozAlign: "center" },
        { title: "Female", field: "femaleRaisers", hozAlign: "center" },
        { title: "No. of Swine", field: "total", hozAlign: "center" },
        { title: "Piglet", field: "piglet", hozAlign: "center" },
        { title: "Grower", field: "grower", hozAlign: "center" },
        { title: "Sow", field: "sow", hozAlign: "center" },
        { title: "Boar", field: "boar", hozAlign: "center" }
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
