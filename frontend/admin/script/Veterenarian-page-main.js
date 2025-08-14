import setupHeader from "./header.js";
import sideNavFuntionality from "./sidenav.js";
import setupSettingsSection from "./setting/setup-setting-section.js";
import setupMessagesSection from "./messages/setup-messages-section.js";
import setupVeterinarian from "./veterinarian/setup-veterinarian.js";
import {fetchAppointments} from "./../api/fetch-appointments.js"
import fetchUser from "./auth/fetchUser.js";
import handleLogout from "./auth/logout.js";
import handleNotification from "./notification/handle-notification.js";


setupHeader();
sideNavFuntionality();
setupMessagesSection();
setupSettingsSection();
setupVeterinarian();
handleNotification();



// appointment complete status donot chart
  const donutChart = document.querySelector('#dashboard-section #appointment-doughnut-chart').getContext('2d');
  const { _id } = await fetchUser();
  const appoinments = await fetchAppointments();
  const completedTask = appoinments.filter(task => task.appointmentStatus === 'completed' && task.vetPersonnel === _id).length;
  const incompleteTask = appoinments.filter(task => !task.appointmentStatus.includes('completed') && task.vetPersonnel === _id).length;


  document.querySelector('#incomplete-value').textContent = incompleteTask;
  document.querySelector('#complete-value').textContent = completedTask;

  const myPieChart = new Chart(donutChart, {
    type: 'doughnut',
    data: {
      labels: ['Complete', 'Incomplete'],
      datasets: [{
        label: 'Appointments Complete Status',
        data: [completedTask, incompleteTask], 
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
            callbacks: {
              label: function(context) {
                const dataset = context.dataset.data;
                const total = dataset.reduce((sum, val) => sum + val, 0);
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1) + '%';
                return `${context.label}: ${percentage}`;
              }
            }
          }
        }
      }
    }
  });