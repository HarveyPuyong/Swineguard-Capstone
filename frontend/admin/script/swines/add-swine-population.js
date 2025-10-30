// import addressesData from "../../static-data/addresses.js";
// import api from "../../utils/axiosConfig.js";
// import popupAlert from "../../utils/popupAlert.js";



// const renderAddSwineTable = () => {
//     const addSwineContainer = document.querySelector('.add-swine-table');
//     const selectMunicipalityEl = document.querySelector('#add-population-municipality');


//     selectMunicipalityEl.addEventListener('change', () => {
//         const selectedMunicipality = selectMunicipalityEl.value;
//         let rows = '';

//         if (selectedMunicipality && addressesData[selectedMunicipality]) {
//             const barangays = addressesData[selectedMunicipality];
            
//             barangays.forEach(barangay => {
//                 rows += 
//                     `<tr>
//                         <td  class="header-brgy" >${barangay}</td>
//                         <td><input type="number" min="0"></td>
//                         <td><input type="number" min="0"></td>
//                         <td><input type="number" min="0"></td>
//                         <td><input type="number" min="0"></td>
//                         <td><input type="number" min="0"></td>
//                         <td><input type="number" min="0"></td>
                        
//                         <td><input type="number" min="0"></td>
//                         <td><input type="number" min="0"></td>
//                         <td><input type="number" min="0"></td>
//                         <td><input type="number" min="0"></td>
//                     </tr>`
//                 ;
//             });
//         }

//         const tableHTML = `
//         <form id="add-swine-population-form">
//             <table border="1">
//                 <thead>
//                     <tr>
//                         <th rowspan="2">Barangay</th>
//                         <th colspan="2">No. of Raisers</th>
//                         <th colspan="4">Number of Swine (Native)</th>
//                         <th colspan="4">Number of Swine (Cross Breed)</th>
//                     </tr>
//                     <tr>

//                         <th>Male</th>
//                         <th>Female</th>

//                         <th>Boar</th>
//                         <th>Gilt/Sow</th>
//                         <th>Grower</th>
//                         <th>Piglet</th>

//                         <th>Boar</th>
//                         <th>Gilt/Sow</th>
//                         <th>Grower</th>
//                         <th>Piglet</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${rows || '<tr><td colspan="14">Select Municipality to add Swine</td></tr>'}
//                 </tbody>
//             </table>

//             <div class="table-btn-container">
//                 <button type="submit">Save</button>
//                 <button type="reset">Reset</button>
//             </div>
//         <form>
//         `;

//         addSwineContainer.innerHTML = tableHTML;


//         // Highlight row on input focus
//         const rowsHighlights = document.querySelectorAll('tbody tr');
//         rowsHighlights.forEach(row => {
//             const inputs = row.querySelectorAll('input');
//             inputs.forEach(input => {
//                 input.addEventListener('focus', () => {
//                     rowsHighlights.forEach(r => r.classList.remove('highlight-row'));
//                     row.classList.add('highlight-row');
//                 });
//             });
//         });

//         const form = document.querySelector('#add-swine-population-form');
        
//         form.addEventListener('submit', async (e) => {
//             e.preventDefault();

//             const data = [];
//             const rows = form.querySelectorAll('tbody tr');

//             rows.forEach(row => {
//                 const barangay = row.querySelector('.header-brgy')?.innerText.trim();
//                 const inputs = row.querySelectorAll('input');

//                 const swineData = {
//                     barangay,
//                     maleCount: Number(inputs[0].value) || 0,
//                     femaleCount: Number(inputs[1].value) || 0,
//                     native: {
//                         boar: Number(inputs[2].value) || 0,
//                         gilt_sow: Number(inputs[3].value) || 0,
//                         grower: Number(inputs[4].value) || 0,
//                         piglet: Number(inputs[5].value) || 0,
//                     },
//                     crossBreed: {
//                         boar: Number(inputs[6].value) || 0,
//                         gilt_sow: Number(inputs[7].value) || 0,
//                         grower: Number(inputs[8].value) || 0,
//                         piglet: Number(inputs[9].value) || 0,
//                     }
//                 };

//                 data.push(swineData);
//             });

//             //console.log("✅ Table Data Stored in Array:", data);

//             // Example: Add month/year (you might want dropdowns in your UI)
//             const payload = {
//                 municipality: selectMunicipalityEl.value,
//                 month: new Date().getMonth() + 1, // current month
//                 year: new Date().getFullYear(),   // current year
//                 barangays: data
//             };

//             try {
//                 const res = await api.post("/swine/add/swine-population", payload);
//                 popupAlert("success", res.data.message || "Swine population saved!").then(() => {
//                     form.reset();
//                 })
//                 //console.log("📦 Backend Response:", res.data);
//                 //form.reset();
//             } catch (error) {
//                 console.error("❌ Error saving data:", error);
//                 popupAlert("error", error.response?.data?.message || "Failed to save swine population");
//             }
//         });


//     });

// }

// export default renderAddSwineTable;



import addressesData from "../../static-data/addresses.js";
import api from "../../utils/axiosConfig.js";
import popupAlert from "../../utils/popupAlert.js";

