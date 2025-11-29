import fetchClient from "./fetch-client.js";
import api from "../../client-utils/axios-config.js";
import popupAlert from "../../../admin/utils/popupAlert.js";
import fetchVerificationImages from "../../../admin/api/fetch-verification-images.js";


const handleSendVerificationBtn = async () => {
    const sendPermitBtn = document.getElementById('send-permit-btn');
    const imageInput = document.getElementById('unverified-user-input');
    const imageVerificationContainer = document.querySelector('.upload-verification-form');

    // Get client userId
    const client = await fetchClient();
    const clientId = client._id;

    sendPermitBtn.addEventListener('click', async () => {

        const file = imageInput.files[0]; // ← REAL FILE

        if (!file) {
            return popupAlert('error', 'Error', 'Please upload your swine permit before sending.');
        }

        // Build form data
        const formData = new FormData();
        formData.append("userId", clientId);
        formData.append("imageFile", file); // MUST MATCH multer.single('imageFile')

        try {
            const response = await api.post("/upload/verification-image",formData);

            if( response.status === 200 ) {
                popupAlert("success", "Success", "Verification permit uploaded!");
                await hideVerificationForm();
            }
            

        } catch (err) {
            console.error(err);
            popupAlert("error", "Error", "Upload failed. Try again.");
        }
    });
};


const handleInvalidImageInput = () => {
    const imageInput = document.getElementById('unverified-user-input');

    imageInput.addEventListener('change', function () {
        const file = this.files[0];

        // Allowed types
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (!file || !allowedTypes.includes(file.type)) {
            popupAlert('error', 'Error', 'Invalid image! Please upload JPG, JPEG, or PNG.');
            this.value = '';
            return;
        }

        // Preview (optional)
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('verification-preview');
            if (preview) preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

const hideVerificationForm = async () => {
    const imageVerificationContainer = document.querySelector('.upload-verification-form');
    const sendPermitBtn = document.getElementById('send-permit-btn');

    // Get client userId
    const client = await fetchClient();
    const clientId = client._id;
    
    const verifiedImages = await fetchVerificationImages();
    const userVerifiedImages = verifiedImages.find(u => u.userId === clientId);

    if (userVerifiedImages) {
        sendPermitBtn.textContent = "Already send permit";
        sendPermitBtn.disabled = true;
        imageVerificationContainer.classList.add('hide');
        return;
    }

}

export default function handleSendVerificationImage() {
    hideVerificationForm();
    handleSendVerificationBtn();
    handleInvalidImageInput();
}