// Imports for data

import popupAlert from "../../utils/popupAlert.js";
import api from "../../utils/axiosConfig.js";
import { fetchAppointments } from "../../api/fetch-appointments.js";
import { formatDate, formatedQuantity } from "../../utils/formated-date-time.js";
import { fetchFullInventory } from "../../api/fetch-inventory-stock.js";

// Buttons
const downloadIventoryBtn = document.querySelector('.inventory-download-btn');
const saveBtn = document.querySelector('.inventory-save-report-btn');

// Tables
const tableContainer = document.querySelector('.inventory-section__report-contents #inventory-report-table');
const monthList = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

if (downloadIventoryBtn) {
  downloadIventoryBtn.addEventListener('click', () => {
    const reportTable = Tabulator.findTable("#inventory-report-table")[0];
    if (!reportTable) {
      alert("No current report table found!");
      return;
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const fileName = `swine-report-${monthList[month]}-${year}.pdf`;

    reportTable.download("pdf", fileName, {
      orientation: "portrait",
      jsPDF: { format: 'legal' },
      autoTable: (doc) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 50; // initial top margin for header

        // Draw header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("PROVINCIAL VETERINARY OFFICE of MARINDUQUE", pageWidth / 2, y, { align: "center" });

        y += 25; // spacing to next line
        doc.setFontSize(12);
        doc.text(`MEDICINE INVENTORY ${year}`, pageWidth / 2, y, { align: "center" });

        y += 15; // spacing to next line
        doc.text(`for ${monthList[month]} ${year}`, pageWidth / 2, y, { align: "center" });

        y += 20; // add extra space before table

        // Table starts **after header**
        return {
          startY: y,
          margin: { left: 20, right: 20 },
          styles: { lineColor: [0,0,0], lineWidth: 0.5, textColor: [0,0,0], fontSize: 10 },
          headStyles: { fillColor: [200,200,200], textColor: [0,0,0] },
          bodyStyles: { lineColor: [0,0,0], lineWidth: 0.5 },
          theme: "grid",
        };
      }
    });
  });
}

// ==========================
// Display Data from the DB (all-time DB)
// ==========================