const renderAddSwineTable = () => {
  const addSwineContainer = document.querySelector(".add-swine-table");
  const selectMunicipalityEl = document.querySelector("#add-population-municipality");

  selectMunicipalityEl.addEventListener("change", () => {
    const selectedMunicipality = selectMunicipalityEl.value;
    if (!selectedMunicipality || !addressesData[selectedMunicipality]) {
      addSwineContainer.innerHTML = `<p>Select Municipality to add Swine</p>`;
      return;
    }

    const barangays = addressesData[selectedMunicipality];
    const rowsPerPage = 10;
    let currentPage = 1;

    // Persistent data store (empty values)
    const barangayData = barangays.map((barangay) => ({
      barangay,
      maleCount: "",
      femaleCount: "",
      native: { boar: "", gilt_sow: "", grower: "", piglet: "" },
      crossBreed: { boar: "", gilt_sow: "", grower: "", piglet: "" },
    }));

    const renderTable = () => {
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const barangaysToShow = barangayData.slice(start, end);
      const totalPages = Math.ceil(barangays.length / rowsPerPage);

      let rows = "";
      barangaysToShow.forEach((data) => {
        rows += `
          <tr>
            <td class="header-brgy">${data.barangay}</td>
            <td><input type="number" min="0" value="${data.maleCount}"></td>
            <td><input type="number" min="0" value="${data.femaleCount}"></td>
            <td><input type="number" min="0" value="${data.native.boar}"></td>
            <td><input type="number" min="0" value="${data.native.gilt_sow}"></td>
            <td><input type="number" min="0" value="${data.native.grower}"></td>
            <td><input type="number" min="0" value="${data.native.piglet}"></td>
            <td><input type="number" min="0" value="${data.crossBreed.boar}"></td>
            <td><input type="number" min="0" value="${data.crossBreed.gilt_sow}"></td>
            <td><input type="number" min="0" value="${data.crossBreed.grower}"></td>
            <td><input type="number" min="0" value="${data.crossBreed.piglet}"></td>
          </tr>`;
      });

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
            <tbody>${rows}</tbody>
          </table>

          <div class="table-pagination">
            <button type="button" id="prevPage" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
            <span>Page ${currentPage} of ${totalPages}</span>
            <button type="button" id="nextPage" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
          </div>

          <div class="table-btn-container">
            <button type="submit">Save</button>
            <button type="reset">Reset</button>
          </div>
        </form>
      `;

      addSwineContainer.innerHTML = tableHTML;

      // Highlight row
      const rowsHighlights = document.querySelectorAll("tbody tr");
      rowsHighlights.forEach((row) => {
        const inputs = row.querySelectorAll("input");
        inputs.forEach((input) => {
          input.addEventListener("focus", () => {
            rowsHighlights.forEach((r) => r.classList.remove("highlight-row"));
            row.classList.add("highlight-row");
          });
        });
      });

      // Save input values to memory
      const rowsEl = document.querySelectorAll("tbody tr");
      rowsEl.forEach((row, i) => {
        const barangayIndex = start + i;
        const inputs = row.querySelectorAll("input");
        inputs.forEach((input, idx) => {
          input.addEventListener("input", () => {
            const val = input.value;
            switch (idx) {
              case 0: barangayData[barangayIndex].maleCount = val; break;
              case 1: barangayData[barangayIndex].femaleCount = val; break;
              case 2: barangayData[barangayIndex].native.boar = val; break;
              case 3: barangayData[barangayIndex].native.gilt_sow = val; break;
              case 4: barangayData[barangayIndex].native.grower = val; break;
              case 5: barangayData[barangayIndex].native.piglet = val; break;
              case 6: barangayData[barangayIndex].crossBreed.boar = val; break;
              case 7: barangayData[barangayIndex].crossBreed.gilt_sow = val; break;
              case 8: barangayData[barangayIndex].crossBreed.grower = val; break;
              case 9: barangayData[barangayIndex].crossBreed.piglet = val; break;
            }
          });
        });
      });

      // Pagination
      document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderTable();
        }
      });
      document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderTable();
        }
      });

      // Submit (save all pages)
      const form = document.querySelector("#add-swine-population-form");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Convert blanks to 0 before sending
        const sanitizedData = barangayData.map((b) => ({
          ...b,
          maleCount: Number(b.maleCount) || 0,
          femaleCount: Number(b.femaleCount) || 0,
          native: {
            boar: Number(b.native.boar) || 0,
            gilt_sow: Number(b.native.gilt_sow) || 0,
            grower: Number(b.native.grower) || 0,
            piglet: Number(b.native.piglet) || 0,
          },
          crossBreed: {
            boar: Number(b.crossBreed.boar) || 0,
            gilt_sow: Number(b.crossBreed.gilt_sow) || 0,
            grower: Number(b.crossBreed.grower) || 0,
            piglet: Number(b.crossBreed.piglet) || 0,
          },
        }));

        const payload = {
          municipality: selectMunicipalityEl.value,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          barangays: sanitizedData,
        };

        try {
          const res = await api.post("/swine/add/swine-population", payload);
          popupAlert("success", res.data.message || "Swine population saved!").then(() => {
            // Reset all inputs across all pages
            barangayData.forEach((b) => {
              b.maleCount = "";
              b.femaleCount = "";
              b.native = { boar: "", gilt_sow: "", grower: "", piglet: "" };
              b.crossBreed = { boar: "", gilt_sow: "", grower: "", piglet: "" };
            });
            renderTable(); // refresh table to clear inputs
          });
        } catch (error) {
          console.error("❌ Error saving data:", error);
          popupAlert("error", error.response?.data?.message || "Failed to save swine population");
        }
      });
    };

    renderTable();
  });
};

export default renderAddSwineTable;
