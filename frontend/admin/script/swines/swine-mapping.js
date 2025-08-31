import fetchSwines from "../../api/fetch-swines.js";
import fetchUsers from "../../api/fetch-users.js";


// ======================================
// ========== Number of swine per Municipality Table
// ======================================

const numOfSwinePerMunicipal = async(status) => {
  //Table
  const mogpog = document.querySelector('.municipality.mogpog .number-of-swines');
  const boac = document.querySelector('.municipality.boac .number-of-swines');
  const gasan = document.querySelector('.municipality.gasan .number-of-swines');
  const buenavista = document.querySelector('.municipality.buenavista .number-of-swines');
  const staCruz = document.querySelector('.municipality.sta-cruz .number-of-swines');
  const torrijos = document.querySelector('.municipality.torrijos .number-of-swines');
  const totalSwines = document.querySelector('.total .total-value');

  //Percenatge
  const mogpogPercentage = document.querySelector('#mogpog-percentage');
  const gasanPercentage = document.querySelector('#gasan-percentage');
  const boacPercentage = document.querySelector('#boac-percentage');
  const buenavistaPercentage = document.querySelector('#buenavista-percentage');
  const santacruzPercentage = document.querySelector('#santacruz-percentage');
  const torrijosPercentage = document.querySelector('#torrijos-percentage');

  const swines = await fetchSwines(); // [{ clientId: '...', ... }]
  const users = await fetchUsers();   // [{ _id: '...', municipal: '...' }]

  // Create a map of userId -> municipal
  const userMunicipalMap = {};

  users.forEach(user => {
  if (user._id && user.municipality) {
      userMunicipalMap[user._id] = user.municipality.toLowerCase();
  }
  });

  // Count swines per municipal
  const municipalCounts = {
      mogpog: 0,
      boac: 0,
      gasan: 0,
      buenavista: 0,
      santacruz: 0,
      torrijos: 0
  };

  // Filter from select tag
  if (status === 'all') {
    swines.forEach(swine => {
      const municipal = userMunicipalMap[swine.clientId];
      if (municipal && municipalCounts.hasOwnProperty(municipal) &&
        swine.status !== 'deceased' &&
        swine.status !== 'removed') {
        municipalCounts[municipal]++;
      }
    });
  } else if (status === 'healthy'){
    swines.forEach(swine => {
      const municipal = userMunicipalMap[swine.clientId];
      if (municipal && municipalCounts.hasOwnProperty(municipal) &&
        swine.status === status &&
        swine.status !== 'deceased' &&
        swine.status !== 'removed') {
        municipalCounts[municipal]++;
      }
    });
  } else if (status === 'pregnant'){
    swines.forEach(swine => {
      const municipal = userMunicipalMap[swine.clientId];
      if (municipal && municipalCounts.hasOwnProperty(municipal) &&
        swine.status === status &&
        swine.status !== 'deceased' &&
        swine.status !== 'removed') {
        municipalCounts[municipal]++;
      }
    });
  } else if (status === 'sick'){
    swines.forEach(swine => {
      const municipal = userMunicipalMap[swine.clientId];
      if (municipal && municipalCounts.hasOwnProperty(municipal) &&
        swine.status === status &&
        swine.status !== 'deceased' &&
        swine.status !== 'removed') {
        municipalCounts[municipal]++;
      }
    });
  } else if (status === 'deceased'){
    swines.forEach(swine => {
      const municipal = userMunicipalMap[swine.clientId];
      if (municipal && municipalCounts.hasOwnProperty(municipal) &&
        swine.status === status &&
        swine.status !== 'removed') {
        municipalCounts[municipal]++;
      }
    });
  }

  

  const total = Object.values(municipalCounts).reduce((sum, value) => sum + value, 0);

  // Function to calculate percentage safely
  const getPercentage = (count, total) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
  };

  // Update DOM
  if (mogpog) {
    mogpog.textContent = municipalCounts.mogpog;
    mogpogPercentage.textContent = `${getPercentage(municipalCounts.mogpog, total)}%`;
  }
  if (boac) {
    boac.textContent = municipalCounts.boac;
    boacPercentage.textContent = `${getPercentage(municipalCounts.boac, total)}%`;
  }
  if (gasan) {
    gasan.textContent = municipalCounts.gasan;
    gasanPercentage.textContent = `${getPercentage(municipalCounts.gasan, total)}%`;
  }
  if (buenavista) {
    buenavista.textContent = municipalCounts.buenavista;
    buenavistaPercentage.textContent = `${getPercentage(municipalCounts.buenavista, total)}%`;
  }
  if (staCruz) {
    staCruz.textContent = municipalCounts.santacruz;
    santacruzPercentage.textContent = `${getPercentage(municipalCounts.santacruz, total)}%`;
  }
  if (torrijos) {
    torrijos.textContent = municipalCounts.torrijos;
    torrijosPercentage.textContent = `${getPercentage(municipalCounts.torrijos, total)}%`;
  }

  totalSwines.textContent = total;
    
}



