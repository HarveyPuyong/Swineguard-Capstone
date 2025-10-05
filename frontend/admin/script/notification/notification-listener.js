
const adminNotifListener = () => {
  const notificationItems = document.querySelectorAll('.notif-list .notif');

  notificationItems.forEach(item => {
    item.addEventListener('click', () => {
      const userSection = document.getElementById('users-section'); // change to your actual section id
      const sections = document.querySelectorAll('section');

      sections.forEach(section => {
        if(section === userSection){
          section.classList.add('show');
          section.classList.remove('hide');
        } else {
          section.classList.remove('show');
          section.classList.add('hide');
        }
      });

      // Optionally close side-nav if mobile
      const sidenav = document.querySelector('nav.side-nav');
      if(sidenav.classList.contains('show')){
        sidenav.classList.remove('show');
      }
    });
  });
};

// Trigger listener every time notifications are rendered
document.addEventListener('renderAdminNotification', () => {
  adminNotifListener();
});

const appointmentCoordinatorNotifListener = () => {
  const notificationItems = document.querySelectorAll('.notif-list .notif');

  notificationItems.forEach(item => {
    item.addEventListener('click', () => {
      const appointmentSection = document.getElementById('appointments-section'); // change to your actual section id
      const sections = document.querySelectorAll('section');

      sections.forEach(section => {
        if(section === appointmentSection){
          section.classList.add('show');
          section.classList.remove('hide');
        } else {
          section.classList.remove('show');
          section.classList.add('hide');
        }
      });

      // Optionally close side-nav if mobile
      const sidenav = document.querySelector('nav.side-nav');
      if(sidenav.classList.contains('show')){
        sidenav.classList.remove('show');
      }
    });
  });
};

// Trigger listener every time notifications are rendered
document.addEventListener('renderACNotification', () => {
  appointmentCoordinatorNotifListener();
});

const inventoryCoordinatorNotifListener = () => {
  const notificationItems = document.querySelectorAll('.notif-list .notif');

  notificationItems.forEach(item => {
    item.addEventListener('click', () => {
      const inventorySection = document.getElementById('inventory-section'); // change to your actual section id
      const sections = document.querySelectorAll('section');

      sections.forEach(section => {
        if(section === inventorySection){
          section.classList.add('show');
          section.classList.remove('hide');
        } else {
          section.classList.remove('show');
          section.classList.add('hide');
        }
      });

      // Optionally close side-nav if mobile
      const sidenav = document.querySelector('nav.side-nav');
      if(sidenav.classList.contains('show')){
        sidenav.classList.remove('show');
      }
    });
  });
};

// Trigger listener every time notifications are rendered
document.addEventListener('renderICNotification', () => {
  inventoryCoordinatorNotifListener();
});


const veterinarianNotifListener = () => {
  const notificationItems = document.querySelectorAll('.notif-list .notif');

  notificationItems.forEach(item => {
    item.addEventListener('click', () => {
      const scheduleSection = document.getElementById('schedule-section'); // change to your actual section id
      const sections = document.querySelectorAll('section');

      sections.forEach(section => {
        if(section === scheduleSection){
          section.classList.add('show');
          section.classList.remove('hide');
        } else {
          section.classList.remove('show');
          section.classList.add('hide');
        }
      });

      // Optionally close side-nav if mobile
      const sidenav = document.querySelector('nav.side-nav');
      if(sidenav.classList.contains('show')){
        sidenav.classList.remove('show');
      }
    });
  });
};
// Trigger listener every time notifications are rendered
document.addEventListener('renderVetNotification', () => {
  veterinarianNotifListener();
});

// Export the function
export {
    adminNotifListener,
    appointmentCoordinatorNotifListener,
    inventoryCoordinatorNotifListener,
    veterinarianNotifListener
};
