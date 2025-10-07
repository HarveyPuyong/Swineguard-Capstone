import fetchSwines from "../../../admin/api/fetch-swines.js";
import fetchClient from "../auth/fetch-client.js";
import { formatDate } from "../../client-utils/checkDates.js";

//Get client Id
const client = await fetchClient();
const clientId = client._id;

// Max weight to sell
const Min_Swine_Weight = 50;
const Max_Swine_Weight = 100;

// Get swine of the client
const swines = await fetchSwines();
const clientSwines = swines.filter(swine => swine.clientId === clientId && ((swine.status === 'healthy' && swine.type === 'grower') && swine.weight >= Min_Swine_Weight)).sort((a, b) => b.weight - a.weight);
const swineTotal = swines.filter(swine => swine.clientId === clientId && (swine.status !== 'sold' && swine.status !== 'deceased'));
const soldSwines = swines.filter(swine => swine.clientId === clientId && swine.status === 'sold');
const deceasedSwines = swines.filter(swine => swine.status === 'deceased');


// ======================================
// ========== Ready to Sell
// ======================================
const displayReadyToSellSwine = () => {
    let readyToSellHTML = '';

    if (clientSwines.length === 0) {
        readyToSellHTML = `<p class="no-grower-heading">No grower yet.</p>`
    }

    clientSwines.forEach(swine => {
        readyToSellHTML += `
            <div class="client-swine">
                <div class="progress-header">
                    <img class="swine-card-record__image" src="${swine.swineProfileImage ? '/uploads/' + swine.swineProfileImage : 'images-and-icons/icons/swine-image.png'}" alt="swine-image">
                    <div class="left">
                        <p class="swine-four-digit-id">${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}</p>
                        <p>${swine.type.charAt(0).toUpperCase()}${swine.type.slice(1)}</p>
                    </div>
                    <span class="line"></span>
                    <div class="right">
                        <p>${swine.weight} kg</p>
                    </div>
                </div>
            </div>
        `;
    });

    document.querySelector('.swine-to-sell__swine-container').innerHTML = readyToSellHTML;

    // For Progress Bar
    const totalSwine = swineTotal.length;
    const readyToSell = clientSwines.length;

    const progressBar = document.querySelector('#client-swine__progress-bar'); // Progress Bar
    progressBar.max = totalSwine;
    progressBar.value = readyToSell;

    const percentageForSwine = (readyToSell / totalSwine) * 100;
    document.querySelector('#client-swine__to-sell__percentage').textContent = `${percentageForSwine.toFixed(1)}%`; // Percentage Text
    const progressBarTxt = document.querySelector('#progress-bar__Txt');

    if (totalSwine === 0 || readyToSell === 0) {
        progressBarTxt.textContent = "No swine available to sell.";
    } else if (readyToSell === 1) {
        progressBarTxt.textContent = `${readyToSell} swine is available to sell.`
    } else {
        progressBarTxt.textContent = `${readyToSell} out of ${totalSwine} swine are available to sell.`;
    }
}


// ======================================
// ========== Already Sold Swine
// ======================================
const displaySoldSwine = () => {
    let soldSwineHTML = '';

    if (soldSwines.length === 0) {
        soldSwineHTML = `
            <p class="no-grower-heading">No swine sold yet.</p>
        `;
    }

    soldSwines.forEach(swine => {
        soldSwineHTML += `
            <div class="client-swine">
                <p>Date: ${formatDate(swine.updatedAt)}</p>
                <div class="progress-header">
                    <img class="swine-card-record__image" src="${swine.swineProfileImage ? '/uploads/' + swine.swineProfileImage : 'images-and-icons/icons/swine-image.png'}" alt="swine-image">
                    <div class="left">
                        <p class="swine-four-digit-id">${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}</p>
                        <p>${swine.type.charAt(0).toUpperCase()}${swine.type.slice(1)}</p>
                    </div>
                    <span class="line"></span>
                    <div class="right">
                        <p>${swine.weight} kg</p>
                    </div>
                </div>
            </div>
        `;
    });
    document.querySelector('.sold-swine__container').innerHTML = soldSwineHTML;
}


// ======================================
// ========== Already Sold Swine
// ======================================
const displayDeceasedSwine = () => {
    let deceasedSwineHTML = '';

    if(deceasedSwines.length === 0 ) {
        deceasedSwineHTML = `
            <div class="deceased-swine__no-swine">
                <p>No Deceased Swine</p>
            </div>
        `;
    }

    deceasedSwines.forEach(swine => {
        deceasedSwineHTML += `
            <div class="client-swine">
                <div class="progress-header">
                    <img class="swine-card-record__image" src="${swine.swineProfileImage ? '/uploads/' + swine.swineProfileImage : 'images-and-icons/icons/swine-image.png'}" alt="swine-image">
                    <div class="left">
                        <p class="swine-four-digit-id">${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}</p>
                        <p>${swine.type.charAt(0).toUpperCase()}${swine.type.slice(1)}</p>
                    </div>
                    <span class="line"></span>
                    <div class="right">
                        <p>${swine.cause}</p>
                    </div>
                </div>
            </div>
        `;
    });
    document.querySelector('.deceased-swine__container').innerHTML = deceasedSwineHTML;
}



export default function swineRecords() {
    displayReadyToSellSwine();
    displaySoldSwine();
    displayDeceasedSwine();
}