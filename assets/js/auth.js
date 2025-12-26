/* ============================================================
   AUTHENTIFICATION – Medical Center Project (Vanilla JS Only)
   ============================================================ */

/* -------------------------
   Utilisateurs autorisés
-------------------------- */
const users = [
    {
        email: "admin@app.com",
        password: "admin123",
        role: "admin"
    },
    {
        email: "user@app.com",
        password: "user123",
        role: "user"
    }
];

/* ============================================================
   FONCTION HELPER : Vérifier si l'utilisateur est admin
============================================================ */
function isAdmin() {
    const sessionUser = localStorage.getItem("sessionUser");
    if (!sessionUser) return false;
    const user = JSON.parse(sessionUser);
    return user.role === "admin";
}

/* ============================================================
   FONCTION : Redirection si déjà connecté (pour login.html)
============================================================ */
if (window.location.pathname.includes("login.html")) {
    const session = localStorage.getItem("sessionUser");

    if (session) {
        // Déjà connecté → aller au dashboard
        window.location.href = "dashboard.html";
    }
}


/* ============================================================
   FONCTION : Empêche d'accéder aux pages internes sans session
============================================================ */
if (
    !window.location.pathname.includes("login.html") &&
    !window.location.pathname.includes("index.html")
) {
    const session = localStorage.getItem("sessionUser");

    if (!session) {
        // Pas connecté → retour vers login
        window.location.href = "login.html";
    }
}


/* ============================================================
   FONCTION : Connexion (sur login.html)
============================================================ */
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            const errorEmail = document.getElementById("errorEmail");
            const errorPassword = document.getElementById("errorPassword");

            let valid = true;

            // ------------------- Validations -------------------
            if (email === "") {
                errorEmail.style.display = "block";
                valid = false;
            } else {
                errorEmail.style.display = "none";
            }

            if (password === "") {
                errorPassword.style.display = "block";
                valid = false;
            } else {
                errorPassword.style.display = "none";
            }

            if (!valid) return;

            // ------------------- Vérification utilisateur -------------------
            const foundUser = users.find(
                (u) => u.email === email && u.password === password
            );

            if (!foundUser) {
                alert("Email ou mot de passe incorrect !");
                return;
            }

            // ------------------- Stockage session -------------------
            localStorage.setItem("sessionUser", JSON.stringify(foundUser));

            // ------------------- Redirection -------------------
            window.location.href = "dashboard.html";
        });
    }
});


/* ============================================================
   FONCTION : Déconnexion
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // Supprimer la session
            localStorage.removeItem("sessionUser");

            // Rediriger vers login
            window.location.href = "login.html";
        });
    }
});
