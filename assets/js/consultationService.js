/* ============================================================
   CONSULTATION SERVICE – CRUD
============================================================ */

// Helpers
function getPatients() {
    return JSON.parse(localStorage.getItem("patients")) || [];
}
function getDoctors() {
    return JSON.parse(localStorage.getItem("doctors")) || [];
}
function getConsultations() {
    return JSON.parse(localStorage.getItem("consultations")) || [];
}
function saveConsultations(data) {
    localStorage.setItem("consultations", JSON.stringify(data));
}
function isAdmin() {
    const sessionUser = localStorage.getItem("sessionUser");
    if (!sessionUser) return false;
    const user = JSON.parse(sessionUser);
    return user.role === "admin";
}
/* -----------------------------------------------------------
   LIST PAGE (consultations/list.html)
----------------------------------------------------------- */
if (window.location.pathname.includes("consultations") &&
    window.location.pathname.includes("list.html")){

    const tbody = document.getElementById("consultationsTableBody");
    const searchInput = document.getElementById("searchInput");
    const addButton = document.querySelector('a[href="create.html"]');
    
    // Masquer le bouton Ajouter si l'utilisateur n'est pas admin
    if (addButton && !isAdmin()) {
        addButton.style.display = "none";
    }

    function displayConsultations() {
        const consultations = getConsultations();
        const patients = getPatients();
        const doctors = getDoctors();
        const searchValue = searchInput.value.toLowerCase();
        const userIsAdmin = isAdmin();

        tbody.innerHTML = "";

        consultations
            .filter(c =>
                patients.find(p => p.id === c.patientId)?.fullname?.toLowerCase().includes(searchValue)
            )
            .forEach(c => {
                const patient = patients.find(p => p.id === c.patientId);
                const doctor = doctors.find(d => d.id === c.doctorId);
                
                const actionButtons = userIsAdmin 
                    ? `<a href="details.html?id=${c.id}" class="btn btn-sm btn-info">Voir</a>
                       <a href="edit.html?id=${c.id}" class="btn btn-sm btn-warning">Modifier</a>
                       <button class="btn btn-sm btn-danger" onclick="deleteConsultation(${c.id})">Supprimer</button>`
                    : `<a href="details.html?id=${c.id}" class="btn btn-sm btn-info">Voir</a>`;

                tbody.innerHTML += `
                    <tr>
                        <td>${patient?.fullname || "N/A"}</td>
                        <td>${doctor?.fullname || "N/A"}</td>
                        <td>${c.date}</td>
                        <td>${c.diagnosis}</td>
                        <td>
                            ${actionButtons}
                        </td>
                    </tr>
                `;
            });
    }

    searchInput.addEventListener("input", displayConsultations);

    window.deleteConsultation = function (id) {
        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour supprimer une consultation.");
            return;
        }
        if (confirm("Voulez-vous supprimer cette consultation ?")) {
            const updated = getConsultations().filter(c => c.id !== id);
            saveConsultations(updated);
            displayConsultations();
        }
    };

    displayConsultations();
}

/* -----------------------------------------------------------
   CREATE PAGE (consultations/create.html)
----------------------------------------------------------- */
if (window.location.pathname.includes("consultations") &&
    window.location.pathname.includes("create.html")) {

    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin()) {
        alert("Vous n'avez pas les permissions pour créer une consultation.");
        window.location.href = "list.html";
    }

    // Remplir select patients & doctors
    const patientSelect = document.getElementById("patient");
    const doctorSelect = document.getElementById("doctor");

    getPatients().forEach(p => {
        patientSelect.innerHTML += `<option value="${p.id}">${p.fullname}</option>`;
    });

    getDoctors().forEach(d => {
        doctorSelect.innerHTML += `<option value="${d.id}">${d.fullname} (${d.speciality})</option>`;
    });

    document.getElementById("consultationForm").addEventListener("submit", e => {
        e.preventDefault();

        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour créer une consultation.");
            return;
        }

        const consultations = getConsultations();

        const newConsultation = {
            id: Date.now(),
            patientId: Number(patientSelect.value),
            doctorId: Number(doctorSelect.value),
            date: document.getElementById("date").value,
            reason: document.getElementById("reason").value,
            diagnosis: document.getElementById("diagnosis").value,
        };

        consultations.push(newConsultation);
        saveConsultations(consultations);

        alert("Consultation enregistrée !");
        window.location.href = "list.html";
    });
}

/* -----------------------------------------------------------
   EDIT PAGE (consultations/edit.html)
----------------------------------------------------------- */
if (window.location.pathname.includes("consultations") &&
    window.location.pathname.includes("edit.html")) {

    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin()) {
        alert("Vous n'avez pas les permissions pour modifier une consultation.");
        window.location.href = "list.html";
    }

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const consultations = getConsultations();
    const consultation = consultations.find(c => c.id === id);

    // Remplir selects
    const patientSelect = document.getElementById("patient");
    const doctorSelect = document.getElementById("doctor");

    getPatients().forEach(p => {
        patientSelect.innerHTML += `<option value="${p.id}">${p.fullname}</option>`;
    });
    getDoctors().forEach(d => {
        doctorSelect.innerHTML += `<option value="${d.id}">${d.fullname} (${d.speciality})</option>`;
    });

    // Remplir formulaire
    patientSelect.value = consultation.patientId;
    doctorSelect.value = consultation.doctorId;
    document.getElementById("date").value = consultation.date;
    document.getElementById("reason").value = consultation.reason;
    document.getElementById("diagnosis").value = consultation.diagnosis;

    document.getElementById("editConsultationForm").addEventListener("submit", (e) => {
        e.preventDefault();

        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour modifier une consultation.");
            return;
        }

        consultation.patientId = Number(patientSelect.value);
        consultation.doctorId = Number(doctorSelect.value);
        consultation.date = document.getElementById("date").value;
        consultation.reason = document.getElementById("reason").value;
        consultation.diagnosis = document.getElementById("diagnosis").value;

        saveConsultations(consultations);

        alert("Consultation modifiée !");
        window.location.href = "list.html";
    });
}

/* -----------------------------------------------------------
   DETAILS PAGE (consultations/details.html)
----------------------------------------------------------- */
if (window.location.pathname.includes("consultations") &&
    window.location.pathname.includes("details.html")) {

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const consultations = getConsultations();
    const consultation = consultations.find(c => c.id === id);

    const patient = getPatients().find(p => p.id === consultation.patientId);
    const doctor = getDoctors().find(d => d.id === consultation.doctorId);

    document.getElementById("consultationDetails").innerHTML = `
        <p><strong>Patient :</strong> ${patient?.fullname}</p>
        <p><strong>Médecin :</strong> ${doctor?.fullname} (${doctor?.speciality})</p>
        <p><strong>Date :</strong> ${consultation.date}</p>
        <p><strong>Motif :</strong> ${consultation.reason}</p>
        <p><strong>Diagnostic :</strong> ${consultation.diagnosis}</p>
    `;
}