import fetchSwines from "../../../admin/api/fetch-swines.js";
import fetchClient from "../auth/fetch-client.js";
import { fetchAppointments } from "../../../admin/api/fetch-appointments.js";

const displaySwineList = async () => {
  try {
    const client = await fetchClient();
    const clientId = client._id;

    // Fetch all appointments
    const appointments = await fetchAppointments();

    // Collect swineIds from appointments with pending, accepted, or reschedule
    const blockedStatuses = ["pending", "accepted", "reschedule"];
    const blockedSwineIds = appointments
      .filter(app => app.clientId === clientId && blockedStatuses.includes(app.appointmentStatus))
      .flatMap(app => app.swineIds.map(id => id.toString()));

    // Fetch all swine for the client
    const swines = await fetchSwines();
    const filteredSwines = swines.filter(swine => swine.status !== 'sold' || swine.status !== 'deceased');

    const availableSwines = filteredSwines.filter(swine =>
      swine.clientId === clientId &&
      swine.status !== "removed" &&
      !blockedSwineIds.includes(swine._id.toString())
    );

    // Render checkbox list
    let swineList = "";
    availableSwines.forEach(swine => {
      swineList += `
        <label>
          <input type="checkbox" name="swines" value="${swine._id}">
          ${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}
        </label>
      `;
    });

    document.querySelector("#client-swine-list").innerHTML = swineList;

  } catch (err) {
    console.error("Something wrong", err);
  }
};

export default displaySwineList;



















// import fetchSwines from "../../../admin/api/fetch-swines.js";
// import fetchClient from "../auth/fetch-client.js";

// const displaySwineList = async() => {
//     try {
//         const client = await fetchClient();
//         const clientId = client._id;

//         const swines = await fetchSwines();
//         const filterClientSwine = swines.filter(swine => swine.clientId === clientId && swine.status !== 'removed');

//         let swineList = '';

//         filterClientSwine.forEach(swine => {
//             swineList += `
//                 <label><input type="checkbox" name="swines" value="${swine._id}">${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}</label>
//             `;
//         });
//         document.querySelector('#client-swine-list').innerHTML = swineList;

//     } catch (err) {
//         console.log('Something wrong', err);
//     }
    

// }

// export default displaySwineList;