const generateInventoryReport = async () => {

  const reports = await fetchFullInventory();
  const appointments = await fetchAppointments();

  if (!reports || reports.length === 0) {
    tableContainer.innerHTML = 'No inventory data available';
    return;
  }

  const donutElement = document.querySelector(".inventory-section__report-contents #report-container__doughnut-chart");

  let chart;

  const updateDonutChart = (filteredReports) => {
    const itemTypes = {};
    filteredReports.forEach(item => {
      const name = item.itemName; // use itemName from API
      itemTypes[name] = (itemTypes[name] || 0) + item.quantity;
    });

    const series = Object.values(itemTypes);
    const labels = Object.keys(itemTypes).map(label =>
      label
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );

    if (chart) {
      chart.updateOptions({ labels });
      chart.updateSeries(series);
    } else {
      const options = {
        series,
        labels,
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
              reset: false,
              customIcons: []
            }
          }
        },
        legend: {
          fontSize: '16px',
          position: 'right'
        },
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

  const renderTable = (inventory, appointments) => {
    if (tableContainer._tabulator) {
      tableContainer._tabulator.destroy();
    }

    // Step 1: Sum medicine usage by name
    const usedByName = {};
    const filteredAppointments = appointments.filter(app => app.appointmentStatus === "completed" && app.medicine);

    console.log(filteredAppointments)

    filteredAppointments.forEach(app => {
      const appMedId = String(app.medicine?._id || app.medicine);
      const med = inventory.find(i => String(i._id?._id || i._id) === appMedId);

      if (!med) {
        console.warn("No match for appointment medicine:", appMedId);
        return;
      }

      const name = med.itemName;
      const used = app.medicineAmount || 0;
      usedByName[name] = (usedByName[name] || 0) + used;
    });


    // Step 2: Merge into inventory summary by name
    // const mergedData = Object.values(
    //   inventory.reduce((med, item) => {
    //     const name = item.itemName;
    //     if (!med[name]) {
    //       med[name] = {
    //         itemName: name,
    //         totalQuantity: 0,
    //         usedAmount: usedByName[name] || 0,
    //         status: 'In Stock',   // default
    //         expirationDate: 'Varies'
    //       };
    //     }

    //     // accumulate total stock quantity
    //     med[name].totalQuantity += item.quantity || 0;

    //     // update status after summing
    //     const qty = med[name].totalQuantity;
    //     if (qty === 0) {
    //       med[name].status = "Out of Stock";
    //     } else if (qty < 20) {
    //       med[name].status = "Low Stock";
    //     } else {
    //       med[name].status = "In Stock";
    //     }

    //     return med;
    //   }, {})
    // );


    const mergedData = Object.values(
      inventory.reduce((med, item) => {
        const name = item.itemName;
        if (!med[name]) {
          med[name] = {
            itemName: name,
            totalQuantity: 0,
            usedAmount: usedByName[name] || 0,
            status: 'In Stock',   // default
            expirationCount: 0    // count of expired stocks
          };
        }

        // accumulate total stock quantity
        med[name].totalQuantity += item.quantity || 0;

        // ✅ check if this stock is expired
        const today = new Date();
        if (item.expiryDate && new Date(item.expiryDate) < today) {
          med[name].expirationCount += item.quantity || 0; // add the expired quantity
        }

        // update status after summing
        const qty = med[name].totalQuantity;
        if (qty === 0) {
          med[name].status = "Out of Stock";
        } else if (qty < 20) {
          med[name].status = "Low Stock";
        } else {
          med[name].status = "In Stock";
        }

        return med;
      }, {})
    );



    // console.log("Appointments medicine IDs:", filteredAppointments.map(a => a.medicine));
    // console.log("Inventory IDs:", inventory.map(i => i._id));
    //console.log(mergedData);

    tableContainer._tabulator = new Tabulator(tableContainer, {
      data: mergedData,
      layout: "fitColumns",
      responsiveLayout: true,
      columns: [
        { title: "Medicine Name", field: "itemName" },
        { title: "Total Quantity", field: "totalQuantity", hozAlign: "center" },
        { title: "Used Quantity", field: "usedAmount", hozAlign: "center" },
        { title: "Status", field: "status", hozAlign: "center" },
        { title: "Expired Count", field: "expirationCount", hozAlign: "center" }
      ]
    });
  };


  updateDonutChart(reports);
  renderTable(reports, appointments);

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const currentDate = new Date();

      const rawData = await tableContainer._tabulator.getData();
      const inventoryData = rawData.map(row => ({
        ...row,
        expiryDate: new Date(row.expiryDate)  // ensure valid Date
      }));

      const reportData = {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        inventoryData
      };

      try {
        const response = await api.post(`/report/inventory/save`, reportData);
        if (response.status === 200) {
          popupAlert('success', 'Success!', 'Inventory monthly report saved.');
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          popupAlert('error', 'Report Exists', 'A report for this month already exists.');
        } else {
          popupAlert('error', 'Error!', 'Failed to save the report.');
          console.error('Unexpected error:', error);
        }
      }
    });
  }

  
};


// ==========================
// Display Data from the DB (all-time DB)
// ==========================
// const displayInventoryReport = async () => {
//   //const reports = await fetchInventoryReports();

//   const yearSelect = document.querySelector('.display-inventory-records .reports-content__select-year');
//   const monthSelect = document.querySelector('.display-inventory-records .reports-content__select-month');
//   const donutElement = document.querySelector('#display-report-container__doughnut-chart');
//   const tableContainer = document.querySelector('#display-inventory-report-table');
//   const downloadMontltyReportBtn = document.querySelector('.display-inventory-records .display-inventory-download-btn');

//   if (!reports || !yearSelect || !monthSelect || !donutElement || !tableContainer) return;

//   let chart;

//   const toTitleCase = str =>
//     str?.toLowerCase().replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

//   const updateDonutChart = (inventoryData) => {
//     const itemTypes = {};
//     inventoryData.forEach(item => {
//       itemTypes[item.itemType] = (itemTypes[item.itemType] || 0) + item.quantity;
//     });

