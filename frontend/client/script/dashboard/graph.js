// Appointment Graph
import { fetchAppointments } from "../../../admin/api/fetch-appointments.js";
import fetchClient from "../auth/fetch-client.js";
import { getServiceName } from "../../../admin/api/fetch-services.js";
import fetchSwines from "../../../admin/api/fetch-swines.js";


let services = []; // Will hold unique service names
let serviceCounts = {}; // Will hold counts for each service

// FIlter all apointment services users acquired
const addService = (serviceName) => {
    if (!services.includes(serviceName)) {
        services.push(serviceName);
    }
    serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
};


const displayDashboardGraphs = async () => {

    const appointmentGraph = document
        .getElementById('dashboard-section__appointments-graph')
        .getContext('2d');

    // Fetch all appointments
    const appointments = await fetchAppointments();

    // Get logged-in client ID
    const { _id } = await fetchClient();

    // Filter only this client's appointments
    const filteredAppointments = appointments.filter(
        (appointment) => appointment.clientId === _id
    );

    // Add each service and count how many times it appears
    for (const appointment of filteredAppointments) {
        const serviceName = await getServiceName(appointment.appointmentService);
        addService(serviceName);
    }

    // Prepare Chart.js data
    const appointmentChart = new Chart(appointmentGraph, {
        type: 'bar',
        data: {
            labels: services, // Unique service names
            datasets: [
                {
                    data: services.map((name) => serviceCounts[name]), // Counts for each service
                    backgroundColor: 'rgba(86, 141, 255, 0.5)',
                    borderRadius: 5,
                    barThickness: 30,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                    },
                },
            },
        },
    });



    let pigletCount = 0;
    let growerCount = 0;
    let sowCount = 0;
    let boarCount = 0;

    // Swine Graph
    const swineGraph = document.getElementById('dashboard-section__swines-graph').getContext('2d');

    const swines = await fetchSwines();
    const fileteredSwines = swines.filter((swine) => swine.clientId === _id);

    fileteredSwines.forEach(swine => {
        switch (swine.type.toLowerCase()) {
            case 'piglet':
                pigletCount++;
                break;
            case 'grower':
                growerCount++;
                break;
            case 'sow':
                sowCount++;
                break;
            case 'boar':
                boarCount++;
                break;
        }
    });

    const swineChart = new Chart(swineGraph, {
        type: 'bar',
        data: {
            labels: ['Piglet', 'Grower', 'Boar', 'Sow'],
            datasets: [{
            data: [pigletCount, growerCount, boarCount, sowCount], 
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



};





export default displayDashboardGraphs;