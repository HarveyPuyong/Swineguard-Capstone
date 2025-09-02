import handleRenderSwines from "./display-swines.js";
import {generateSwineReports, displaySwineReport} from "../reports/generate-swine-report.js";
import populateReportDates from "../reports/setup-reports.js";
import { toggleMunicipality, numOfSwinePerMunicipalTable, handleGraphNavButton, swineMapping} from "./swine-mapping.js"
import handleSelectMunicipalOnChange from "./swine-population-table.js";
import renderAddSwineTable from "./add-swine-population.js";


// ======================================
// ========== View Button (View Graph, Generate Report) Buttons Functionality
// ======================================
const viewBtnsFunctionality = () => {
  const swineTableContents = document.querySelector('.swines-section__table-contents');
  const backToTableBtn = document.querySelectorAll('#swines-section .back-table-btn');
  const swineMappingContents = document.querySelector('.swine-section__mapping-contents');
  const swineReportContents = document.querySelector('.swine-section__report-contents');

  const viewReportsBtn = document.querySelector('.swines-section__buttons-container .view-reports-btn');
  const viewGraphBtn = document.querySelector('.swines-section__buttons-container .view-graph-btn');



  if(viewReportsBtn) viewReportsBtn.addEventListener('click', () => {
                      swineTableContents.classList.remove('show');
                      swineReportContents.classList.add('show');

                      // Wait for DOM to update
                      setTimeout(() => {
                        generateSwineReports();
                        displaySwineReport();
                      }, 100);
                    });

  backToTableBtn.forEach(btn => {
    btn.addEventListener('click', () => {
                    swineTableContents.classList.add('show');
                    swineReportContents.classList.remove('show');
                    swineMappingContents.classList.remove('show');
                  });
  })

  
  if(viewGraphBtn) viewGraphBtn.addEventListener('click', () => {
    swineTableContents.classList.remove('show');
    swineMappingContents.classList.add('show');
  })
}


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
// ========== Filter Swine
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
// ========== Change Content Functionality
// ======================================
const changeContentsFunctionality = () => {
  const mappingContents = document.querySelector('.swine-section__mapping-contents');
  const tableContents = document.querySelector('.swines-section__table-contents');
  const reportContents =  document.querySelector('.swine-section__report-contents');

  const viewMappingContentBtn = document.querySelector('.mapping-contents__show-map-btn');

  // Show Map COntent
  viewMappingContentBtn.addEventListener('click', () => {
    tableContents.classList.remove('show');
    mappingContents.classList.add('show');
  });

}


const mappingContentToggleMapAndGraph = () => {
  const mapWrapper = document.querySelector('.mapping-contents__map-wrapper');
  const graphWrapper = document.querySelector('.mapping-contents__swine-type-graph-wrapper');
  const swinePopulationTableContainer = document.querySelector('.swine-population-table');
  const addSwinePopulationTableContainer = document.querySelector('.add-swine-population-container');

  const showMapBtn = document.querySelector('.mapping-contents__show-map-btn');
  const showGraphBtn = document.querySelector('.mapping-contents__show-graph-btn');
  const addSwineBtn = document.querySelector('.mapping-contents__show-add-swine-btn')

  // Show Graph
  showGraphBtn.addEventListener('click', () => {
    mapWrapper.classList.remove('show');
    graphWrapper.classList.add('show');
    swinePopulationTableContainer.classList.add('show');
    addSwinePopulationTableContainer.classList.remove('show');

    showMapBtn.classList.remove('active');
    showGraphBtn.classList.add('active');
    addSwineBtn.classList.remove('active');

    // Display the default graph
    swineMapping('all');
  });

  // Show Map
  showMapBtn.addEventListener('click', () => {
    mapWrapper.classList.add('show');
    graphWrapper.classList.remove('show');
    swinePopulationTableContainer.classList.remove('show');
    addSwinePopulationTableContainer.classList.remove('show');

    showMapBtn.classList.add('active');
    showGraphBtn.classList.remove('active');
    addSwineBtn.classList.remove('active');
  });

  //Show Add swine Table
  addSwineBtn.addEventListener('click', () => {
    mapWrapper.classList.remove('show');
    graphWrapper.classList.remove('show');
    swinePopulationTableContainer.classList.remove('show');
    addSwinePopulationTableContainer.classList.add('show');

    showMapBtn.classList.remove('active');
    showGraphBtn.classList.remove('active');
    addSwineBtn.classList.add('active');
  })
}




// ======================================
// ========== Main Function - Setup Swines Section
// ======================================
export default function setupSwinesSection() {
  populateReportDates();
  handleRenderSwines();
  searchSwines();
  filterSwines();
  toggleSwineMoreDetails();
  viewBtnsFunctionality();
  changeContentsFunctionality();
  mappingContentToggleMapAndGraph();
  toggleMunicipality();
  numOfSwinePerMunicipalTable();
  handleGraphNavButton();
  handleSelectMunicipalOnChange();
  renderAddSwineTable();
}