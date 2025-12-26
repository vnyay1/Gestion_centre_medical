/* ============================================================
   DOCTOR SERVICE – CRUD Médecins
============================================================ */

function getDoctors() {
    return JSON.parse(localStorage.getItem("doctors")) || [];
}

function saveDoctors(data) {
    localStorage.setItem("doctors", JSON.stringify(data));
}
function isAdmin() {
    const sessionUser = localStorage.getItem("sessionUser");
    if (!sessionUser) return false;
    const user = JSON.parse(sessionUser);
    return user.role === "admin";
}
/* ------------------------
   LIST PAGE (list.html)
------------------------ */
if (window.location.pathname.includes("list.html")) {

    const tbody = document.getElementById("doctorsTableBody");
    const searchInput = document.getElementById("searchInput");
    const addButton = document.querySelector('a[href="create.html"]');
    
    // Masquer le bouton Ajouter si l'utilisateur n'est pas admin
    if (addButton && !isAdmin()) {
        addButton.style.display = "none";
    }

    function displayDoctors() {
        const doctors = getDoctors();
        const searchValue = searchInput.value.toLowerCase();
        const userIsAdmin = isAdmin();

        tbody.innerHTML = "";

        doctors
            .filter(d =>
                d.fullname.toLowerCase().includes(searchValue) ||
                d.speciality.toLowerCase().includes(searchValue)
            )
            .forEach(d => {
                const actionButtons = userIsAdmin 
                    ? `<a href="details.html?id=${d.id}" class="btn btn-sm btn-info">Voir</a>
                       <a href="edit.html?id=${d.id}" class="btn btn-sm btn-warning">Modifier</a>
                       <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${d.id})">Supprimer</button>`
                    : `<a href="details.html?id=${d.id}" class="btn btn-sm btn-info">Voir</a>`;
                
                tbody.innerHTML += `
                    <tr>
                        <td>${d.fullname}</td>
                        <td>${d.speciality}</td>
                        <td>${d.phone}</td>
                        <td>${d.email}</td>
                        <td>${d.availability ? "Oui" : "Non"}</td>
                        <td>
                            ${actionButtons}
                        </td>
                    </tr>
                `;
            });
    }

    searchInput.addEventListener("input", displayDoctors);

    window.deleteDoctor = function (id) {
        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour supprimer un médecin.");
            return;
        }
        if (confirm("Voulez-vous vraiment supprimer ce médecin ?")) {
            const doctors = getDoctors().filter(d => d.id !== id);
            saveDoctors(doctors);
            displayDoctors();
        }
    };

    displayDoctors();
}

/* ------------------------
   CREATE PAGE (create.html)
------------------------ */
if (window.location.pathname.includes("create.html")) {

    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin()) {
        alert("Vous n'avez pas les permissions pour créer un médecin.");
        window.location.href = "list.html";
    }

    document.getElementById("doctorForm").addEventListener("submit", e => {
        e.preventDefault();

        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour créer un médecin.");
            return;
        }

        const doctors = getDoctors();

        const newDoctor = {
            id: Date.now(),
            fullname: document.getElementById("fullname").value,
            speciality: document.getElementById("speciality").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            availability: document.getElementById("availability").checked
        };

        doctors.push(newDoctor);
        saveDoctors(doctors);

        alert("Médecin ajouté !");
        window.location.href = "list.html";
    });
}

/* ------------------------
   EDIT PAGE
------------------------ */
if (window.location.pathname.includes("edit.html")) {

    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin()) {
        alert("Vous n'avez pas les permissions pour modifier un médecin.");
        window.location.href = "list.html";
    }

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const doctors = getDoctors();
    const doctor = doctors.find(d => d.id === id);

    document.getElementById("fullname").value = doctor.fullname;
    document.getElementById("speciality").value = doctor.speciality;
    document.getElementById("phone").value = doctor.phone;
    document.getElementById("email").value = doctor.email;
    document.getElementById("availability").checked = doctor.availability;

    document.getElementById("editDoctorForm").addEventListener("submit", (e) => {
        e.preventDefault();

        if (!isAdmin()) {
            alert("Vous n'avez pas les permissions pour modifier un médecin.");
            return;
        }

        doctor.fullname = document.getElementById("fullname").value;
        doctor.speciality = document.getElementById("speciality").value;
        doctor.phone = document.getElementById("phone").value;
        doctor.email = document.getElementById("email").value;
        doctor.availability = document.getElementById("availability").checked;

        saveDoctors(doctors);

        alert("Médecin modifié !");
        window.location.href = "list.html";
    });
}

/* ------------------------
   DETAILS PAGE
------------------------ */
if (window.location.pathname.includes("details.html")) {

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const doctor = getDoctors().find(d => d.id === id);

    document.getElementById("doctorDetails").innerHTML = `
        <p><strong>Nom :</strong> ${doctor.fullname}</p>
        <p><strong>Spécialité :</strong> ${doctor.speciality}</p>
        <p><strong>Téléphone :</strong> ${doctor.phone}</p>
        <p><strong>Email :</strong> ${doctor.email}</p>
        <p><strong>Disponible :</strong> ${doctor.availability ? "Oui" : "Non"}</p>
    `;
}
