import { renderMonitoringList, renderMonitoringPastList } from "./render-swine-monitoring-list.js";
import fetchSwines from "../../../api/fetch-swines.js";
import {updateSwineId, handleUpdateSwine } from "./update-swine.js";
import fetchUser from "../../auth/fetchUser.js";


//Get Swines
const swines = await fetchSwines();


const toggleMonitoring = (containerSelector) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const viewBtns = container.querySelectorAll('.view-more__monitoring-swine');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const swineContainer = btn.closest('.client-swine').querySelector('.bottom');
      swineContainer.classList.toggle('show');
      btn.textContent = btn.textContent === "View" ? "Back" : "View";
    });
  });
};

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
  toggleMonitoring('.swine-monitoring-list');
  toggleUpdateForm();
});

document.addEventListener('renderPastMonitoredSwine', () => {
  toggleMonitoring('.monitoring-history__list');
});

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

const togglehistoryList = async() => {
    const vet = await fetchUser();
    const role = vet.roles;

    if (role[0] !== "veterinarian") {
        return;
    }

    const historyBtn = document.querySelector('.history-btn');
    const monitoringContainer = document.querySelector('.swine-monitoring-list');
    const historyContainer = document.querySelector('.monitoring-history__container');

    historyBtn.addEventListener('click', () => {
        const isHistoryVisible = historyContainer.classList.contains('show');

        if (isHistoryVisible) {
            // Go back to original state
            historyContainer.classList.remove('show');
            monitoringContainer.classList.remove('hide');
            historyBtn.textContent = "Monitoring History";
        } else {
            // Show history container
            monitoringContainer.classList.add('hide');
            historyContainer.classList.add('show');
            
            historyBtn.textContent = "Back";
        }
    });
};

export default function setupSwineMonitoring() {
    renderMonitoringList();
    renderMonitoringPastList();
    setupUpdateForm();
    togglehistoryList();
}