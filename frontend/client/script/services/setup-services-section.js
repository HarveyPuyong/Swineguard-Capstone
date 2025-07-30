import displayServices from "./display-services.js";

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
});



// ======================================
// ========== Main Function - Setup Services Section
// ======================================
export default function setupServicesSection() {
  displayServices();
}