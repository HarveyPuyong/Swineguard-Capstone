// ======================================
// ========== Toggle More Details
// ======================================
const toggleMoreDetails = () => {
  const services = document.querySelectorAll('.services-card-list .service-card');

  services.forEach(service => {
    const moreDetails = service.querySelector('.services-card__description--more-details');
    const toggleBtn = service.querySelector('.service-card-show-more-description-btn');

    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');

      if(toggleBtn.classList.contains('active')){
        moreDetails.classList.add('show');
        toggleBtn.innerText = 'Show Less'
      }else{
        moreDetails.classList.remove('show');
        toggleBtn.innerText = 'Read More'
      }
    })
  });
}



// ======================================
// ========== Main Function - Setup Services Section
// ======================================
export default function setupServicesSection() {
  toggleMoreDetails();
}