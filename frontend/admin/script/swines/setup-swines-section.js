import handleRenderSwines from "./display-swines.js";
import swineMapping from "./swine-mapping.js"


// ======================================
// ========== Search Swines
// ======================================
const searchSwines = () => {
  document.addEventListener('renderSwinesTable', () => {
    const input = document.querySelector('.swines-section__search-input');
    const swines = document.querySelectorAll('.swines-table .swine');

    if (!input || swines.length === 0) return;

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();

      swines.forEach(swine => {
        const id = swine.querySelector('.swine-id')?.textContent.toLowerCase() || '';
        const type = swine.querySelector('.type')?.textContent.toLowerCase() || '';
        const breed = swine.querySelector('.breed')?.textContent.toLowerCase() || '';
        const age = swine.querySelector('.age')?.textContent.toLowerCase() || '';
        const sex = swine.querySelector('.sex')?.textContent.toLowerCase() || '';
        const owner = swine.querySelector('.owner')?.textContent.toLowerCase() || '';
        const location = swine.querySelector('.swine-location')?.textContent.toLowerCase() || '';
        const medication = swine.querySelector('.swine-medication')?.textContent.toLowerCase() || '';
        

        const searchableText = `${id} ${type} ${breed} ${age} ${sex} ${owner} ${location} ${medication}`;

        swine.style.display = searchableText.includes(query) ? 'block' : 'none';
      });
    });
  })
};


// ======================================
// ========== Filter Appointments
// ======================================
const filterSwines = () => {
  document.addEventListener('renderAppointments', () => {
    const selectTypeElement = document.querySelector('.filter-swines');

    selectTypeElement.addEventListener('change', () => {
      const selectedValue = selectTypeElement.value.toLowerCase();

      document.querySelectorAll('#swines-section .swines-table .swine .td.type')
        .forEach(type => {
          const typeValue = type.getAttribute('data-type-value').toLowerCase();
          const swine = type.parentElement.parentElement;
          swine.style.display = 'none';

          if(selectedValue === 'all'){
            swine.style.display = 'block';
          } else if (selectedValue === typeValue) {
            swine.style.display = 'block';
          }
      });
    });
  })
}


// ======================================
// ========== Toggle Swines More-Details
// ======================================
const toggleSwineMoreDetails = () => {
  document.addEventListener('renderSwinesTable', () => {
    const swines = document.querySelectorAll('.swines-table .swine');
      swines.forEach(swine => {
        const toggleBtn = swine.querySelector('.toggle-more-details-btn');
        const moreDetails = swine.querySelector('.swine__more-details');

        toggleBtn.addEventListener('click', () => {
          toggleBtn.classList.toggle('active');

          if(toggleBtn.classList.contains('active')){
            moreDetails.classList.add('show')
          }else{
            moreDetails.classList.remove('show')
          }
        });
      });
  })
}



// ======================================
// ========== Main Function - Setup Swines Section
// ======================================
export default function setupSwinesSection() {
  handleRenderSwines();
  searchSwines();
  filterSwines();
  toggleSwineMoreDetails();
  swineMapping();
}