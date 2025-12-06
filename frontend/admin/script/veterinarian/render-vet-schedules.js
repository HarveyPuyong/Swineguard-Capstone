import { fetchSchedules } from "../../api/fetch-schedules.js";
import fetchUser from "../auth/fetchUser.js";
import { formattedDate } from "../../utils/formated-date-time.js";
import { handleEditScheduleFromSection } from "./handle-schedule-from-calendar.js";
import api from "../../utils/axiosConfig.js";

const renderSchedulesFromCalendar = async () => {
    
    // Get Vet Id
    const user = await fetchUser();
    const vetId = user._id;

    const role = user.roles[0];

    const allowedUsers = ["veterinarian","technician"];

    if (!allowedUsers.includes(role)) {
        return;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    
    const vetSchedules = await fetchSchedules();
    const filterSchedule = vetSchedules.filter(sched => sched.userId === vetId);

    let todayVetSchedulesHTML = '';
    let upcomingVetSchedulesHTML = '';
    let pastVetSchedulesHTML = '';

    filterSchedule.forEach(schedule => {
        const schedDate = new Date(schedule.date).setHours(0, 0, 0, 0);

        const card = `
            <div class="schedule-card">
                <div class="vet-sched__btn-container">
                    <button class="vet-sched__edit-btn" data-set="${schedule._id}">Edit</button>
                    <button class="vet-sched__delete-btn" data-set="${schedule._id}">Delete</button>
                </div>
                <p class="schedule-heading">${formattedDate(schedule.date)}</p>
                <p><strong>Title: </strong>${schedule.title}</p>
                <p><strong>Description: </strong>${schedule.description}</p>
            </div>
        `;

        if (schedDate === today) {
            todayVetSchedulesHTML += card;

        } else if (schedDate > today) {
            // 👉 This is UPCOMING, not past
            upcomingVetSchedulesHTML += card;

        } else {
            // 👉 This is truly past
            pastVetSchedulesHTML += card;
        }
    });

    document.querySelector('.past-events').innerHTML = pastVetSchedulesHTML || "<p>No past events.</p>";
    document.querySelector('.today-events').innerHTML = todayVetSchedulesHTML || "<p>No events today.</p>";
    document.querySelector('.upcoming-events').innerHTML = upcomingVetSchedulesHTML || "<p>No upcoming events.</p>";

    handleVetScheduleEditBtn();
}



const handleVetScheduleEditBtn = async() => {
    const editBtn = document.querySelectorAll('.vet-sched__edit-btn');
    const overlay = document.querySelector('.availability-overlay');
    const setMaxAppForm = document.querySelector('.availability-set__max-appointment');
    const newScheduleForm = document.querySelector('.availability-vet-schedule-form');
    const editScheduleForm = document.querySelector('.availability-vet-schedule-form-edit');

    const saveBtn = document.getElementById('availability-chedule__save-btn-edit');
    const backBtn = document.getElementById('availability-schedule__back-btn-edit');

    const deleteBtn = document.querySelectorAll('.vet-sched__delete-btn');


    editBtn.forEach(btn => {
        const id = btn.dataset.set;
        btn.addEventListener('click', () => {
            overlay.classList.add("show");
            editScheduleForm.classList.add("show");
            newScheduleForm.classList.remove("show");
            setMaxAppForm.classList.remove("show");

            // Set Up Form
            setUpEditScheduleForm(id);

            //Edit Form
            handleEditScheduleFromSection(id);
        })
    });

    deleteBtn.forEach(btn => {
        const id = btn.dataset.set;
        btn.addEventListener('click', () => {
            handleDeleteBtn(id);
            //alert('Schedule Id: ' + id)
        })
    });

    backBtn.addEventListener('click', () => {
        overlay.classList.remove("show");
        editScheduleForm.classList.remove("show");
        newScheduleForm.reset();
    })
}


const setUpEditScheduleForm = async (scheduleId) => {
    // Populate the data in the Form
    const vetSchedules = await fetchSchedules();
    const filteredSchedule = vetSchedules.find(sched => sched._id === scheduleId)
    const formatToDateOnly = (isoDate) => {
    const date = new Date(isoDate);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
    };

    document.getElementById('availability-schedule-title-edit').value = filteredSchedule.title;
    document.getElementById('availability-schedule-description-edit').value = filteredSchedule.description;
    document.getElementById('availability-schedule-date-edit').value = formatToDateOnly(filteredSchedule.date);
}


const handleDeleteBtn = async (scheduleId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to Delete this Schedule?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'No',
  });

  if (result.isConfirmed) {
    try {
      const response = await api.delete(`/schedule/delete/vet/personal-sched/${scheduleId}`, {});

      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'You have been successfully deleted schedule.',
          confirmButtonText: 'OK'
        });

        renderSchedulesFromCalendar();
      }

    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: err.response?.data?.message || err.message,
      });
    }
  }
};


export {
    renderSchedulesFromCalendar
}