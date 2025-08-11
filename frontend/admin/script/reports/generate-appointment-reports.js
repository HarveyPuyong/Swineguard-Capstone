import { fetchAppointments } from "../../api/fetch-appointments.js";
import popupAlert from "../../utils/popupAlert.js";
import api from "../../utils/axiosConfig.js";
import { getServiceName } from "../../api/fetch-services.js";
import { getTechnicianName } from "../../api/fetch-technicians.js";
import { getMedicineName } from "../../api/fetch-medicine.js";

// DOM refs
const downloadAppointmentBtn = document.querySelector('.appointment-download-btn');
const tableContainer = document.querySelector('#appointment-report-table');
const monthSelect = document.querySelector('#appointment-month-select');
const yearSelect = document.querySelector('#appointment-years-select');

let currentChart = null;

if (downloadAppointmentBtn) {
  downloadAppointmentBtn.addEventListener('click', () => {
    alert('Download Button clicked');
    // implement download logic here if needed
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
 * Render Tabulator table using already-filtered appointments.
 * This will enrich each appointment by fetching service/vet/medicine names one-by-one.
 * (Note: This is simple but may result in many requests. See comment below for bulk optimization.)
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
  }

  // create Tabulator
  tableContainer._tabulator = new Tabulator(tableContainer, {
    data: appointments,
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    columns: [
      { title: "Municipality", field: "municipality" },
      { title: "Barangay", field: "barangay" },
      { title: "Service", field: "serviceName" },
      { title: "Swine Type", field: "swineType" },
      { title: "Count", field: "swineCount" },
      { title: "Male", field: "swineMale" },
      { title: "Female", field: "swineFemale" },
      { title: "Symptoms", field: "swineSymptoms" },
      { title: "Age (months)", field: "swineAge" },
      {
        title: "Date",
        field: "appointmentDate",
        formatter: function (cell) {
          const date = new Date(cell.getValue());
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
        }
      },
      {
        title: "Time",
        field: "appointmentTime",
        formatter: function (cell) {
          // support values like "08:30" or "08:30:00"
          const raw = cell.getValue();
          const time = new Date(`1970-01-01T${raw}`);
          return isNaN(time.getTime()) ? raw : time.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
          });
        }
      },
      { title: "Type", field: "appointmentType" },
      { title: "Dosage", field: "dosage" },
      { title: "Medicine", field: "medicineName" },
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
