import addressesData from "../../static-data/addresses.js";
import api from "../../utils/axiosConfig.js";
import popupAlert from "../../utils/popupAlert.js";



const renderAddSwineTable = () => {
    const addSwineContainer = document.querySelector('.add-swine-table');
    const selectMunicipalityEl = document.querySelector('#add-population-municipality');


    selectMunicipalityEl.addEventListener('change', () => {
        const selectedMunicipality = selectMunicipalityEl.value;
        let rows = '';

        if (selectedMunicipality && addressesData[selectedMunicipality]) {
            const barangays = addressesData[selectedMunicipality];
            
            barangays.forEach(barangay => {
                rows += 
                    `<tr>
                        <td  class="header-brgy" >${barangay}</td>
                        <td><input type="number" min="0"></td>
                        <td><input type="number" min="0"></td>
                        <td><input type="number" min="0"></td>
                        <td><input type="number" min="0"></td>
                        <td><input type="number" min="0"></td>
                        <td><input type="number" min="0"></td>
                        
                        <td><input type="number" min="0"></td>
                        <td><input type="number" min="0"></td>
                        <td><input type="number" min="0"></td>
                        <td><input type="number" min="0"></td>
                    </tr>`
                ;
            });
        }

        const tableHTML = `
        <form id="add-swine-population-form">
            <table border="1">
                <thead>
                    <tr>
                        <th rowspan="2">Barangay</th>
                        <th colspan="2">No. of Raisers</th>
                        <th colspan="4">Number of Swine (Native)</th>
                        <th colspan="4">Number of Swine (Cross Breed)</th>
                    </tr>
                    <tr>

                        <th>Male</th>
                        <th>Female</th>

                        <th>Boar</th>
                        <th>Gilt/Sow</th>
                        <th>Grower</th>
                        <th>Piglet</th>

                        <th>Boar</th>
                        <th>Gilt/Sow</th>
                        <th>Grower</th>
                        <th>Piglet</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="14">Select Municipality to add Swine</td></tr>'}
                </tbody>
            </table>

            <div class="table-btn-container">
                <button type="submit">Save</button>
                <button type="reset">Reset</button>
            </div>
        <form>
        `;

        addSwineContainer.innerHTML = tableHTML;


        // Highlight row on input focus
        const rowsHighlights = document.querySelectorAll('tbody tr');
        rowsHighlights.forEach(row => {
            const inputs = row.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    rowsHighlights.forEach(r => r.classList.remove('highlight-row'));
                    row.classList.add('highlight-row');
                });
            });
        });

        const form = document.querySelector('#add-swine-population-form');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = [];
            const rows = form.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const barangay = row.querySelector('.header-brgy')?.innerText.trim();
                const inputs = row.querySelectorAll('input');

                const swineData = {
                    barangay,
                    maleCount: Number(inputs[0].value) || 0,
                    femaleCount: Number(inputs[1].value) || 0,
                    native: {
                        boar: Number(inputs[2].value) || 0,
                        gilt_sow: Number(inputs[3].value) || 0,
                        grower: Number(inputs[4].value) || 0,
                        piglet: Number(inputs[5].value) || 0,
                    },
                    crossBreed: {
                        boar: Number(inputs[6].value) || 0,
                        gilt_sow: Number(inputs[7].value) || 0,
                        grower: Number(inputs[8].value) || 0,
                        piglet: Number(inputs[9].value) || 0,
                    }
                };

                data.push(swineData);
            });

            //console.log("✅ Table Data Stored in Array:", data);

            // Example: Add month/year (you might want dropdowns in your UI)
            const payload = {
                municipality: selectMunicipalityEl.value,
                month: new Date().getMonth() + 1, // current month
                year: new Date().getFullYear(),   // current year
                barangays: data
            };

            try {
                const res = await api.post("/swine/add/swine-population", payload);
                popupAlert("success", res.data.message || "Swine population saved!");
                //console.log("📦 Backend Response:", res.data);
                //form.reset();
            } catch (error) {
                console.error("❌ Error saving data:", error);
                popupAlert("error", error.response?.data?.message || "Failed to save swine population");
            }
        });


    });

}

export default renderAddSwineTable;






