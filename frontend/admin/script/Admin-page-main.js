
// report donut chart: imodify pa yung styling neto at naming
const donutChart = document.querySelector('#appointments-section #report-container__doughnut-chart').getContext('2d');

const myPieChart = new Chart(donutChart, {
  type: 'doughnut',
  data: {
    labels: ['Probiotics', 'Antibiotics', 'Vitamins', 'Iron'],
    datasets: [{
      label: 'Medicine Distribution',
      data: [17.8, 25, 30, 27.2], // percentage values
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  }
})


// report horizontal bar chart: imodify pa yung styling neto at naming
const horizontalBarChart = document.getElementById('appointmentsChart').getContext('2d');
new Chart(horizontalBarChart, {
  type: 'bar',
  data: {
    labels: [
      'Deworming',
      'Iron Supplementation',
      'Castration',
      'Mouth and foot wound treatment',
      'Swine Health Check-up'
    ],
    datasets: [{
      label: 'Number of Appointments',
      data: [167, 201, 102, 15, 55],
      backgroundColor: 'rgba(113, 142, 255, 0.6)', // light blue color
      borderRadius: 5
    }]
  },
  options: {
    indexAxis: 'y', // ⬅️ makes it horizontal
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: horizontalBarChart => horizontalBarChart.parsed.x + ' appointments'
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  }
});


  // appointment report tabel: imodify pa yung styling neto at naming
 const tableData = [
    { barangay: "Mogpog", total: 120, deworming: 41, castration: 20, iron: 41, wound: 12, checkup: 6 },
    { barangay: "Boac", total: 189, deworming: 95, castration: 37, iron: 42, wound: 3, checkup: 9 },
    { barangay: "Balancan", total: 23, deworming: 7, castration: 2, iron: 10, wound: 3, checkup: 1 },
    { barangay: "Bintakay", total: 6, deworming: 1, castration: 4, iron: 0, wound: 1, checkup: 0 },
  ];

  
  const table = new Tabulator("#appointment-report-table", {
    data: tableData,
    layout: "fitColumns", // Fit columns to width of table
    responsiveLayout: true,
    columns: [
      { title: "Barangay", field: "barangay" },
      { title: "No. of Appointments", field: "total", hozAlign: "center" },
      { title: "Deworming", field: "deworming", hozAlign: "center" },
      { title: "Castration", field: "castration", hozAlign: "center" },
      { title: "Iron Supplement", field: "iron", hozAlign: "center" },
      { title: "Wound Treatment", field: "wound", hozAlign: "center" },
      { title: "Check-up", field: "checkup", hozAlign: "center" }
    ]
  });




  // swines report tabel: imodify pa yung styling neto at naming
 const swinesTable = [
    { barangay: "Mogpog", total: 120, deworming: 41, castration: 20, iron: 41, wound: 12, checkup: 6 },
    { barangay: "Boac", total: 189, deworming: 95, castration: 37, iron: 42, wound: 3, checkup: 9 },
    { barangay: "Balancan", total: 23, deworming: 7, castration: 2, iron: 10, wound: 3, checkup: 1 },
    { barangay: "Bintakay", total: 6, deworming: 1, castration: 4, iron: 0, wound: 1, checkup: 0 },
  ];

  
  const swineTable = new Tabulator("#swines-report-table", {
    data: swinesTable,
    layout: "fitColumns", // Fit columns to width of table
    responsiveLayout: true,
    columns: [
      { title: "Barangay", field: "barangay" },
      { title: "No. of Appointments", field: "total", hozAlign: "center" },
      { title: "Deworming", field: "deworming", hozAlign: "center" },
      { title: "Castration", field: "castration", hozAlign: "center" },
      { title: "Iron Supplement", field: "iron", hozAlign: "center" },
      { title: "Wound Treatment", field: "wound", hozAlign: "center" },
      { title: "Check-up", field: "checkup", hozAlign: "center" }
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