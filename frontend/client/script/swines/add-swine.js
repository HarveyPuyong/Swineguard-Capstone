import api from '../../client-utils/axios-config.js';
import popupAlert from '../../../admin/utils/popupAlert.js';
import { displayClientSwines } from './display-swine.js';
import fetchClient from '../auth/fetch-client.js';

const addSwine = () => {
    const addSwineForm = document.querySelector('#add-swine-form');
    const swineFieldsContainer = document.getElementById('swine-fields-container'); // ✅ needed to clear fields later

    addSwineForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const user = await fetchClient();
            const clientId = user._id;

            const swineGroups = document.querySelectorAll('.swine-input-group');

            if (swineGroups.length === 0) {
                popupAlert('warning', 'No Swine Added', 'Please add at least one swine.');
                return;
            }

            let swineDataArray = [];

            swineGroups.forEach(group => {
                const breed = group.querySelector('[data-field="breed"]').value;
                const type = group.querySelector('[data-field="type"]').value;
                const birthdate = group.querySelector('[data-field="birthdate"]').value;
                const sex = group.querySelector('[data-field="sex"]').value;
                const status = group.querySelector('[data-field="healthStatus"]').value;
                const weight = group.querySelector('[data-field="weight"]').value;

                if (breed && type && birthdate && sex && status && !isNaN(weight)) {
                    swineDataArray.push({
                        breed,
                        type,
                        birthdate,
                        sex,
                        status,
                        weight,
                        clientId
                    });
                }
            });

            if (swineDataArray.length === 0) {
                popupAlert('warning', 'Incomplete Form', 'Please fill in all fields for each swine.');
                return;
            }

            // ✅ Send all swines in one request
            const response = await api.post('/swine/add', { swines: swineDataArray, clientId });

            if (response.status === 201) {

                // ✅ Prepare monthly records array
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1; // 1-12
                const currentYear = currentDate.getFullYear();

                const monthlyRecords = response.data.newSwines.map(swine => ({
                    swineId: swine._id,
                    monthlyStatus: swine.status,
                    monthlyWeight: swine.weight,
                    month: currentMonth,
                    year: currentYear,
                    overwrite: false
                }));

                // ✅ Send all records in one request
                await api.post('/swine/save/monthly-records', { records: monthlyRecords });
                

                popupAlert('success', 'Success', `${swineDataArray.length} swine(s) added successfully.`)
                .then(() => {
                    addSwineForm.reset();
                    swineFieldsContainer.innerHTML = ''; // ✅ clear dynamic fields
                    addSwineForm.classList.remove('show');
                    displayClientSwines();
                });
            }

        } catch (error) {
            console.error(error);
            popupAlert('error', 'Error', `Adding swine error: ${error.response?.data?.message || error.message}`);
        }
    });
};

export default addSwine;
