/* ============================================================
   SERVICE MÉDICAL – CRUD
============================================================ */

function getServices() {
    return JSON.parse(localStorage.getItem("services")) || [];
}

function saveServices(data) {
    localStorage.setItem("services", JSON.stringify(data));
}

/* -----------------------------------------------------------
   LIST PAGE (services/list.html)
----------------------------------------------------------- */
if (window.location.pathname.includes("list.html") &&
    window.location.pathname.includes("services")) {

    const tbody = document.getElementById("servicesTableBody");
    const searchInput = document.getElementById("searchInput");

    function displayServices() {
        const services = getServices();
        const searchValue = searchInput.value.toLowerCase();

        tbody.innerHTML = "";

        services
        .filter(s =>
                s.name.toLowerCase().includes(searchValue) ||
                s.description.toLowerCase().includes(searchValue)
            )
            .forEach(s => {
                tbody.innerHTML += `
                    <tr>
                        <td>${s.name}</td>
                        <td>${s.description}</td>
                        <td>${s.price} Dhs</td>
                        <td>
                            <a href="details.html?id=${s.id}" class="btn btn-sm btn-info">Voir</a>
                            <a href="edit.html?id=${s.id}" class="btn btn-sm btn-warning">Modifier</a>
                            <button class="btn btn-sm btn-danger" onclick="deleteService(${s.id})">Supprimer</button>
                        </td>
                    </tr>
                `;
            });
    }

    searchInput.addEventListener("input", displayServices);

    window.deleteService = function (id) {
        if (confirm("Voulez-vous supprimer ce service ?")) {
            const updated = getServices().filter(s => s.id !== id);
            saveServices(updated);
            displayServices();
        }
    };

    displayServices();
}

/* -----------------------------------------------------------
   CREATE PAGE (services/create.html)
----------------------------------------------------------- */
if (window.location.pathname.includes("create.html") &&
    window.location.pathname.includes("services")) {

    document.getElementById("serviceForm").addEventListener("submit", e => {
        e.preventDefault();

        const services = getServices();

        const newService = {
            id: Date.now(),
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            price: Number(document.getElementById("price").value)
        };

        services.push(newService);
        saveServices(services);

        alert("Service médical ajouté !");
        window.location.href = "list.html";
    });
}

/* -----------------------------------------------------------
   EDIT PAGE (services/edit.html)
----------------------------------------------------------- */
if (window.location.pathname.includes("edit.html") &&
    window.location.pathname.includes("services")) {

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const services = getServices();
    const service = services.find(s => s.id === id);

    document.getElementById("name").value = service.name;
    document.getElementById("description").value = service.description;
    document.getElementById("price").value = service.price;

    document.getElementById("editServiceForm").addEventListener("submit", (e) => {
        e.preventDefault();

        service.name = document.getElementById("name").value;
        service.description = document.getElementById("description").value;
        service.price = Number(document.getElementById("price").value);

        saveServices(services);

        alert("Service modifié !");
        window.location.href = "list.html";
    });
}

/* -----------------------------------------------------------
   DETAILS PAGE (services/details.html)
----------------------------------------------------------- */
if (window.location.pathname.includes("details.html") &&
    window.location.pathname.includes("services")) {

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const service = getServices().find(s => s.id === id);

    document.getElementById("serviceDetails").innerHTML = `
        <p><strong>Nom du service :</strong> ${service.name}</p>
        <p><strong>Description :</strong> ${service.description}</p>
        <p><strong>Tarif :</strong> ${service.price} Dhs</p>
    `;
}
