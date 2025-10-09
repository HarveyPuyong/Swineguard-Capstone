import { renderMonitoringList } from "./render-swine-monitoring-list.js";
import fetchSwines from "../../../api/fetch-swines.js";
import {updateSwineId, handleUpdateSwine } from "./update-swine.js";


//Get Swines
const swines = await fetchSwines();


const toggleMonitoring = () => {
    const viewBtn = document.querySelectorAll('.view-more__monitoring-swine');

    viewBtn.forEach(btn => {
        const swineId = btn.dataset.swineId;
        btn.addEventListener('click', () => {
            const swineContainer = btn.closest('.client-swine').querySelector('.bottom');
            swineContainer.classList.toggle('show');
            btn.textContent = btn.textContent === "View" ? "Back" : "View";
            //alert(`Swine Id: ${swineId}`)
        })
    })
}

const toggleUpdateForm = () => {
    const updateBtn = document.querySelectorAll('.update-btn__monitoring-swine');
    const updateForm = document.querySelector('.update-monitoring__client-swine');
    const cancelBtn = document.querySelector('#edit-form-monitoring__cancel-btn');
    const form = document.querySelector('#update-swine__monitoring');
    const fourDigitId = document.querySelector('#swine-four__digit-id');
    const updateFormSubmitBtn = document.querySelector('#edit-form-monitoring__update-btn');


    updateBtn.forEach(btn => {
        const swineId = btn.dataset.swineId;
        btn.addEventListener('click', () => {
            // alert(`Swine Id: ${swineId}`)
            updateForm.classList.add('show');
            updateSwineId(swineId);
            const findSwine = swines.find(s => s._id === swineId);
            const swineType = findSwine.type;

            fourDigitId.textContent = `${swineType.charAt(0).toUpperCase()}${findSwine.swineFourDigitId}`;
        });
    });

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            form.reset();
            updateForm.classList.remove('show');
        })
    }

    if (updateFormSubmitBtn) {
        updateFormSubmitBtn.addEventListener('click', handleUpdateSwine)
    }


}

document.addEventListener('renderMonitoredSwine', () => {
    toggleMonitoring();
    toggleUpdateForm();
})

const setupUpdateForm = () => {
    const selectTag = document.querySelector('#update-form-monitoring__select-swine-health-status');
    const causeInput = document.querySelector('.monitoring__cause-input');
    selectTag.addEventListener('change', () => {
        if (selectTag.value === 'healthy') {
            causeInput.style.display = 'none';
        } else {
            causeInput.style.display = 'block';
        }
    })
}

export default function setupSwineMonitoring() {
    renderMonitoringList();
    setupUpdateForm();
}