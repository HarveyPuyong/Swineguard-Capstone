import { fetchAppointments } from "../../api/fetch-appointments.js";

const generateAppointmentReport = () => {
    // Appointment Graph
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



    
}


export {
    generateAppointmentReport
}