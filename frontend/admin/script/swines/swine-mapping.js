import fetchSwines from "../../api/fetch-swines.js";
import fetchUsers from "../../api/fetch-users.js";


const swineMapping = () => {
   const chartELement = document.getElementById('swine-type-chart').getContext('2d');

    new Chart(chartELement, {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C', 'D', 'E', 'F'],
        datasets: [{
          label: 'Sample Data',
          data: [60, 75, 20, 22, 27, 5],
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
}


// ======================================
// ========== Number of swine per Municipality Table
// ======================================

const numOfSwinePerMunicipal = async() => {

    const mogpog = document.querySelector('.municipality.mogpog .number-of-swines');
    const boac = document.querySelector('.municipality.boac .number-of-swines');
    const gasan = document.querySelector('.municipality.gasan .number-of-swines');
    const buenavista = document.querySelector('.municipality.buenavista .number-of-swines');
    const staCruz = document.querySelector('.municipality.sta-cruz .number-of-swines');
    const torrijos = document.querySelector('.municipality.torrijos .number-of-swines');
    const totalSwines = document.querySelector('.total .total-value');

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

    swines.forEach(swine => {
        const municipal = userMunicipalMap[swine.clientId];
        if (municipal && municipalCounts.hasOwnProperty(municipal)) {
            municipalCounts[municipal]++;
        }
    });

    // Update DOM
    if (mogpog) mogpog.textContent = municipalCounts.mogpog;
    if (boac) boac.textContent = municipalCounts.boac;
    if (gasan) gasan.textContent = municipalCounts.gasan;
    if (buenavista) buenavista.textContent = municipalCounts.buenavista;
    if (staCruz) staCruz.textContent = municipalCounts.santacruz;
    if (torrijos) torrijos.textContent = municipalCounts.torrijos;

    const total = Object.values(municipalCounts).reduce((sum, value) => sum + value, 0);
    totalSwines.textContent = total;
    
}


export {
    swineMapping,
    numOfSwinePerMunicipal

};