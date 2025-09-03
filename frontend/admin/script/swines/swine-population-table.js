import fetchSwines from "../../api/fetch-swines.js";
import fetchUsers from "../../api/fetch-users.js";
import fetchSwinePopulation from "../../api/fetch-swine-population.js";

const renderSwinePopulationTable = async (municipal) => {
    const tableContainer = document.querySelector('.swine-population__table-container');

    try {
        const [swines, users, populations] = await Promise.all([fetchSwines(), fetchUsers(), fetchSwinePopulation()]);

        // Map userId to barangay and municipality
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = {
                barangay: user.barangay || "Unknown",
                municipality: user.municipality || "Unknown"
            };
        });

        // Group swines by barangay and breed type
        const barangayData = {};

        swines.forEach(swine => {
            const ownerId = swine.clientId;
            const ownerInfo = userMap[ownerId];
            if (!ownerInfo) return;

            if (ownerInfo.municipality !== municipal) return;

            const barangay = ownerInfo.barangay;
            const breedType = (swine.breed || "").toLowerCase(); // Assume 'native' or 'cross'
            const category = swine.type; // piglet, grower, gilt, barrow, boar, sow

            if (!barangayData[barangay]) {
                barangayData[barangay] = {
                    native: { piglet: 0, grower: 0, gilt: 0, barrow: 0, boar: 0, sow: 0 },
                    cross: { piglet: 0, grower: 0, gilt: 0, barrow: 0, boar: 0, sow: 0 }
                };
            }

            const group = breedType === "native" ? barangayData[barangay].native : barangayData[barangay].cross;

            if (category && group[category] !== undefined) {
                group[category]++;
            }
        });


        populations.forEach(pop => {
            if (pop.municipality.toLowerCase() !== municipal.toLowerCase()) return;

            console.log("Matched municipality:", pop.municipality, "Barangays:", pop.barangays.length);

            pop.barangays.forEach(bar => {
                const barangay = bar.barangay;

                if (!barangayData[barangay]) {
                    barangayData[barangay] = {
                        native: { piglet: 0, grower: 0, gilt: 0, barrow: 0, boar: 0, sow: 0 },
                        cross: { piglet: 0, grower: 0, gilt: 0, barrow: 0, boar: 0, sow: 0 }
                    };
                }

                // Merge native
                barangayData[barangay].native.boar    += bar.native.boar || 0;
                barangayData[barangay].native.gilt    += bar.native.gilt_sow || 0;
                barangayData[barangay].native.grower  += bar.native.grower || 0;
                barangayData[barangay].native.piglet  += bar.native.piglet || 0;

                // Merge cross
                barangayData[barangay].cross.boar     += bar.crossBreed.boar || 0;
                barangayData[barangay].cross.gilt     += bar.crossBreed.gilt_sow || 0;
                barangayData[barangay].cross.grower   += bar.crossBreed.grower || 0;
                barangayData[barangay].cross.piglet   += bar.crossBreed.piglet || 0;
            });
        });


        console.log(populations);




        // Build table rows dynamically
        let rows = '';
        let totalPopulation = 0;
        for (const barangay in barangayData) {
            const native = barangayData[barangay].native;
            const cross = barangayData[barangay].cross;

            // Compute total for the row
            const total = (
                native.piglet + native.grower + native.gilt + native.barrow + native.boar + native.sow +
                cross.piglet + cross.grower + cross.gilt + cross.barrow + cross.boar + cross.sow
            );

            rows += `
                <tr>
                    <td class="td-brgy">${barangay}</td>
                    <td>${total}</td>
                    
                    <td>${native.boar}</td>
                    <td>${native.gilt + native.sow}</td>
                    <td>${native.grower + native.barrow}</td>
                    <td>${native.piglet}</td>
                    
                    <td>${cross.boar}</td>
                    <td>${cross.gilt + cross.sow}</td>
                    <td>${cross.grower + cross.barrow}</td>
                    <td>${cross.piglet}</td>
                </tr>
            `;
            totalPopulation += total;
        }

        // Complete table HTML
        const swineTable = `
            <table border="1">
                <thead>
                    <tr>
                        <th rowspan="2">Barangay</th>
                        <th rowspan="2">Total</th>
                        <th colspan="4">Native</th>
                        <th colspan="4">Cross Breed</th>
                    </tr>
                    <tr>
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
                    ${rows || '<tr><td colspan="14">No swines found for this municipality</td></tr>'}
                    <tr>
                        <td><strong>Total Swine</strong></td>
                        <td class="total-population"><strong>${totalPopulation}</strong></td>
                        <td colspan="8"></td>
                    </tr>
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = swineTable;

    } catch (error) {
        console.error("Error fetching swine data:", error);
        tableContainer.innerHTML = "<p>Failed to load swine data.</p>";
    }
};

const handleSelectMunicipalOnChange = () => {
    const selectTag = document.getElementById('population-municipality');
    selectTag.addEventListener('change', () => {
        renderSwinePopulationTable(selectTag.value);
    });
};

export default handleSelectMunicipalOnChange;
