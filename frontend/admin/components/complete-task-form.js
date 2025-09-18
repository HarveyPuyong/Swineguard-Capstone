function createCompleteTaskForm () {
    const taskFormHTML = `
        <form class="complete-task-form">

            <h2>Complete Task Form</h2>

            <div class="task-name">
                <label for="completeTaskForm__name">Appointment:</label><br>
                <input type="text" id="completeTaskForm__name"  placeholder="Task name" readonly>
            </div>

            <div class="medicine-box">
                <label for="completeTaskForm__set-medicine-list">Select Medicine:</label><br>
                <select name="completeTaskForm__set-medicine-list" id="completeTaskForm__set-medicine-list">
                <option value="">Select Medicine</option>
                <!--/script/appointment/setup-appointments-section.js -->
                </select>
            </div>

            <div class="amount-box">
                <label for="completeTaskForm__set-medicine-amount">Medicine Amount:</label><br>
                <input type="number" id="completeTaskForm__set-medicine-amount" min="0" placeholder="0 mg" required>
            </div>
            <div class="complete-task-form__btn">
                <button type="submit" id="complete-task-form__complete-btn">Complete</button>
                <button type="button" id="complete-task-form__cancel-btn">Cancel</button>
            </div>
        </form>
    `;

    // document.querySelector(`#${form_Class_And_Id}`).innerHTML = taskFormHTML;
    // document.dispatchEvent(new Event('renderCompleteTaskForm'));

    return taskFormHTML;
}

export default createCompleteTaskForm;