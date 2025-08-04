  import api from "../../client-utils/axios-config.js";
  import popupAlert from "../../../admin/utils/popupAlert.js";

  const sendOtp = async(clientEmail) => {
    if (!clientEmail) return;
    try {
      const response = await api.post('/auth/send-otp',  { email: clientEmail });
      popupAlert('success', 'Success', `OTP sended successfully to '${clientEmail}'`);
    } catch (error) {
      console.log(error);
      const errMessage = error.response?.data?.message || error.response?.data?.error;
      popupAlert('error', 'Error!', errMessage);
    }
  }


  export default sendOtp;