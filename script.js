const logo1 = "isotipo1.png";
const model = "modelo.glb";

// Troque estes valores pelos destinos reais quando estiverem prontos.
// Exemplo: const documentacao = "https://seu-link-da-documentacao.com";
const catalogo = "#catalogo";
const documentacao = "#documentacao";
const sobreCriador = "#criador";
const contato = "#contato";

// Links do footer para redes sociais.
const instagram = "https://link-do-instagram";
const linkedin = "https://link-do-linkedin";
const x = "https://link-do-x";

// Base para integracao futura com back-end.
const API_BASE_URL = "/api";
const ENDPOINTS = {
    produtos: `${API_BASE_URL}/produtos`,
    leads: `${API_BASE_URL}/leads`
};

const LINK_DESTINATIONS = {
    catalogo,
    documentacao,
    sobreCriador,
    contato,
    instagram,
    linkedin,
    x
};

const selectors = {
    brandLogo: "brandLogo",
    menuToggle: "menuToggle",
    siteMenu: "siteMenu",
    menuClose: "menuClose",
    menuScrim: "menuScrim",
    themeToggle: "themeToggle",
    contactFab: "contactFab",
    quickContact: "quickContact",
    contactClose: "contactClose",
    leadForm: "leadForm",
    formStatus: "formStatus"
};

const elements = {};

function getElements() {
    Object.entries(selectors).forEach(([key, id]) => {
        elements[key] = document.getElementById(id);
    });
}

function applyEditableLinks() {
    const logo = elements.brandLogo;
    if (logo) {
        logo.src = logo1;
    }

    const productModel = document.getElementById("productModel");
    if (productModel) {
        productModel.src = model;
    }

    document.querySelectorAll("[data-link-key]").forEach((link) => {
        const key = link.dataset.linkKey;
        const destination = LINK_DESTINATIONS[key];

        if (!destination) return;

        link.href = destination;

        if (destination.startsWith("http")) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }
    });
}

function setMenuOpen(isOpen) {
    elements.siteMenu.hidden = !isOpen;
    elements.menuScrim.hidden = !isOpen;
    elements.menuToggle.classList.toggle("is-open", isOpen);
    elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function setContactOpen(isOpen) {
    elements.quickContact.hidden = !isOpen;
    elements.contactFab.setAttribute("aria-expanded", String(isOpen));
}

function setupMenu() {
    elements.menuToggle.addEventListener("click", () => {
        setMenuOpen(elements.siteMenu.hidden);
    });

    elements.menuClose.addEventListener("click", () => setMenuOpen(false));
    elements.menuScrim.addEventListener("click", () => setMenuOpen(false));

    document.querySelectorAll(".menu-link").forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        setMenuOpen(false);
        setContactOpen(false);
    });
}

function setupTheme() {
    const savedTheme = localStorage.getItem("site-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    document.body.classList.toggle("dark-mode", shouldUseDark);
    elements.themeToggle.setAttribute("aria-pressed", String(shouldUseDark));

    elements.themeToggle.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark-mode");
        document.body.classList.toggle("dark-mode", isDark);
        elements.themeToggle.setAttribute("aria-pressed", String(isDark));
        localStorage.setItem("site-theme", isDark ? "dark" : "light");
    });
}

function setupContact() {
    elements.contactFab.setAttribute("aria-controls", "quickContact");
    elements.contactFab.setAttribute("aria-expanded", "false");

    elements.contactFab.addEventListener("click", () => {
        setContactOpen(elements.quickContact.hidden);
    });

    elements.contactClose.addEventListener("click", () => setContactOpen(false));

    elements.leadForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(elements.leadForm);
        const payload = Object.fromEntries(formData.entries());

        elements.formStatus.className = "form-status";
        elements.formStatus.textContent = "Mensagem preparada para envio via back-end.";

        await submitLead(payload);

        elements.formStatus.className = "form-status is-success";
        elements.formStatus.textContent = "Quando o back-end estiver ativo, este formulario enviara para ENDPOINTS.leads.";
        elements.leadForm.reset();
    });
}

async function fetchProducts() {
    const response = await fetch(ENDPOINTS.produtos);
    if (!response.ok) {
        throw new Error("Nao foi possivel carregar os produtos.");
    }

    return response.json();
}

async function submitLead(payload) {
    // Integre aqui quando o back-end estiver pronto:
    // return fetch(ENDPOINTS.leads, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload)
    // });
    return Promise.resolve({ ok: true, payload });
}

function init() {
    getElements();
    applyEditableLinks();
    setupMenu();
    setupTheme();
    setupContact();
}

window.addEventListener("DOMContentLoaded", init);
