// Imports for data

import popupAlert from "../../utils/popupAlert.js";
import api from "../../utils/axiosConfig.js";
import { fetchAppointments } from "../../api/fetch-appointments.js";
import { formatDate, formatedQuantity } from "../../utils/formated-date-time.js";
import { fetchFullInventory } from "../../api/fetch-inventory-stock.js";
import { fetchInventoryReports } from "../../api/fetch-report.js";
import fetchUser from "../auth/fetchUser.js";

// Buttons
const downloadIventoryBtn = document.querySelector('.inventory-download-btn');
const saveBtn = document.querySelector('.inventory-save-report-btn');

// Tables
const tableContainer = document.querySelector('.inventory-section__report-contents #inventory-report-table');
const monthList = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

//Admin Name:
const { firstName, lastName, middleName, sex } = await fetchUser();
const prefixMap = {
  male: "Mr",
  female: "Mrs",
};
const AdminPrefix = prefixMap[sex?.toLowerCase()] || "";

const AdminName = `${AdminPrefix}. ${firstName} ${middleName.charAt(0).toUpperCase()}. ${lastName}`;


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

  let chart; // chart instance for this generate flow

  const updateDonutChart = async (filteredReports) => {
    const itemTypes = {};
    filteredReports.forEach(item => {
      const name = item.itemName || "Unknown";
      // use totalQuantity (matches how you store report rows)
      itemTypes[name] = (itemTypes[name] || 0) + (item.totalQuantity || item.quantity || 0);
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
          height: 500,
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
          fontSize: '14px',
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
      // wait until rendered before using dataURI
      await chart.render();

      // expose chart instance so download handler can access it
      // (use a container keyed object if you later have multiple charts)
      window.inventoryChartInstance = chart;
    }
  };

  const renderTable = (inventory, appointments) => {
    if (tableContainer._tabulator) {
      tableContainer._tabulator.destroy();
    }

    // Step 1: Sum medicine usage by name (used amount from completed appointments)
    const usedByName = {};
    const filteredAppointments = appointments.filter(app => app.appointmentStatus === "completed" && app.medicine);

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

    const mergedData = Object.values(
      inventory.reduce((med, item) => {
        const name = item.itemName;
        if (!med[name]) {
          med[name] = {
            itemName: name,
            totalQuantity: 0,
            usedAmount: usedByName[name] || 0,
            status: 'In Stock',
            expirationCount: 0
          };
        }

        med[name].totalQuantity += item.quantity || item.totalQuantity || 0;

        const today = new Date();
        if (item.expiryDate && new Date(item.expiryDate) < today) {
          med[name].expirationCount += item.quantity || item.totalQuantity || 0;
        }

        const qty = med[name].totalQuantity;
        if (qty === 0) med[name].status = "Out of Stock";
        else if (qty < 20) med[name].status = "Low Stock";
        else med[name].status = "In Stock";

        return med;
      }, {})
    );

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

  // render chart + table
  await updateDonutChart(reports);
  renderTable(reports, appointments);

  // Save monthly report
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const currentDate = new Date();
      const rawData = await tableContainer._tabulator.getData();
      const inventoryData = rawData.map(row => ({
        ...row,
        expiryDate: row.expiryDate ? new Date(row.expiryDate) : null
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

  // Download current (generated) report including chart
  if (downloadIventoryBtn) {
    downloadIventoryBtn.addEventListener('click', async () => {
      const reportTable = Tabulator.findTable("#inventory-report-table")[0];
      if (!reportTable) {
        alert("No current report table found!");
        return;
      }

      // prefer window.inventoryChartInstance (set after render), fallback to local chart
      const chartInstance = window.inventoryChartInstance || chart || null;
      const chartImageRaw = chartInstance ? await chartInstance.dataURI() : null;
      // chart.dataURI() can return { imgURI } or a string — normalize:
      const chartImgURI = chartImageRaw ? (chartImageRaw.imgURI || chartImageRaw.dataURI || chartImageRaw) : null;

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const fileName = `swine-report-${monthList[month]}-${year}.pdf`;

      reportTable.download("pdf", fileName, {
        orientation: "portrait",
        jsPDF: { format: 'legal' },
        autoTable: (doc) => {
          const pageWidth = doc.internal.pageSize.getWidth();
          let y = 50;

          // Header
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text("PROVINCIAL VETERINARY OFFICE of MARINDUQUE", pageWidth / 2, y, { align: "center" });

          y += 25;
          doc.setFontSize(12);
          doc.text(`MEDICINE INVENTORY ${year}`, pageWidth / 2, y, { align: "center" });

          y += 15;
          doc.text(`for ${monthList[month]} ${year}`, pageWidth / 2, y, { align: "center" });

          y += 20;

          // Insert Chart Image if available
          if (chartImgURI) {
            try {
              const imgProps = doc.getImageProperties(chartImgURI);
              const imgWidth = 300;
              const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
              const x = (pageWidth - imgWidth) / 2;
              doc.addImage(chartImgURI, "PNG", x, y, imgWidth, imgHeight);

              y += imgHeight + 20;
            } catch (err) {
              console.warn("Failed to add chart image to PDF:", err);
            }
          }

          // Table starts after chart (or header if no chart)
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
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const yPos = pageHeight - 60;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);

          doc.line(60, yPos - 15, 220, yPos - 15);
          doc.text(`${AdminName}`, 60, yPos);
          doc.text("Agriculture Technician II", 60, yPos + 15);

          doc.line(pageWidth - 220, yPos - 15, pageWidth - 60, yPos - 15);
          doc.text("Dr. Josque M. Victoria", pageWidth - 220, yPos);
          doc.text("Provincial Veterinarian", pageWidth - 220, yPos + 15);

          const blob = doc.output("blob");
          const url = URL.createObjectURL(blob);
          const printWindow = window.open(url);
          if (printWindow) {
            printWindow.onload = () => printWindow.print();
          }
        },
      });
    });
  }
};



// ==========================
// Display Data from the DB (all-time DB)
// ==========================
const displayInventoryReport = async () => {
  const reports = await fetchInventoryReports();

  const yearSelect = document.querySelector('.display-inventory-records .reports-content__select-year');
  const monthSelect = document.querySelector('.display-inventory-records .reports-content__select-month');
  const donutElement = document.querySelector('#display-report-container__doughnut-chart');
  const tableContainer = document.querySelector('#display-inventory-report-table');
  const downloadMontltyReportBtn = document.querySelector('.display-inventory-records .display-inventory-download-btn');

  if (!reports || !yearSelect || !monthSelect || !donutElement || !tableContainer) return;

  let chart;

  const toTitleCase = str => str?.toLowerCase().replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  
  const updateDonutChart = (inventoryData) => {
    const itemTypes = {};
    inventoryData.forEach(item => {
      const name = item.itemName || "Unknown"; // use itemName instead of itemType
      itemTypes[name] = (itemTypes[name] || 0) + (item.totalQuantity || 0); // use totalQuantity
    });

    const series = Object.values(itemTypes);
    const labels = Object.keys(itemTypes).map(toTitleCase);

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
              reset: false
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


  const renderFilteredTable = (year, month) => {
    const filteredReports = reports.filter(report =>
      (!year || report.year === parseInt(year)) &&
      (!month || report.month === parseInt(month))
    );

    const allInventoryData = filteredReports.flatMap(report => report.inventoryData || []);

    if (!allInventoryData.length) {
      donutElement.innerHTML = '<p style="text-align: center;">No data for selected date.</p>';
      tableContainer.innerHTML = '';
      return;
    }

    updateDonutChart(allInventoryData);

    if (tableContainer._tabulator) {
      tableContainer._tabulator.destroy();
    }

    for (const item of allInventoryData) {
      try {
        item.expirationDate = item.expiryDate ? formatDate(item.expiryDate) : 'Not set';
      } catch (e) { item.expiryDate = 'Date format error'; }

      try {
        item.itemQuantity = item.quantity ? formatedQuantity(item.quantity) : 'Not set';
      } catch (e) { item.quantity = 'Quantity format error'; }
    }

    tableContainer._tabulator = new Tabulator(tableContainer, {
      data: allInventoryData,
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

  // Auto-display: current year/month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (yearSelect.value === "") yearSelect.value = currentYear;
  if (monthSelect.value === "") monthSelect.value = currentMonth;

  renderFilteredTable(yearSelect.value, monthSelect.value);

  // Update on selection
  yearSelect.addEventListener('change', () => {
    renderFilteredTable(yearSelect.value, monthSelect.value);
  });

  monthSelect.addEventListener('change', () => {
    renderFilteredTable(yearSelect.value, monthSelect.value);
  });

  // Download Button
  if (downloadMontltyReportBtn) {
    downloadMontltyReportBtn.addEventListener('click', async () => {
      const year = yearSelect.value;
      const month = monthSelect.value;
      const fileName = `inventory-report-${monthList[month-1]}-${year}.pdf`;

      if (tableContainer._tabulator) {
        // 🔹 Get chart image from ApexCharts
        const chartImage = await chart.dataURI();

        tableContainer._tabulator.download("pdf", fileName, {
          orientation: "portrait",
          jsPDF: { format: 'legal' },
          autoTable: (doc) => {
            const pageWidth = doc.internal.pageSize.getWidth();
            let y = 50;

            // Header
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("PROVINCIAL VETERINARY OFFICE of MARINDUQUE", pageWidth / 2, y, { align: "center" });

            y += 25;
            doc.setFontSize(12);
            doc.text(`MEDICINE INVENTORY REPORT`, pageWidth / 2, y, { align: "center" });

            y += 15;
            doc.text(`for ${monthList[month-1]} ${year}`, pageWidth / 2, y, { align: "center" });

            y += 20;

            // 🔹 Insert Chart Image (centered)
            if (chartImage && chartImage.imgURI) {
              const imgProps = doc.getImageProperties(chartImage.imgURI);
              const imgWidth = 300; // adjust size
              const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
              const x = (pageWidth - imgWidth) / 2;
              doc.addImage(chartImage.imgURI, "PNG", x, y, imgWidth, imgHeight);

              y += imgHeight + 20; // leave space after chart
            }

            // Table starts here
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

            // Auto print
            const blob = doc.output("blob");
            const url = URL.createObjectURL(blob);
            const printWindow = window.open(url);
            if (printWindow) {
              printWindow.onload = () => printWindow.print();
            }
          },
        });
      } else {
        alert("No table to export!");
      }
    });
  }

  
};

export {
  generateInventoryReport,
  displayInventoryReport
};
