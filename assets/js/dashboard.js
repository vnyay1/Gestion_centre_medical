/* ============================================================
   DASHBOARD – Medical Center Project (Vanilla JS Only)
============================================================ */

/* ------------------------------------------------------------
   1. Fonction utilitaire pour charger les JSON depuis /data/
------------------------------------------------------------ */
async function loadJSON(path) {
    const response = await fetch(path);
    return await response.json();
}

/* ------------------------------------------------------------
   2. Initialiser les données dans localStorage si vide
------------------------------------------------------------ */
async function initializeData() {
    const keys = ["doctors", "patients", "services", "appointments", "consultations"];
    const files = {
        doctors: "data/doctors.json",
        patients: "data/patients.json",
        services: "data/services.json",
        appointments: "data/appointments.json",
        consultations: "data/consultations.json"
    };

    for (let key of keys) {
        if (!localStorage.getItem(key)) {
            const data = await loadJSON(files[key]);
            localStorage.setItem(key, JSON.stringify(data));
        }
    }
}

/* ------------------------------------------------------------
   3. KPI : Totaux (patients, doctors, rdv du mois)
------------------------------------------------------------ */
function loadKPIs() {
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
    const patients = JSON.parse(localStorage.getItem("patients")) || [];
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // KPI Patients
    document.getElementById("kpiPatients").textContent = patients.length;

    // KPI Doctors
    document.getElementById("kpiDoctors").textContent = doctors.length;

    // KPI Appointments of current month
    const currentMonth = new Date().getMonth() + 1;

    const monthlyAppointments = appointments.filter(app => {
        const appMonth = new Date(app.date).getMonth() + 1;
        return appMonth === currentMonth;
    });

    document.getElementById("kpiAppointments").textContent = monthlyAppointments.length;
}

/* ------------------------------------------------------------
   4. GRAPHIQUE n°1 : Rendez-vous par statut
------------------------------------------------------------ */
function chartAppointmentsStatus() {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    const statusCounts = {
        pending: 0,
        done: 0,
        canceled: 0
    };

    appointments.forEach(app => {
        statusCounts[app.status]++;
    });

    const ctx = document.getElementById("chartStatus");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["En attente", "Terminé", "Annulé"],
            datasets: [{
                data: [
                    statusCounts.pending,
                    statusCounts.done,
                    statusCounts.canceled
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

/* ------------------------------------------------------------
   5. GRAPHIQUE n°2 : Spécialités des médecins
------------------------------------------------------------ */
function chartDoctorsSpeciality() {
    const doctors = JSON.parse(localStorage.getItem("doctors")) || [];

    const specialityCounts = {};

    doctors.forEach(doc => {
        specialityCounts[doc.speciality] = (specialityCounts[doc.speciality] || 0) + 1;
    });

    const labels = Object.keys(specialityCounts);
    const values = Object.values(specialityCounts);

    const ctx = document.getElementById("chartDoctors");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values
            }]
        },
        options: {
            responsive: true
        }
    });
}

/* ------------------------------------------------------------
   6. Fonction principale exécutée au chargement
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", async () => {

    // Charger les données dans localStorage si nécessaire
    await initializeData();

    // Charger KPI
    loadKPIs();

    // Générer les graphes
    chartAppointmentsStatus();
    chartDoctorsSpeciality();
});
