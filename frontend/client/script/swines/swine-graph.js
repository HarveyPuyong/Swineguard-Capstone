

const lineGraph = (swineMontlyWeight) => {

    // Extract month names and weights
    const months = swineMontlyWeight.map(item => item.month); 
    const weights = swineMontlyWeight.map(item => item.weight); 
    var options = {
          series: [{
            name: "Weight (kg)",
            data: weights
        }],
          chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Montly swine weight',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: months,
        }
    };

    var chart = new ApexCharts(document.querySelector("#swine-health__history-list"), options);
    chart.render();
}


const barGraph = (categories, series) => {
    const options = {
        series: series,
        chart: {
            type: 'bar',
            height: 350,
            stacked: false
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '100%',
                borderRadius: 5,
                borderRadiusApplication: 'end'
            }
        },
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: categories
        },
        yaxis: {
            title: {
                text: 'Weight (kg)'
            }
        },
        grid: {
            borderColor: '#414141ff', // ✅ Makes grid lines more visible (optional)
            strokeDashArray: 0
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " kg";
                }
            }
        }
    };

    const chart = new ApexCharts(document.querySelector("#swine-records-graph"), options);
    chart.render();
};






export {
    lineGraph,
    barGraph
}