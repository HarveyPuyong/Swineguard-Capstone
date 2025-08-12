// Appointment Graph

const displayDashboardGraphs = async() => {
    const appointmentGraph = document.getElementById('dashboard-section__appointments-graph').getContext('2d');

    const appointmentChart = new Chart(appointmentGraph, {
        type: 'bar',
        data: {
            labels: ['Deworming', 'Iron Supplementation', 'Castration'],
            datasets: [{
            data: [5, 8, 4], 
            backgroundColor: 'rgba(86, 141, 255, 0.5)', 
            borderRadius: 5,
            barThickness: 30
            }]
        },
        options: {
            indexAxis: 'y', 
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            legend: {
                display: false
            }
            },
            scales: {
            x: {
                beginAtZero: true,
                ticks: {
                precision: 0
                }
            }
            }
        }
    });



    // Swine Graph
    const swineGraph = document.getElementById('dashboard-section__swines-graph').getContext('2d');

    const swineChart = new Chart(swineGraph, {
        type: 'bar',
        data: {
            labels: ['Piglet', 'Barrow', 'Gilt', 'Grower', 'Boar', 'Sow'],
            datasets: [{
            data: [2, 2, 1, 6, 1, 1], 
            backgroundColor: [
                '#76f1f2', 
                '#33b8d5', 
                '#1b7fae', 
                '#2a5187', 
                '#7f3f96', 
                '#bd4089'  
            ],
            borderRadius: 5,
            barThickness: 30
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            legend: {
                display: false 
            }
            },
            scales: {
            x: {
                beginAtZero: true,
                ticks: {
                precision: 0
                }
            }
            }
        }
    });



    // Swine Table
    const swineTableData = [
    { type: "Piglet", heads: 2 },
    { type: "Gilt", heads: 1 },
    { type: "Barrow", heads: 2 },
    { type: "Grower", heads: 6 },
    { type: "Boar", heads: 1 },
    { type: "Sow", heads: 1 }
    ];

    const table = new Tabulator("#dashboard-section__swine-table", {
        data: swineTableData,
        layout: "fitColumns",
        columns: [
            { title: "Types", field: "type", hozAlign: "center" },
            {
            title: "Heads",
            field: "heads",
            hozAlign: "center",
            bottomCalc: "sum",
            bottomCalcFormatter: "plaintext",
            bottomCalcFormatterParams: {
                precision: 0
            }
            }
        ],
        rowHeight: 30,
        responsiveLayout: true,
        movableColumns: false,
        rowFormatter: row => {
            row.getElement().style.marginBottom = "6px"; 
        }
    });
}

export default displayDashboardGraphs;