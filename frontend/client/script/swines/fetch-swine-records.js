import api from "../../client-utils/axios-config.js";

const getSwineRecords = async() => {
    try {
        ///get/montly-swine-records
        const response = await api.get('/swine/get/montly-swine-records'); // Adjust route if needed
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export default getSwineRecords;