//     const series = Object.values(itemTypes);
//     const labels = Object.keys(itemTypes).map(toTitleCase);

//     if (chart) {
//       chart.updateOptions({ labels });
//       chart.updateSeries(series);
//     } else {
//       const options = {
//         series,
//         labels,
//         chart: {
//           type: 'donut',
//           height: 752,
//           toolbar: {
//             show: true,
//             tools: {
//               download: true,
//               selection: false,
//               zoom: false,
//               zoomin: false,
//               zoomout: false,
//               pan: false,
//               reset: false
//             }
//           }
//         },
//         legend: {
//           fontSize: '16px',
//           position: 'right'
//         },
//         responsive: [{
//           breakpoint: 480,
//           options: {
//             chart: { width: 200 },
//             legend: { position: 'bottom' }
//           }
//         }]
//       };

//       chart = new ApexCharts(donutElement, options);
//       chart.render();
//     }
//   };

//   const renderFilteredTable = (year, month) => {
//     const filteredReports = reports.filter(report =>
//       (!year || report.year === parseInt(year)) &&
//       (!month || report.month === parseInt(month))
//     );

//     const allInventoryData = filteredReports.flatMap(report => report.inventoryData || []);

//     if (!allInventoryData.length) {
//       donutElement.innerHTML = '<p style="text-align: center;">No data for selected date.</p>';
//       tableContainer.innerHTML = '';
//       return;
//     }

//     updateDonutChart(allInventoryData);

//     if (tableContainer._tabulator) {
//       tableContainer._tabulator.destroy();
//     }

//     for (const item of allInventoryData) {
//       try {
//         item.expirationDate = item.expiryDate ? formatDate(item.expiryDate) : 'Not set';
//       } catch (e) { item.expiryDate = 'Date format error'; }

//       try {
//         item.itemQuantity = item.quantity ? formatedQuantity(item.quantity) : 'Not set';
//       } catch (e) { item.quantity = 'Quantity format error'; }
//     }

//     tableContainer._tabulator = new Tabulator(tableContainer, {
//       data: allInventoryData,
//       layout: "fitColumns",
//       responsiveLayout: true,
//       columns: [
//         { title: "Item Name", field: "itemName" },
//         { title: "Type", field: "itemType", hozAlign: "center", formatter: cell => toTitleCase(cell.getValue()) },
//         { title: "Dosage (mg)", field: "dosage", hozAlign: "center" },
//         { title: "Used Item (mg)", field: "usedDosage", hozAlign: "center" },
//         { title: "Quantity", field: "itemQuantity", hozAlign: "center" },
//         { title: "Status", field: "itemStatus", hozAlign: "center" },
//         { title: "Expiry Date", field: "expirationDate", hozAlign: "center"}
//       ]
//     });
//   };

//   // Auto-display: current year/month
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth() + 1;

//   if (yearSelect.value === "") yearSelect.value = currentYear;
//   if (monthSelect.value === "") monthSelect.value = currentMonth;

//   renderFilteredTable(yearSelect.value, monthSelect.value);

//   // Update on selection
//   yearSelect.addEventListener('change', () => {
//     renderFilteredTable(yearSelect.value, monthSelect.value);
//   });

//   monthSelect.addEventListener('change', () => {
//     renderFilteredTable(yearSelect.value, monthSelect.value);
//   });

//   // Download Button
//   if (downloadMontltyReportBtn) {
//     downloadMontltyReportBtn.addEventListener('click', () => {
//       const year = yearSelect.value;
//       const month = monthSelect.value;
//       const fileName = `inventory-report-${monthList[month-1]}-${year}.pdf`;

//       if (tableContainer._tabulator) {
//         tableContainer._tabulator.download("pdf", fileName, {
//           orientation: "landscape",
//           title: `Inventory Report - ${monthList[month-1]}/${year}`,
//         });
//       } else {
//         alert("No table to export!");
//       }
//     });
//   }
// };

export {
  generateInventoryReport,
  //displayInventoryReport
};