// ======================================
// ========== Toggle municipality
// ======================================
const toggleMunicipality = () => {
  const municipalCards = document.querySelectorAll('.select-status-and-population-container .municipality');
  const municipalHighlights = document.querySelectorAll('.marinduque-map-container__municipal-highlight');
  const selectStatus = document.querySelector('#mapping-contents__select-swine-status');

  const highlightMap = {
    'torrijos': 'torrijos',
    'sta. cruz': 'sta-cruz',
    'sta cruz': 'sta-cruz'
  };

  municipalCards.forEach(card => {
    card.addEventListener('click', () => {
      let label = card.querySelector('.municipality-label').textContent.trim().toLowerCase();

      if (highlightMap[label]) {
        label = highlightMap[label];
      }

      municipalHighlights.forEach(highlight => {
        highlight.classList.remove('show');
        highlight.classList.add('hide');
      });

      const highlightToShow = document.querySelector(`.marinduque-map-container__${label.replace(/\s+/g, '-')}-highlight`);

      if (highlightToShow) {
        highlightToShow.classList.remove('hide');
        highlightToShow.classList.add('show');
      }
    });
  });

  // ✅ Show all highlights when "All" is selected
  selectStatus.addEventListener('change', () => {
    if (selectStatus.value === 'all') {
      municipalHighlights.forEach(highlight => {
        numOfSwinePerMunicipal(selectStatus.value);
        highlight.classList.remove('hide');
        highlight.classList.add('show');
      });
    } else if (selectStatus.value === 'healthy') {
      municipalHighlights.forEach(highlight => {
        numOfSwinePerMunicipal(selectStatus.value);
        highlight.classList.remove('hide');
        highlight.classList.add('show');
      });
    } else if (selectStatus.value === 'pregnant') {
      municipalHighlights.forEach(highlight => {
        numOfSwinePerMunicipal(selectStatus.value);
        highlight.classList.remove('hide');
        highlight.classList.add('show');
      });
    } else if (selectStatus.value === 'sick') {
      municipalHighlights.forEach(highlight => {
        numOfSwinePerMunicipal(selectStatus.value);
        highlight.classList.remove('hide');
        highlight.classList.add('show');
      });
    } else if (selectStatus.value === 'deceased') {
      municipalHighlights.forEach(highlight => {
        numOfSwinePerMunicipal(selectStatus.value);
        highlight.classList.remove('hide');
        highlight.classList.add('show');
      });
    } else {
      municipalHighlights.forEach(highlight => {
        highlight.classList.remove('hide');
        highlight.classList.remove('show');
      });
    }

  });
};



// ======================================
// ========== Number of swine per Municipality Table
// ======================================

