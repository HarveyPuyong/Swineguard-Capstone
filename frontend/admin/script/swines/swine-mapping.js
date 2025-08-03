const swineMapping = () => {
   const chartELement = document.getElementById('swine-type-chart').getContext('2d');

    new Chart(chartELement, {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C', 'D', 'E', 'F'],
        datasets: [{
          label: 'Sample Data',
          data: [60, 75, 20, 22, 27, 5],
          backgroundColor: [
            'rgba(100, 149, 237, 0.8)', // blue
            'rgba(72, 255, 180, 0.8)',  // aqua green
            'rgba(255, 105, 97, 0.8)',  // red
            'rgba(144, 238, 144, 0.8)', // light green
            'rgba(255, 255, 102, 0.8)', // yellow
            'rgba(255, 180, 80, 0.8)'   // orange
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 80
          }
        }
      }
    });
}


export default swineMapping;