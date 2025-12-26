/* ============================================================
   PATIENT SERVICE – CRUD Patients
============================================================ */

function getPatients() {
    return JSON.parse(localStorage.getItem("patients")) || [];
}

function savePatients(data) {
    localStorage.setItem("patients", JSON.stringify(data));
}
function isAdmin() {
    const sessionUser = localStorage.getItem("sessionUser");
    if (!sessionUser) return false;
    const user = JSON.parse(sessionUser);
    return user.role === "admin";
}
/* ---------------------------
   LIST PAGE (list.html)
--------------------------- */
if (window.location.pathname.includes("list.html") &&
    window.location.pathname.includes("patients")) {

    const tbody = document.getElementById("patientsTableBody");
    const searchInput = document.getElementById("searchInput");
    const addButton = document.querySelector('a[href="create.html"]');
    
    // Masquer le bouton Ajouter si l'utilisateur n'est pas admin
    if (addButton && !isAdmin()) {
        addButton.style.display = "none";
    }

    function displayPatients() {
        const patients = getPatients();
        const searchValue = searchInput.value.toLowerCase();
        const userIsAdmin = isAdmin();

        tbody.innerHTML = "";

        patients
            .filter(p =>
                p.fullname.toLowerCase().includes(searchValue) ||
                p.gender.toLowerCase().includes(searchValue) ||
                p.phone.includes(searchValue)
            )
            .forEach(p => {
                const actionButtons = userIsAdmin 
                    ? `<a href="details.html?id=${p.id}" class="btn btn-sm btn-info">Voir</a>
                       <a href="edit.html?id=${p.id}" class="btn btn-sm btn-warning">Modifier</a>
                       <button class="btn btn-sm btn-danger" onclick="deletePatient(${p.id})">Supprimer</button>`
                    : `<a href="details.html?id=${p.id}" class="btn btn-sm btn-info">Voir</a>`;
                
                tbody.innerHTML += `
                    <tr>
                        <td>${p.fullname}</td>
                        <td>${p.age}</td>
                        <td>${p.gender}</td>
                        <td>${p.phone}</td>
                        <td>${p.email}</td>
                        <td>
                            ${actionButtons}
                        </td>
                    </tr>
                `;
            });
    }

    searchInput.addEventListener("input", displayPatients);

    window.deletePatient = function (id) {
        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour supprimer un patient.");
            return;
        }
        if (confirm("Voulez-vous supprimer ce patient ?")) {
            const updated = getPatients().filter(p => p.id !== id);
            savePatients(updated);
            displayPatients();
        }
    };

    displayPatients();
}

/* ---------------------------
   CREATE PAGE (create.html)
--------------------------- */
if (window.location.pathname.includes("create.html") &&
    window.location.pathname.includes("patients")) {

    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin()) {
        alert("Vous n'avez pas les permissions pour créer un patient.");
        window.location.href = "list.html";
    }

    document.getElementById("patientForm").addEventListener("submit", e => {
        e.preventDefault();

        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour créer un patient.");
            return;
        }

        const patients = getPatients();

        const newPatient = {
            id: Date.now(),
            fullname: document.getElementById("fullname").value,
            age: Number(document.getElementById("age").value),
            gender: document.getElementById("gender").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            address: document.getElementById("address").value,
            sicknessHistory: document.getElementById("sicknessHistory").value
        };

        patients.push(newPatient);
        savePatients(patients);

        alert("Patient ajouté !");
        window.location.href = "list.html";
    });
}

/* ---------------------------
   EDIT PAGE (edit.html)
--------------------------- */
if (window.location.pathname.includes("edit.html") &&
    window.location.pathname.includes("patients")) {

    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin()) {
        alert("Vous n'avez pas les permissions pour modifier un patient.");
        window.location.href = "list.html";
    }

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const patients = getPatients();
    const patient = patients.find(p => p.id === id);

    // Remplir formulaire
    document.getElementById("fullname").value = patient.fullname;
    document.getElementById("age").value = patient.age;
    document.getElementById("gender").value = patient.gender;
    document.getElementById("phone").value = patient.phone;
    document.getElementById("email").value = patient.email;
    document.getElementById("address").value = patient.address;
    document.getElementById("sicknessHistory").value = patient.sicknessHistory;

    document.getElementById("editPatientForm").addEventListener("submit", (e) => {
        e.preventDefault();

        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour modifier un patient.");
            return;
        }

        patient.fullname = document.getElementById("fullname").value;
        patient.age = Number(document.getElementById("age").value);
        patient.gender = document.getElementById("gender").value;
        patient.phone = document.getElementById("phone").value;
        patient.email = document.getElementById("email").value;
        patient.address = document.getElementById("address").value;
        patient.sicknessHistory = document.getElementById("sicknessHistory").value;

        savePatients(patients);

        alert("Patient modifié !");
        window.location.href = "list.html";
    });
}

/* ---------------------------
   DETAILS PAGE
--------------------------- */
if (window.location.pathname.includes("details.html") &&
    window.location.pathname.includes("patients")) {

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const patient = getPatients().find(p => p.id === id);

    document.getElementById("patientDetails").innerHTML = `
        <p><strong>Nom :</strong> ${patient.fullname}</p>
        <p><strong>Âge :</strong> ${patient.age}</p>
        <p><strong>Sexe :</strong> ${patient.gender}</p>
        <p><strong>Téléphone :</strong> ${patient.phone}</p>
        <p><strong>Email :</strong> ${patient.email}</p>
        <p><strong>Adresse :</strong> ${patient.address}</p>
        <p><strong>Antécédents médicaux :</strong> ${patient.sicknessHistory}</p>
    `;
}
