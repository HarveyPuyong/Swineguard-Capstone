import setupHeader from "./header.js";
import sideNavFuntionality from "./sidenav.js";
import setupSettingsSection from "./setting/setup-setting-section.js";


setupHeader();
sideNavFuntionality();
setupSettingsSection();



// report donut chart: imodify pa yung styling neto at naming
  const donutChart = document.querySelector('#dashboard-section #appointment-doughnut-chart').getContext('2d');

  const myPieChart = new Chart(donutChart, {
    type: 'doughnut',
    data: {
      labels: ['Complete', 'Incomplete'],
      datasets: [{
        label: 'Medicine Distribution',
        data: [50, 50], 
        backgroundColor: ['#ef6c6d', '#365a98'],
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