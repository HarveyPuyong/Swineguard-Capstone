import fetchSwines from "../../../admin/api/fetch-swines.js";
import { fetchAppointments } from "../../../admin/api/fetch-appointments.js";
import fetchClient from "../auth/fetch-client.js";
import { getServiceName } from "../../../admin/api/fetch-services.js";

// keywords to detect service types in returned service names
const SERVICE_KEYWORDS = {
  iron: ["iron", "iron supplement", "iron injection", "iron dextran", "iron shot"],
  deworming: ["deworm", "deworming", "anthelmintic", "fenbendazole", "albendazole"],
  castration: ["castration", "castrate", "castrated"]
};

// swine types we care about
const TARGET_TYPES = ["piglet", "grower", "gilt", "sow", "boar"];

const { _id: clientId } = await fetchClient();
const swines = await fetchSwines();
const appointments = await fetchAppointments();

// helper: find a birthdate field (try several common names)
function findBirthDate(swine) {
  return swine.birthDate ?? swine.dateOfBirth ?? swine.dob ?? swine.birthdate ?? null;
}

// helper: calculate age in days (returns null if unknown/invalid)
function getAgeDays(swine) {
  const bd = findBirthDate(swine);
  if (!bd) return null;
  const d = new Date(bd);
  if (Number.isNaN(d.getTime())) return null;
  const diffMs = Date.now() - d.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// decide required services based on type and age
function getRequiredServicesForSwine(swine) {
  const type = (swine.type || "").toLowerCase();
  const ageDays = getAgeDays(swine);

  if (type === "piglet") {
    // User said: piglet needs iron supplement especially if newborn ~ 3 to 10 days.
    // We'll recommend iron if age <= 10 days, and also if birthdate unknown (safer).
    if (ageDays === null) return ["iron"];
    if (ageDays <= 10) return ["iron"];
    return []; // older piglets — no basic reminders here
  }

  if (type === "grower") {
    return ["deworming", "castration"];
  }

  if (["gilt", "sow", "boar"].includes(type)) {
    return ["deworming"];
  }

  return [];
}

// check if a canonical service (e.g., "iron") is present in performed service names
function isServicePresent(canonicalKey, performedServiceNames) {
  const kws = SERVICE_KEYWORDS[canonicalKey] || [canonicalKey];
  // performedServiceNames are expected lowercased
  return performedServiceNames.some(name =>
    kws.some(k => name.includes(k))
  );
}

// filter client swines
const clientSwines = swines.filter(swine =>
  swine.clientId === clientId &&
  swine.status === "healthy" &&
  TARGET_TYPES.includes((swine.type || "").toLowerCase())
);

// completed appointments for client
const completedAppointments = appointments.filter(
  a => a.clientId === clientId && a.appointmentStatus === "completed"
);

const renderReminderList = async () => {
  let reminderHTML = "";

  for (const swine of clientSwines) {
    // appointments that include this swine id (safe check)
    const swineAppointments = completedAppointments.filter(appt =>
      Array.isArray(appt.swineIds) && appt.swineIds.includes(swine._id)
    );

    // collect performed service names (lowercased)
    const performedServiceNames = await Promise.all(
      swineAppointments.map(async appt => {
        try {
          const name = await getServiceName(appt.appointmentService);
          return (name || "").toLowerCase();
        } catch (err) {
          // if getServiceName fails, return empty string
          return "";
        }
      })
    );

    // determine which services this swine should have
    const required = getRequiredServicesForSwine(swine);

    // figure out which of the required services are still missing
    const missing = required.filter(req => !isServicePresent(req, performedServiceNames));

    if (missing.length > 0) {
      const ageDays = getAgeDays(swine);
      let ageText = "age unknown";

        if (ageDays !== null) {
        const months = Math.floor(ageDays / 30);
        const days = ageDays % 30;

        if (months > 0 && days > 0) {
            ageText = `${months} month${months > 1 ? "s" : ""} and ${days} day${days > 1 ? "s" : ""} old`;
        } else if (months > 0) {
            ageText = `${months} month${months > 1 ? "s" : ""} old`;
        } else {
            ageText = `${days} day${days !== 1 ? "s" : ""} old`;
        }
        }

      // map canonical keys to friendly labels
      const labelMap = { iron: "iron supplement", deworming: "deworming", castration: "castration" };
      const missingLabels = missing.map(m => labelMap[m] || m).join(", ");

      reminderHTML += `
        <div class="reminder">
          <p>
            🐷 <strong>${swine.type.charAt(0).toUpperCase()}${swine.swineFourDigitId}</strong>
            (${swine.type.charAt(0).toUpperCase()}${swine.type.slice(1)}) — ${ageText}: still missing <em>${missingLabels}</em>.
          </p>
        </div>
      `;
    }
  }

  const listEl = document.querySelector(".reminder-list");
  if (!listEl) return;
  listEl.innerHTML = reminderHTML || `<p>No reminders to show 🎉</p>`;
};

export default function () {
  renderReminderList();
}
