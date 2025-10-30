import fetchSwines from "../../api/fetch-swines.js";
import fetchUsers from "../../api/fetch-users.js";
import fetchSwinePopulation from "../../api/fetch-swine-population.js";

const renderSwinePopulationTable = async (municipal) => {
  const tableContainer = document.querySelector('.swine-population__table-container');

  try {
    const [swines, users, populations] = await Promise.all([
      fetchSwines(),
      fetchUsers(),
      fetchSwinePopulation()
    ]);

    console.log(swines);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const targetMunicipal = (municipal || "").toLowerCase().trim();

    // Map userId -> barangay, municipality, sex
    const userMap = {};
    users.forEach(u => {
      userMap[u._id] = {
        barangay: u.barangay || "Unknown",
        municipalityL: (u.municipality || "Unknown").toLowerCase().trim(),
        sex: (u.sex || "").toLowerCase().trim()
      };
    });

    // Barangay structure
    const barangayData = {};
    const ensureBarangay = (brgy) => {
      if (!barangayData[brgy]) {
        barangayData[brgy] = {
          native: { piglet: 0, grower: 0, gilt: 0, barrow: 0, boar: 0, sow: 0 },
          cross:  { piglet: 0, grower: 0, gilt: 0, barrow: 0, boar: 0, sow: 0 },
          raiserIds: new Set(),
          maleIds:   new Set(),
          femaleIds: new Set(),
          maleCount: 0,
          femaleCount: 0,
          raiserCount: 0
        };
      }
      return barangayData[brgy];
    };

    // ============================================
    // 1) Aggregate REGISTERED swines
    // ============================================
    const filteredSwines = swines.filter(swine => swine.status !== 'sold');
    filteredSwines.forEach(swine => {
      const ownerId = swine.clientId;
      const owner = userMap[ownerId];
      if (!owner) return;
      if (owner.municipalityL !== targetMunicipal) return;

      const barangay = owner.barangay;
      const data = ensureBarangay(barangay);

      // Track raisers
      data.raiserIds.add(ownerId);
      if (owner.sex === "male")   data.maleIds.add(ownerId);
      if (owner.sex === "female") data.femaleIds.add(ownerId);

      // Count swine
      const breedType = (swine.breed || "").toLowerCase().trim();
      const category  = (swine.type  || "").toLowerCase().trim();
      const group = breedType === "native" ? data.native : data.cross;
      if (group && Object.prototype.hasOwnProperty.call(group, category)) {
        group[category] += 1;
      }
    });

    // Finalize registered counts
    for (const brgy in barangayData) {
      barangayData[brgy].maleCount   = barangayData[brgy].maleIds.size;
      barangayData[brgy].femaleCount = barangayData[brgy].femaleIds.size;
      barangayData[brgy].raiserCount = barangayData[brgy].raiserIds.size;
    }

    // ============================================
    // 2) Merge MANUAL populations
    // ============================================
    const populationsFromManual = populations.filter(
      p => p.month === currentMonth && p.year === currentYear
    );

    populationsFromManual.forEach(pop => {
      if (!pop?.municipality) return;
      if (pop.municipality.toLowerCase().trim() !== targetMunicipal) return;

      (pop.barangays || []).forEach(bar => {
        const barangay = bar.barangay || "Unknown";
        const data = ensureBarangay(barangay);

        // Merge native heads
        data.native.boar   += bar?.native?.boar       || 0;
        data.native.gilt   += bar?.native?.gilt_sow   || 0;
        data.native.grower += bar?.native?.grower     || 0;
        data.native.piglet += bar?.native?.piglet     || 0;

        // Merge cross heads
        data.cross.boar    += bar?.crossBreed?.boar     || 0;
        data.cross.gilt    += bar?.crossBreed?.gilt_sow || 0;
        data.cross.grower  += bar?.crossBreed?.grower   || 0;
        data.cross.piglet  += bar?.crossBreed?.piglet   || 0;

        // ✅ Merge raiser counts
        data.maleCount   += bar?.maleCount   || 0;
        data.femaleCount += bar?.femaleCount || 0;
        data.raiserCount  = data.maleCount + data.femaleCount;
      });
    });

    // ============================================
    // 3) Build table
    // ============================================
    let rows = '';
    let totalPopulation = 0;
    let totalRaisers = 0;

    const barangaysSorted = Object.keys(barangayData).sort((a, b) =>
      a.localeCompare(b)
    );

    barangaysSorted.forEach(brgy => {
      const data = barangayData[brgy];
      const native = data.native;
      const cross  = data.cross;

      const total =
        native.piglet + native.grower + native.gilt + native.barrow + native.boar + native.sow +
        cross.piglet  + cross.grower  + cross.gilt  + cross.barrow  + cross.boar  + cross.sow;

      totalPopulation += total;

      const raisersDisplay = data.raiserCount ?? 0;
      totalRaisers += raisersDisplay;

      rows += `
        <tr>
          <td class="td-brgy">${brgy}</td>
          <td>${raisersDisplay}</td>
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
    });

    console.log(barangayData)

    const swineTable = `
      <table border="1">
        <thead>
          <tr>
            <th rowspan="2">Barangay</th>
            <th rowspan="2">No. of Raisers</th>
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
          ${rows || '<tr><td colspan="11">No swines found for this municipality</td></tr>'}
          <tr>
            <td><strong>Total Heads</strong></td>
            <td><strong>${totalRaisers}</strong></td>
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


// Download table only — nothing else
document.addEventListener("click", async (e) => {
  if (e.target.id === "downloadSwinePopulationPDF") {
    const tableContainer = document.querySelector(".swine-population__table-container");
    if (!tableContainer || !tableContainer.querySelector("table")) {
      alert("No table found to download.");
      return;
    }

    const { jsPDF } = window.jspdf;

    // Hide buttons temporarily
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => (btn.style.visibility = "hidden"));

    // Capture table as canvas
    const canvas = await html2canvas(tableContainer, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    // ===== HEADER =====
    const municipality = document.getElementById("population-municipality")?.value || "Unknown";
    const now = new Date();
    const monthName = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    const headerTitle = `Swine Inventory Report — ${monthName} ${year}`;
    const subHeader = `Municipality of ${municipality.charAt(0).toUpperCase() + municipality.slice(1)}`;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(headerTitle, pdf.internal.pageSize.getWidth() / 2, 15, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(subHeader, pdf.internal.pageSize.getWidth() / 2, 22, { align: "center" });

    // ===== TABLE IMAGE (MULTI-PAGE SUPPORT) =====
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 30; // start below header

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - position - margin);

    // Add pages if content is longer than one page
    while (heightLeft > 0) {
      pdf.addPage();
      position = margin;
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        position - heightLeft,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight - margin * 2;
    }

    // ===== SAVE FILE =====
    pdf.save(`Swine_Inventory_${municipality}_${monthName}_${year}.pdf`);

    // Restore buttons
    buttons.forEach(btn => (btn.style.visibility = "visible"));
  }
});




export default handleSelectMunicipalOnChange;
