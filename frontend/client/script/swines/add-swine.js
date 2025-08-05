import api from '../../client-utils/axios-config.js';
import popupAlert from '../../../admin/utils/popupAlert.js';
import {displayClientSwines} from './display-swine.js';
import fetchClient from '../auth/fetch-client.js';

const addSwine = () => {
    const addSwineForm = document.querySelector('#add-swine-form');
    addSwineForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        try {
            const user = await fetchClient();
            const clientId = user._id;
            
            //Swine Details
            const swineData = {
                breed: addSwineForm['select-swine-breed'].value,
                type: addSwineForm['select-swine-type'].value,
                birthdate: addSwineForm['input-swine-birthdate'].value,
                sex: addSwineForm['select-swine-sex'].value,
                status: addSwineForm['select-swine-health-status'].value,
                weight: addSwineForm['swine-weight'].value,
                clientId: clientId
            }

            console.log(swineData);
            const response = await api.post('/swine/add', swineData);
            
            if(response.status === 201) {
                popupAlert('success', 'Success', `New swine added successully`).
                then(() => {
                    addSwineForm.reset();
                    addSwineForm.classList.remove('show');
                    displayClientSwines();
                });    
            }

        } catch (error) {
            console.log(error)
            popupAlert('error', 'Error', `Adding swine error ${error}`)
        }

    });
}


export default addSwine;