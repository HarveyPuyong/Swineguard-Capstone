import fetchSwines from "../../api/fetch-swines.js";
import fetchUsers from "../../api/fetch-users.js";

const renderSwinePopulationTable = async (municipal) => {
    const tableContainer = document.querySelector('.swine-population__table-container');

    try {
        // Fetch swine and user data
        const [swines, users] = await Promise.all([fetchSwines(), fetchUsers()]);

        // Map userId to barangay and municipality
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = {
                barangay: user.barangay || "Unknown",
                municipality: user.municipality || "Unknown"
            };
        });

        // Group swines by barangay for the specified municipality
        const barangayData = {};

        swines.forEach(swine => {
            const ownerId = swine.clientId;
            const ownerInfo = userMap[ownerId];

            if (!ownerInfo) return; // Skip if no owner info found

            // ✅ Filter by municipality
            if (ownerInfo.municipality !== municipal) return;

            const barangay = ownerInfo.barangay;
            const category = swine.type;

            if (!barangayData[barangay]) {
                barangayData[barangay] = {
                    total: 0,
                    piglet: 0,
                    grower: 0,
                    gilt: 0,
                    barrow: 0,
                    boar: 0,
                    sow: 0
                };
            }

            barangayData[barangay].total++;

            if (category && barangayData[barangay][category] !== undefined) {
                barangayData[barangay][category]++;
            }
        });

        // Build table rows dynamically
        let rows = '';
        for (const barangay in barangayData) {
            const data = barangayData[barangay];
            rows += `
                <tr>
                    <td>${barangay}</td>
                    <td>${data.total}</td>
                    <td>${data.piglet}</td>
                    <td>${data.grower}</td>
                    <td>${data.gilt + data.barrow}</td>
                    <td>${data.barrow}</td>
                    <td>${data.sow}</td>
                </tr>
            `;
        }

        // Complete table HTML
        const swineTable = `
            <table>
                <thead>
                    <tr>
                        <th>Barangay</th>
                        <th>No. of Swine</th>
                        <th>Piglet</th>
                        <th>Grower</th>
                        <th>Gilt/Barrow</th>
                        <th>Boar</th>
                        <th>Sow</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="7">No swines found for this municipality</td></tr>'}
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
}

export default handleSelectMunicipalOnChange;
