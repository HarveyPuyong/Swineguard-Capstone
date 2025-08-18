import displayServices from "./display-services.js";
import sideNavFuntionality from "../side-nav.js";

// ======================================
// ========== Toggle More Details
// ======================================
const toggleMoreDetails = () => {
  const services = document.querySelectorAll('.services-card-list .service-card');

  services.forEach(service => {
    const moreDetails = service.querySelector('.services-card__description--more-details');
    const shortDetails = service.querySelector('.services-card__description--details');
    const toggleBtn = service.querySelector('.service-card-show-more-description-btn');

    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');

      if (toggleBtn.classList.contains('active')) {
        moreDetails.classList.add('show');
        shortDetails.classList.add('hide');
        toggleBtn.innerText = 'Show Less';
      } else {
        moreDetails.classList.remove('show');
        shortDetails.classList.remove('hide');
        toggleBtn.innerText = 'Read More';
      }
    });
  });
}


// ======================================
// ✅ Event listener for dynamic content
// ======================================
document.addEventListener('renderClientServices', () => {
  toggleMoreDetails(); // Runs only after profile HTML is rendered
  availServiceListener();
});



// ======================================
// ========== Go to profile details in settings section
// ======================================
const availServiceListener = () => {
  const sections = document.querySelectorAll('section');
  const serviceCardAvailBtn = document.querySelectorAll('.service-card-btn .service-card-request-appointment-btn');

  serviceCardAvailBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceId = e.currentTarget.dataset.serviceid; 
      alert(`Service ID: ${serviceId}`);
      
    });
  });
};



// ======================================
// ========== Go to profile details in settings section
// ======================================
const redirectNotifToAppointmentSection = () => {
  const sections = document.querySelectorAll('section');
  const notificationCards = document.querySelectorAll('.notif-list .notif');

  notificationCards.forEach(notifCard => {
    notifCard.addEventListener('click', () => {
      // Hide all sections
      sections.forEach(section => {
        section.classList.remove('show');
        section.classList.add('hide');
      });

      // Show appointments section
      const appointmentSection = document.getElementById('appointments-section');
      if (appointmentSection) {
        appointmentSection.classList.remove('hide');
        appointmentSection.classList.add('show');
      }

      // Optional: re-run sidenav highlight/active logic
      sideNavFuntionality();
    });
  });
};

document.addEventListener('renderClientNotification', () => {
  redirectNotifToAppointmentSection();
})


// ======================================
// ========== Main Function - Setup Services Section
// ======================================
export default function setupServicesSection() {
  displayServices();
}