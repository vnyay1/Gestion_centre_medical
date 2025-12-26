/* ============================================================
   RENDEZ-VOUS SERVICE – CRUD
============================================================ */

// Helpers
function getPatients() {
    return JSON.parse(localStorage.getItem("patients")) || [];
}
function getDoctors() {
    return JSON.parse(localStorage.getItem("doctors")) || [];
}
function getRendezvous() {
    return JSON.parse(localStorage.getItem("appointments")) || [];
}
function saveRendezvous(data) {
    localStorage.setItem("appointments", JSON.stringify(data));
}
function isAdmin() {
    const sessionUser = localStorage.getItem("sessionUser");
    if (!sessionUser) return false;
    const user = JSON.parse(sessionUser);
    return user.role === "admin";
}
/* -----------------------------------------------------------
   LIST PAGE
----------------------------------------------------------- */
if (window.location.pathname.includes("appointments") &&
    window.location.pathname.includes("list.html")) {

    const tbody = document.getElementById("rendezvousTableBody");
    const searchInput = document.getElementById("searchInput");
    const addButton = document.querySelector('a[href="create.html"]');
    
    // Masquer le bouton Ajouter si l'utilisateur n'est pas admin
    if (addButton && !isAdmin()) {
        addButton.style.display = "none";
    }

    function displayRendezVous() {
        const rdvs = getRendezvous();
        const patients = getPatients();
        const doctors = getDoctors();
        const searchValue = searchInput.value.toLowerCase();
        const userIsAdmin = isAdmin();

        tbody.innerHTML = "";

        rdvs
            .filter(r =>
                r.status.toLowerCase().includes(searchValue) ||
                patients.find(p => p.id === r.patientId)?.fullname.toLowerCase().includes(searchValue)
            )
            .forEach(r => {
                const patient = patients.find(p => p.id === r.patientId);
                const doctor = doctors.find(d => d.id === r.doctorId);
                
                const actionButtons = userIsAdmin 
                    ? `<a href="details.html?id=${r.id}" class="btn btn-sm btn-info">Voir</a>
                       <a href="edit.html?id=${r.id}" class="btn btn-sm btn-warning">Modifier</a>
                       <button class="btn btn-sm btn-danger" onclick="deleteRDV(${r.id})">Supprimer</button>`
                    : `<a href="details.html?id=${r.id}" class="btn btn-sm btn-info">Voir</a>`;

                tbody.innerHTML += `
                    <tr>
                        <td>${patient?.fullname}</td>
                        <td>${doctor?.fullname}</td>
                        <td>${r.date}</td>
                        <td>${r.hour}</td>
                        <td>${r.status}</td>
                        <td>
                            ${actionButtons}
                        </td>
                    </tr>
                `;
            });
    }

    searchInput.addEventListener("input", displayRendezVous);

    window.deleteRDV = function (id) {
        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour supprimer un rendez-vous.");
            return;
        }
        if (confirm("Voulez-vous vraiment supprimer ce rendez-vous ?")) {
            saveRendezvous(getRendezvous().filter(r => r.id !== id));
            displayRendezVous();
        }
    };

    displayRendezVous();
}

/* -----------------------------------------------------------
   CREATE PAGE
----------------------------------------------------------- */
if (window.location.pathname.includes("appointments") &&
    window.location.pathname.includes("create.html")) {

    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin()) {
        alert("Vous n'avez pas les permissions pour créer un rendez-vous.");
        window.location.href = "list.html";
    }

    const patientSelect = document.getElementById("patient");
    const doctorSelect = document.getElementById("doctor");

    getPatients().forEach(p => {
        patientSelect.innerHTML += `<option value="${p.id}">${p.fullname}</option>`;
    });

    getDoctors().forEach(d => {
        doctorSelect.innerHTML += `<option value="${d.id}">${d.fullname} (${d.speciality})</option>`;
    });

    document.getElementById("rendezvousForm").addEventListener("submit", e => {
        e.preventDefault();

        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour créer un rendez-vous.");
            return;
        }

        const rdvs = getRendezvous();

        const newRDV = {
            id: Date.now(),
            patientId: Number(patientSelect.value),
            doctorId: Number(doctorSelect.value),
            date: document.getElementById("date").value,
            hour: document.getElementById("time").value,
            status: document.getElementById("status").value
        };

        rdvs.push(newRDV);
        saveRendezvous(rdvs);

        alert("Rendez-vous enregistré !");
        window.location.href = "list.html";
    });
}

/* -----------------------------------------------------------
   EDIT PAGE
----------------------------------------------------------- */
if (window.location.pathname.includes("appointments") &&
    window.location.pathname.includes("edit.html")) {

    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin()) {
        alert("Vous n'avez pas les permissions pour modifier un rendez-vous.");
        window.location.href = "list.html";
    }

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const rdvs = getRendezvous();
    const rdv = rdvs.find(r => r.id === id);

    const patientSelect = document.getElementById("patient");
    const doctorSelect = document.getElementById("doctor");

    getPatients().forEach(p => {
        patientSelect.innerHTML += `<option value="${p.id}">${p.fullname}</option>`;
    });

    getDoctors().forEach(d => {
        doctorSelect.innerHTML += `<option value="${d.id}">${d.fullname} (${d.speciality})</option>`;
    });

    patientSelect.value = rdv.patientId;
    doctorSelect.value = rdv.doctorId;
    document.getElementById("date").value = rdv.date;
    document.getElementById("hour").value = rdv.hour;
    document.getElementById("status").value = rdv.status;

    document.getElementById("editRendezvousForm").addEventListener("submit", e => {
        e.preventDefault();

        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour modifier un rendez-vous.");
            return;
        }

        rdv.patientId = Number(patientSelect.value);
        rdv.doctorId = Number(doctorSelect.value);
        rdv.date = document.getElementById("date").value;
        rdv.hour = document.getElementById("hour").value;
        rdv.status = document.getElementById("status").value;

        saveRendezvous(rdvs);

        alert("Rendez-vous modifié !");
        window.location.href = "list.html";
    });
}

/* -----------------------------------------------------------
   DETAILS PAGE
----------------------------------------------------------- */
if (window.location.pathname.includes("appointments") &&
    window.location.pathname.includes("details.html")) {

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const rdv = getRendezvous().find(r => r.id === id);

    const patient = getPatients().find(p => p.id === rdv.patientId);
    const doctor = getDoctors().find(d => d.id === rdv.doctorId);

    document.getElementById("rendezvousDetails").innerHTML = `
        <p><strong>Patient :</strong> ${patient?.fullname}</p>
        <p><strong>Médecin :</strong> ${doctor?.fullname} (${doctor?.speciality})</p>
        <p><strong>Date :</strong> ${rdv.date}</p>
        <p><strong>Heure :</strong> ${rdv.hour}</p>
        <p><strong>Statut :</strong> ${rdv.status}</p>
    `;
}
