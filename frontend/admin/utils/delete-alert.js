import handleRenderServices from "../script/service/dispay-services.js";
import api from "./axiosConfig.js";

const deletePopUpAlert = async(endpoints, origin) => {
    Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
            const response = await api.delete(endpoints);

            if (response.status === 200 && origin === 'services') {
                Swal.fire("Deleted!", "Service has been deleted.", "success");
                handleRenderServices(); // refresh list
            }
            } catch (err) {
            const errMessage =
                err.response?.data?.message || err.response?.data?.error || "Something went wrong.";
            popupAlert("error", "Error!", errMessage);
            }
        }
    });
}

export default deletePopUpAlert;