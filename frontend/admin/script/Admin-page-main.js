
// report chart: modify pa yung styling neto at naming
const ctx = document.getElementById('report-container__doughnu-chart').getContext('2d');

const myPieChart = new Chart(ctx, {
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
});
