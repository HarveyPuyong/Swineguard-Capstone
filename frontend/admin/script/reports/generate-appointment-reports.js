import { fetchAppointments } from "../../api/fetch-appointments.js";
import popupAlert from "../../utils/popupAlert.js";
import { getServiceName } from "../../api/fetch-services.js";
import { getTechnicianName } from "../../api/fetch-technicians.js";
import { getMedicineName } from "../../api/fetch-medicine.js";
import { formatTo12HourTime, formatDate } from "../../utils/formated-date-time.js";

// DOM refs
const downloadAppointmentBtn = document.querySelector('.appointment-download-btn');
const tableContainer = document.querySelector('#appointment-report-table');
const monthSelect = document.querySelector('#appointment-month-select');
const yearSelect = document.querySelector('#appointment-years-select');

let currentChart = null;

const monthList = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

if (downloadAppointmentBtn) {
  downloadAppointmentBtn.addEventListener('click', () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const fileName = `appointment-report-${monthList[month]}-${year}.pdf`;

    if (tableContainer._tabulator) {
      tableContainer._tabulator.download("pdf", fileName, {
        orientation: "landscape",
        title: `Appointment Report - ${monthList[month]}/${year}`,
        jsPDF: { format: 'legal' } 
      });
    } else {
      popupAlert('error', 'Error', 'No table to export!')
    }
  });
}


const generateAppointmentReport = async (year, month) => {
    year = Number(year);
    month = Number(month);

  // fetch appointments once
  const reports = await fetchAppointments();

  if (!reports || reports.length === 0) {
    if (tableContainer) tableContainer.innerHTML = 'No appointment data available';
    if (currentChart) {
      currentChart.destroy();
      currentChart = null;
    }
    return;
  }

  // filter by status + selected month/year (if selected)
  const filteredReports = reports.filter(appointment => appointment.appointmentStatus !== 'removed' && 
                                                        new Date(appointment.appointmentDate).getFullYear() === year &&
                                                        new Date(appointment.appointmentDate).getMonth() + 1 === month);

  if (filteredReports.length === 0) {
    tableContainer.innerHTML = 'No appointment data available';
    if (currentChart) {
      currentChart.destroy();
      currentChart = null;
    }
    return;
  }

  // 1. Count how many appointments per municipality
  const municipalityCount = {};
  filteredReports.forEach(appointment => {
    const muni = appointment.municipality || "Unknown";
    municipalityCount[muni] = (municipalityCount[muni] || 0) + 1;
  });

  // 2. Prepare data for ApexCharts
  const labels = Object.keys(municipalityCount);
  const series = Object.values(municipalityCount);

  // 3. Chart options
  const options = {
    series,
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
    labels,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 752 },
        legend: { position: 'bottom' }
      }
    }]
  };

  // destroy previous chart if exists
  if (currentChart) {
    try { currentChart.destroy(); } catch (e) { /* ignore */ }
    currentChart = null;
  }

  // 4. Render chart
  currentChart = new ApexCharts(
    document.querySelector("#report-container__doughnut-chart-appointment"),
    options
  );
  currentChart.render();

  // 5. Render table
  await renderAppointmentReportTable(filteredReports);
};

/**
 * 
 * Rmder Report Table for appointments
 * 
 */
const renderAppointmentReportTable = async (appointments) => {
  if (!tableContainer) return;

  // destroy existing Tabulator instance if exists
  if (tableContainer._tabulator) {
    try { tableContainer._tabulator.destroy(); } catch (e) { /* ignore */ }
    tableContainer._tabulator = null;
  }

  // Enrich each appointment with readable names (single-ID API helpers)
  // If any id is falsy, helper should return a friendly default.
  for (const appt of appointments) {
    try {
      appt.serviceName = appt.appointmentService ? await getServiceName(appt.appointmentService) : 'Not set';
    } catch (e) { appt.serviceName = 'Service not found'; }

    try {
      appt.vetName = appt.vetPersonnel ? await getTechnicianName(appt.vetPersonnel) : 'Not set';
    } catch (e) { appt.vetName = 'Vet not found'; }

    try {
      appt.medicineName = appt.medicine ? await getMedicineName(appt.medicine) : 'Not set';
    } catch (e) { appt.medicineName = 'Medicine not found'; }

    try {
      appt.time = appt.appointmentTime ? formatTo12HourTime(appt.appointmentTime) : 'Not set';
    } catch (e) { appt.appointmentTime = 'Time format error'; }

    try {
      appt.date = appt.appointmentDate ? formatDate(appt.appointmentDate) : 'Not set';
    } catch (e) { appt.appointmentDate = 'Date format error'; }
  }

  // create Tabulator
  tableContainer._tabulator = new Tabulator(tableContainer, {
    data: appointments,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    columns: [
      { title: "Municipality", field: "municipality", hozAlign: "center" },
      { title: "Barangay", field: "barangay", hozAlign: "center" },
      { title: "Service", field: "serviceName", hozAlign: "center" },
      { title: "Swine Type", field: "swineType" },
      { title: "Count", field: "swineCount", hozAlign: "center" },
      { title: "Male", field: "swineMale", hozAlign: "center" },
      { title: "Female", field: "swineFemale", hozAlign: "center" },
      { title: "Age (months)", field: "swineAge", hozAlign: "center" },
      { title: "Date", field: "date", hozAlign: "center"},
      { title: "Time", field: "time", hozAlign: "center" },
      { title: "Type", field: "appointmentType", hozAlign: "center" },
      { title: "Dosage", field: "dosage", hozAlign: "center" },
      { title: "Medicine", field: "medicineName", hozAlign: "center" },
      { title: "Vet Personnel", field: "vetName" }
    ]
  });
};

// Populate Years dropdown on load
const populateAppointmentYears = async () => {
  try {
    const appointments = await fetchAppointments();
    const years = [
      ...new Set(appointments.map(app => new Date(app.createdAt).getFullYear()))
    ].sort((a, b) => b - a); // newest first

    if (!yearSelect) return;
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    years.forEach(year => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error populating appointment years:", err);
  }
};

// run on page load
populateAppointmentYears();



function handleReportChange() {
    yearSelect.addEventListener('change', handleReportChange);
    monthSelect.addEventListener('change', handleReportChange);
    const year = yearSelect.value;
    const month = monthSelect.value;

    if (year && month) {
        generateAppointmentReport(year, month);
    }
}

export { handleReportChange };
