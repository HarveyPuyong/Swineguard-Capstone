import fetchSwines from "../../../admin/api/fetch-swines.js";
import fetchClient from "../auth/fetch-client.js";

const displaySwineList = async() => {
    try {
        const client = await fetchClient();
        const clientId = client._id;

        const swines = await fetchSwines();
        const filterClientSwine = swines.filter(swine => swine.clientId === clientId && swine.status !== 'removed');

        let swineList = '';

        filterClientSwine.forEach(swine => {
            swineList += `
                <label><input type="checkbox" name="swines" value="${swine._id}"> ${swine.swineFourDigitId}</label>
            `;
        });
        document.querySelector('#client-swine-list').innerHTML = swineList;

    } catch (err) {
        console.log('Something wrong', err);
    }
    

}

export default displaySwineList;