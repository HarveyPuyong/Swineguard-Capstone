
//Date
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0"); // months start at 0
const dd = String(today.getDate()).padStart(2, "0");

const createAppointmentForm = async(appointmentId) => {
    let appointmentForm = `
        <form class="form form--animal-health">
            <!-- ================= HEADER ================= -->
            <h1 class="form__title">Animal Health Monitoring Form</h1>
            <div class="hard-copy__form__header">
                <div class="form__field">
                    <label>Date Reported:</label>
                    <input type="date" class="form__input" value="${yyyy}-${mm}-${dd}" id="date-reported" readonly>
                </div>
                <div class="form__field">
                    <label>Date of Visit:</label>
                    <input type="date" class="form__input" value="${yyyy}-${mm}-${dd}" id="date-visit" readonly>
                </div>
                </div>
            </div>

            <!-- ================= CLIENT INFORMATION ================= -->
            <div class="form__row__client-name">
                <p class="client-name__field">Name of Client:</p>

                <div class="form__field">
                    <input type="text" class="form__input"><br>
                    <label>Last Name</label>
                </div>
                <div class="form__field">
                    <input type="text" class="form__input"><br>
                    <label>First Name</label>
                </div>
                <div class="form__field">
                    <input type="text" class="form__input"><br>
                    <label>Middle Name</label>
                </div>
            </div>
            <div class="form__row__client-address">
                <p class="client-address__field">Address:</p>

                <div class="form__field">
                    <input type="text" class="form__input"><br>
                    <label>Purok/Sitio/Street</label>
                </div>
                <div class="form__field">
                    <input type="text" class="form__input"><br>
                    <label>Barangay</label>
                </div>
                <div class="form__field">
                    <input type="text" class="form__input"><br>
                    <label>Municipality</label>
                </div>
            </div>

            <div class="form__row">
                <div class="form__field form__field--checkbox">
                    <p class="client-premises__field">Premises Affected:</p>
                    <div class="check-box--outer-div">
                        <div class="form__options">
                            <label><input type="checkbox"> Smallholder Farm</label>
                            <label><input type="checkbox"> Commercial Farm</label>
                            <label><input type="checkbox"> Slaughterhouse</label>
                            <label>Others:</label><input type="text" class="check-box--input">
                        </div>
                        <div class="form__options">
                            <label><input type="checkbox"> Auction Market</label>
                            <label><input type="checkbox"> Stockyard</label>
                            <label>Name of Establishment:</label><input type="text" class="check-box--input">
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================= POPULATION ================= -->
            <fieldset class="form__section form__section--population">
                <legend class="form__legend">Population</legend>
                <div class="form__row">
                <div class="form__field"><label>Male</label><input type="number" class="form__input"></div>
                <div class="form__field"><label>Female</label><input type="number" class="form__input"></div>
                <div class="form__field"><label>Total</label><input type="number" class="form__input"></div>
                <div class="form__field"><label>No. of Sick Animal</label><input type="number" class="form__input"></div>
                <div class="form__field"><label>No. of Deaths</label><input type="number" class="form__input"></div>
                <div class="form__field"><label>Age/age group</label><input type="text" class="form__input"></div>
                </div>
            </fieldset>

            <!-- ================= CLINICAL SIGNS ================= -->
            <fieldset class="form__section form__section--clinical">
                <legend class="form__legend">Observation (Clinical Signs)</legend>
                <div class="form__options form__options--grid">
                <label><input type="checkbox"> Fever</label>
                <label><input type="checkbox"> Lack of Appetite</label>
                <label><input type="checkbox"> Loss of Weight</label>
                <label><input type="checkbox"> Enlargement of the Abdomen</label>
                <label><input type="checkbox"> Diarrhea</label>
                <label><input type="checkbox"> Blood in the Feces</label>
                <label><input type="checkbox"> Blood in the Urine</label>
                <label><input type="checkbox"> Constipation</label>
                <label><input type="checkbox"> Coughing</label>
                <label><input type="checkbox"> Nasal Discharge</label>
                <label><input type="checkbox"> Vomiting</label>
                <label><input type="checkbox"> Paddling</label>
                <label><input type="checkbox"> Vesicle Formation</label>
                <label><input type="checkbox"> No Milk</label>
                <label><input type="checkbox"> Trembling</label>
                <label><input type="checkbox"> Incoordination</label>
                <label><input type="checkbox"> Skin Lesion</label>
                <label><input type="checkbox"> Lameness</label>
                <label><input type="checkbox"> Difficulty in Breathing</label>
                <label><input type="checkbox"> Swelling of Genital Organs</label>
                <label><input type="checkbox"> Skin Discoloration</label>
                </div>
            </fieldset>

            <!-- ================= DISEASE DIAGNOSIS ================= -->
            <fieldset class="form__section form__section--diagnosis">
                <legend class="form__legend">Disease Diagnosis</legend>
                <div class="form__row">
                <label><input type="radio" name="diagnosis"> Suspected</label>
                <label><input type="radio" name="diagnosis"> Probable</label>
                <label><input type="radio" name="diagnosis"> Confirmed</label>
                </div>

                <div class="form__field">
                <label>Species Affected</label>
                <input type="text" class="form__input">
                </div>

                <div class="form__field form__field--checkbox">
                <label>Disease (Swine)</label>
                <div class="form__options">
                    <label><input type="checkbox"> Classical Swine Fever</label>
                    <label><input type="checkbox"> Porcine Epidemic Diarrhea (PED)</label>
                    <label><input type="checkbox"> Porcine Reproductive and Respiratory Disease (PRRS)</label>
                </div>
                </div>
            </fieldset>

            <!-- ================= INTERVENTION ================= -->
            <fieldset class="form__section form__section--intervention">
                <legend class="form__legend">Intervention</legend>
                <div class="form__options">
                <label><input type="checkbox"> Disinfection of infected premises</label>
                <label><input type="checkbox"> Movement Control / Quarantine</label>
                <label><input type="checkbox"> Vaccination</label>
                <label><input type="checkbox"> Control of Vectors</label>
                <label><input type="checkbox"> No intervention</label>
                </div>

                <div class="form__field">
                <label>Treatment</label>
                <input type="number" class="form__input" placeholder="No. of heads">
                </div>

                <table class="form__table">
                <thead>
                    <tr>
                    <th>Drug Used</th>
                    <th>Type</th>
                    <th>Dosage / head</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td><input type="text" class="form__input"></td>
                    <td><input type="text" class="form__input"></td>
                    <td><input type="text" class="form__input"></td>
                    </tr>
                </tbody>
                </table>
            </fieldset>

            <!-- ================= FOOTER ================= -->
            <div class="form__footer">
                <div class="form__field">
                <label>Submitted by:</label>
                <input type="text" class="form__input">
                </div>
                <div class="form__field">
                <label>Validated by (Veterinarian):</label>
                <input type="text" class="form__input">
                </div>
            </div>

            <div class="print-hard-copy">
                <button type="button" id="print-appointment__hard-copy-print">Print</button>
                <button type="reset" id="print-appointment__hard-copy-cancel">Cancel</button>
            </div>

        </form>
    `;
    document.querySelector('.appointment-form__hard-copy').innerHTML = appointmentForm;
    document.dispatchEvent(new Event('renderAppointmentFormHardCopy'));
}


export default createAppointmentForm;