const numOfSwinePerMunicipalTable = async () => {
  const tableRows = {
    mogpog: document.querySelector('#graph-table .municipality.mogpog .number-of-swines'),
    boac: document.querySelector('#graph-table .municipality.boac .number-of-swines'),
    gasan: document.querySelector('#graph-table .municipality.gasan .number-of-swines'),
    buenavista: document.querySelector('#graph-table .municipality.buenavista .number-of-swines'),
    santacruz: document.querySelector('#graph-table .municipality.sta-cruz .number-of-swines'),
    torrijos: document.querySelector('#graph-table .municipality.torrijos .number-of-swines'),
  };
  const totalSwines = document.querySelector('#graph-table .total .total-value');

  const swines = await fetchSwines();
  const users = await fetchUsers();

  // Map userId -> municipality
  const userMunicipalMap = {};
  users.forEach(user => {
    if (user._id && user.municipality) {
      userMunicipalMap[user._id] = user.municipality.toLowerCase();
    }
  });

  // Count swines per municipal
  const municipalCounts = {
    mogpog: 0,
    boac: 0,
    gasan: 0,
    buenavista: 0,
    santacruz: 0,
    torrijos: 0
  };

  swines.forEach(swine => {
    const municipal = userMunicipalMap[swine.clientId];
    if (
      municipal &&
      municipalCounts.hasOwnProperty(municipal) &&
      swine.status !== 'deceased' &&
      swine.status !== 'removed'
    ) {
      municipalCounts[municipal]++;
    }
  });

  const total = Object.values(municipalCounts).reduce((sum, value) => sum + value, 0);

  // Helper to avoid NaN%
  const getPercentage = (count, total) => total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";

  // Update DOM with count and %
  for (const [municipality, el] of Object.entries(tableRows)) {
    if (el) {
      el.textContent = `${municipalCounts[municipality]} (${getPercentage(municipalCounts[municipality], total)}%)`;
    }
  }

  totalSwines.textContent = total;
};




// ======================================
// ========== Table navigation Button
// ======================================
const handleGraphNavButton = () => {
  const swineTypeButtons = document.querySelectorAll('.swine-types-list-nav__type');

  // Loop through and add click listener
  swineTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove 'active' from all buttons
      swineTypeButtons.forEach(btn => btn.classList.remove('active'));

      // Add 'active' to the clicked one
      button.classList.add('active');

      // Get the selected type (text content)
      const selectedType = button.textContent.trim();

      // Call your filtering function here
      filterSwinesByType(selectedType);
    });
  });

  // Example filtering function
  function filterSwinesByType(type) {
    type = type.toLowerCase();
    
    if (type === 'piglet') {
      swineMapping(type);
    } else if (type === 'grower') {
      swineMapping(type);
    } else if (type === 'sow') {
      swineMapping(type);
    } else if (type === 'boar') {
      swineMapping(type);
    } else {
      swineMapping('all');
    }
  }


}


// ======================================
// ========== Handle Graph of swine
// ======================================
const swineMapping = async (type) => {
  const chartElement = document.getElementById('swine-type-chart').getContext('2d');

  const swines = await fetchSwines();
  const users = await fetchUsers();

  // Map userId -> municipality
  const userMunicipalMap = {};
  users.forEach(user => {
    if (user._id && user.municipality) {
      userMunicipalMap[user._id] = user.municipality.toLowerCase();
    }
  });

  // Count swines per municipal
  const municipalCounts = {
    mogpog: 0,
    boac: 0,
    gasan: 0,
    buenavista: 0,
    santacruz: 0,
    torrijos: 0
  };

  // Loop once instead of repeating for each type
  swines.forEach(swine => {
    const municipal = userMunicipalMap[swine.clientId];
    const swineType = swine.type?.toLowerCase();
    const isValidStatus = swine.status !== 'deceased' && swine.status !== 'removed';

    if (
      municipal &&
      municipalCounts.hasOwnProperty(municipal) &&
      isValidStatus &&
      (type === 'all' || swineType === type)
    ) {
      municipalCounts[municipal]++;
    }
  });

  // Destroy previous chart if exists to avoid overlap
  if (window.swineChart) {
    window.swineChart.destroy();
  }

  // Create new chart
  window.swineChart = new Chart(chartElement, {
    type: 'bar',
    data: {
      labels: ['Mogpog', 'Boac', 'Gasan', 'Buenavista', 'Sta. Cruz', 'Torrijos'],
      datasets: [{
        label: 'Number of Swines',
        data: [
          municipalCounts.mogpog,
          municipalCounts.boac,
          municipalCounts.gasan,
          municipalCounts.buenavista,
          municipalCounts.santacruz,
          municipalCounts.torrijos
        ],
        backgroundColor: [
          'rgba(100, 149, 237, 0.8)', 
          'rgba(72, 255, 180, 0.8)', 
          'rgba(255, 105, 97, 0.8)',  
          'rgba(144, 238, 144, 0.8)', 
          'rgba(255, 255, 102, 0.8)', 
          'rgba(255, 180, 80, 0.8)'   
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
};




export {
      swineMapping,
      toggleMunicipality,
      numOfSwinePerMunicipalTable,
      handleGraphNavButton

};