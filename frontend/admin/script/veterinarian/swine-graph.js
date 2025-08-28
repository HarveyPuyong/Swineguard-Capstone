import fetchSwines from '../../api/fetch-swines.js';
import fetchUsers from '../../api/fetch-users.js';

const renderSwineGraph = async () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    let mogpogSwine = 0;
    let boacSwine = 0;
    let gasanSwine = 0;
    let buenavistaSwine = 0;
    let santaCruzSwine = 0;
    let torrijosSwine = 0;

    // Get swine data
    const swines = await fetchSwines();
    const raisers = await fetchUsers();

    swines.forEach(swine => {
        const client = raisers.find(user => user._id === swine.clientId);
        if (!client) return;

        switch (client.municipality.toLowerCase()) {
            case "mogpog": mogpogSwine++; break;
            case "boac": boacSwine++; break;
            case "gasan": gasanSwine++; break;
            case "buenavista": buenavistaSwine++; break;
            case "santacruz": santaCruzSwine++; break;
            case "torrijos": torrijosSwine++; break;
            default: console.log("Unknown location:", client.municipality);
        }
    });

    const swineCounts = [mogpogSwine, boacSwine, gasanSwine, buenavistaSwine, santaCruzSwine, torrijosSwine];
    const totalSwine = swineCounts.reduce((a, b) => a + b, 0);

    const options = {
        series: [{
            name: 'Swine Count',
            data: swineCounts
        }],
        chart: { height: 350, type: 'bar' },
        plotOptions: { bar: { borderRadius: 10, dataLabels: { position: 'top' } } },
        grid: {
            borderColor: '#252525ff', // black horizontal and vertical lines
            row: {
                colors: undefined, // optional: remove alternating row colors
                opacity: 0
            },
            xaxis: {
                lines: { show: false } // hide vertical grid lines if you want
            },
            yaxis: {
                lines: { show: true } // ensure horizontal lines are visible
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                // Convert count to percentage
                const percentage = ((val / totalSwine) * 100).toFixed(1);
                return `${percentage}%`;
            },
            offsetY: -20,
            style: { fontSize: '12px', colors: ["#304758"] }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return `Swine count: ${val}`;
                }
            }
        },
        xaxis: {
            categories: ["Mogpog", "Boac", "Gasan", "Buenavista", "Sta. Cruz", "Torrijos"],
            position: 'top',
            axisBorder: { show: false },
            axisTicks: { show: false },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: { colorFrom: '#D8E3F0', colorTo: '#BED1E6', stops: [0, 100], opacityFrom: 0.4, opacityTo: 0.5 }
                }
            },
            tooltip: { enabled: true }
        },
        yaxis: { labels: { show: false } },
        title: {
            text: `Swine Population in Marinduque, ${currentYear}`,
            floating: true,
            offsetY: 330,
            align: 'center',
            style: { color: '#444' }
        }
    };

    const chart = new ApexCharts(document.querySelector(".swine-graph"), options);
    chart.render();
};

export default renderSwineGraph;
