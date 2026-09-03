const API_BASE = "http://localhost:8080/api/leads";

let allLeads = [];
let currentLeads = [];

// =========================
// LOGIN PROTECTION
// =========================

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

// ===============================
// DOM ELEMENTS
// ===============================

const leadTable = document.getElementById("leadTable");
const emptyState = document.getElementById("emptyState");

const totalLeads = document.getElementById("totalLeads");
const highLeads = document.getElementById("highLeads");
const mediumLeads = document.getElementById("mediumLeads");
const lowLeads = document.getElementById("lowLeads");

const chartTotal = document.getElementById("chartTotal");

const highPercentage = document.getElementById("highPercentage");
const mediumPercentage = document.getElementById("mediumPercentage");
const lowPercentage = document.getElementById("lowPercentage");

const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");

const modalOverlay = document.getElementById("modalOverlay");
const detailOverlay = document.getElementById("detailOverlay");

const leadForm = document.getElementById("leadForm");


// ===============================
// INITIAL LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadLeads();

    setupModalEvents();

});


// ===============================
// GET ALL LEADS
// ===============================

async function loadLeads() {

    try {

        const response = await fetch(API_BASE);

        if (!response.ok) {
            throw new Error("Failed to fetch leads");
        }

        allLeads = await response.json();

        currentLeads = [...allLeads];

        renderLeads();

        updateDashboard();

    } catch (error) {

        console.error(error);

        showToast(
            "Connection Error",
            "Make sure Spring Boot is running.",
            "error"
        );

    }

}


// ===============================
// RENDER LEADS
// ===============================
// ===============================
// RENDER LEADS
// ===============================

function renderLeads() {

    leadTable.innerHTML = "";

    if (currentLeads.length === 0) {

        emptyState.style.display = "block";
        return;

    }

    emptyState.style.display = "none";

    currentLeads.forEach(lead => {

        const row = document.createElement("tr");

        const company =
            lead.companyName || "Unknown";

        const industry =
            lead.industry || "-";

        const country =
            lead.country || "-";

        const priority =
            lead.priority || "LOW";

        const score =
            calculateScore(lead);

        row.innerHTML = `

            <td>

                <div class="company-cell">

                    <div class="company-logo">
                        ${getInitials(company)}
                    </div>

                    <div>
                        <div class="company-name">
                            ${escapeHtml(company)}
                        </div>
                    </div>

                </div>

            </td>


            <td>
                ${escapeHtml(industry)}
            </td>


            <td>
                ${escapeHtml(country)}
            </td>


            <td>

                <div class="score-container">

                    <div class="score-bar">

                        <div
                            class="score-fill"
                            style="width:${score}%"
                        ></div>

                    </div>

                    <strong>${score}</strong>

                </div>

            </td>


            <td>

                <span class="priority-badge ${priority}">
                    ● ${priority}
                </span>

            </td>


            <td>

                ${
                    lead.internationalSales

                    ? `<span class="international">
                            ✓ Yes
                       </span>`

                    : `<span class="not-international">
                            No
                       </span>`
                }

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="view-button"
                        onclick="viewLead('${lead.id}')"
                    >
                        View
                    </button>

                    <button
                        class="edit-button"
                        onclick="editLead('${lead.id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteLead('${lead.id}')"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;

        leadTable.appendChild(row);

    });

}


// ===============================
// DASHBOARD STATISTICS
// ===============================

function updateDashboard() {

    const total = allLeads.length;

    const high = allLeads.filter(
        lead => lead.priority === "HIGH"
    ).length;

    const medium = allLeads.filter(
        lead => lead.priority === "MEDIUM"
    ).length;

    const low = allLeads.filter(
        lead => lead.priority === "LOW"
    ).length;


    totalLeads.textContent = total;

    highLeads.textContent = high;

    mediumLeads.textContent = medium;

    lowLeads.textContent = low;

    document.querySelectorAll("#chartTotal").forEach(element => {
    element.textContent = total;
});


    if (total > 0) {

        highPercentage.textContent =
            Math.round((high / total) * 100) + "%";

        mediumPercentage.textContent =
            Math.round((medium / total) * 100) + "%";

        lowPercentage.textContent =
            Math.round((low / total) * 100) + "%";

    } else {

        highPercentage.textContent = "0%";

        mediumPercentage.textContent = "0%";

        lowPercentage.textContent = "0%";

    }


    updateInsight(high, medium, low);

    updateDonut(high, medium, low, total);

}


// ===============================
// DONUT CHART
// ===============================

function updateDonut(high, medium, low, total) {

    const chart =
        document.querySelector(".donut-chart");

    if (!chart) return;


    if (total === 0) {

        chart.style.background =
            "#242c39";

        return;

    }


    const highDegrees =
        (high / total) * 360;

    const mediumDegrees =
        (medium / total) * 360;

    const mediumEnd =
        highDegrees + mediumDegrees;


    chart.style.background = `conic-gradient(
        #39d98a 0deg ${highDegrees}deg,
        #f5b942 ${highDegrees}deg ${mediumEnd}deg,
        #748094 ${mediumEnd}deg 360deg
    )`;

}


// ===============================
// AI INSIGHT
// ===============================

function updateInsight(high, medium, low) {

    const title =
        document.getElementById("insightTitle");

    const text =
        document.getElementById("insightText");


    if (allLeads.length === 0) {

        title.textContent =
            "Start building your pipeline";

        text.textContent =
            "Add your first lead and the AI assistant will analyze its potential.";

        return;

    }


    if (high > 0) {

        title.textContent =
            `${high} high-priority lead${high > 1 ? "s" : ""} ready for outreach`;

        text.textContent =
            "Focus your growth efforts on high-priority opportunities first. These leads show stronger business and international potential.";

    } else if (medium > 0) {

        title.textContent =
            "Your pipeline needs deeper research";

        text.textContent =
            "You have promising leads that require additional research before prioritizing outreach.";

    } else {

        title.textContent =
            "Expand your high-value pipeline";

        text.textContent =
            "Your current leads show limited signals. Consider adding companies with international operations and stronger business potential.";

    }

}


// ===============================
// LEAD SCORE
// ===============================

function calculateScore(lead) {
    return lead.leadScore || 0;
}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    filterLeads
);


// ===============================
// PRIORITY FILTER
// ===============================

priorityFilter.addEventListener(
    "change",
    filterLeads
);


function filterLeads() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const priority =
        priorityFilter.value;


    currentLeads =
        allLeads.filter(lead => {

            const company =
                (lead.companyName || "")
                    .toLowerCase();

            const industry =
                (lead.industry || "")
                    .toLowerCase();

            const country =
                (lead.country || "")
                    .toLowerCase();


            const matchesSearch =
                company.includes(search) ||
                industry.includes(search) ||
                country.includes(search);


            const matchesPriority =
                priority === "ALL" ||
                lead.priority === priority;


            return matchesSearch &&
                   matchesPriority;

        });


    renderLeads();

}


// ===============================
// OPEN ADD LEAD MODAL
// ===============================

function openLeadModal() {

    modalOverlay.classList.add("show");

}


// ===============================
// CLOSE ADD LEAD MODAL
// ===============================

function closeLeadModal() {

    modalOverlay.classList.remove("show");

    leadForm.reset();

}


// ===============================
// MODAL EVENTS
// ===============================

function setupModalEvents() {

    document
        .getElementById("openModal")
        .addEventListener(
            "click",
            openLeadModal
        );


    document
        .getElementById("closeModal")
        .addEventListener(
            "click",
            closeLeadModal
        );


    document
        .getElementById("cancelModal")
        .addEventListener(
            "click",
            closeLeadModal
        );


    modalOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modalOverlay
            ) {

                closeLeadModal();

            }

        }
    );

}


// ===============================
// ADD + AI RESEARCH LEAD
// ===============================

leadForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const submitButton =
            document.getElementById(
                "submitLead"
            );


        const lead = {

            companyName:
                document
                    .getElementById("companyName")
                    .value,

            industry:
                document
                    .getElementById("industry")
                    .value,

            country:
                document
                    .getElementById("country")
                    .value,

            internationalSales:
                document
                    .getElementById(
                        "internationalSales"
                    )
                    .checked,

            website:
                document
                    .getElementById("website")
                    .value,

            leadDescription:
                document
                    .getElementById(
                        "leadDescription"
                    )
                    .value

        };


        submitButton.disabled = true;

        submitButton.innerHTML =
            "✦ Researching...";


        try {

            const response =
                await fetch(
                    `${API_BASE}/research`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(lead)

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Research request failed"
                );

            }


            const researchedLead =
                await response.json();


            console.log(
                "AI Research Result:",
                researchedLead
            );


            closeLeadModal();


            showToast(
                "Lead researched",
                `${lead.companyName} was analyzed successfully.`
            );


            await loadLeads();


            // Open the newly researched lead

            if (researchedLead.id) {

                setTimeout(() => {

                    viewLead(
                        researchedLead.id
                    );

                }, 300);

            }


        } catch (error) {

            console.error(error);


            showToast(
                "Research failed",
                "Could not connect to the AI backend.",
                "error"
            );

        } finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                "<span>✦</span> Research & Add Lead";

        }

    }
);


// ===============================
// VIEW LEAD DETAILS
// ===============================

async function viewLead(id) {

    try {

        const response =
            await fetch(
                `${API_BASE}/${id}`
            );


        if (!response.ok) {
            throw new Error(
                "Lead not found"
            );
        }


        const lead =
            await response.json();


        populateLeadDetails(lead);


        detailOverlay.classList.add(
            "show"
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Error",
            "Unable to load lead details.",
            "error"
        );

    }

}


// ===============================
// POPULATE DETAIL MODAL
// ===============================

function populateLeadDetails(lead) {

    const score =
        calculateScore(lead);


    document.getElementById(
        "detailCompany"
    ).textContent =
        lead.companyName || "-";


    document.getElementById(
        "detailScore"
    ).textContent =
        score;


    const priority =
        document.getElementById(
            "detailPriority"
        );


    priority.textContent =
        lead.priority || "LOW";


    priority.className =
        `priority-badge ${
            lead.priority || "LOW"
        }`;


    document.getElementById(
        "detailIndustry"
    ).textContent =
        lead.industry || "-";


    document.getElementById(
        "detailCountry"
    ).textContent =
        lead.country || "-";


    document.getElementById(
        "detailInternational"
    ).textContent =
        lead.internationalSales
            ? "Yes"
            : "No";


    document.getElementById(
        "detailWebsite"
    ).textContent =
        lead.website || "-";


    document.getElementById(
        "detailSummary"
    ).textContent =
        lead.researchSummary ||
        "No AI research summary available.";


    document.getElementById(
        "detailReason"
    ).textContent =
        lead.aiReason ||
        "No AI reason available.";

}


// ===============================
// CLOSE DETAIL MODAL
// ===============================

function closeDetailModal() {

    detailOverlay.classList.remove(
        "show"
    );

}


// ===============================
// REFRESH
// ===============================

document
    .getElementById("refreshButton")
    .addEventListener(
        "click",
        async () => {

            const button =
                document.getElementById(
                    "refreshButton"
                );


            button.style.transform =
                "rotate(360deg)";


            await loadLeads();


            setTimeout(() => {

                button.style.transform =
                    "";

            }, 400);


            showToast(
                "Dashboard refreshed",
                "Lead data is up to date."
            );

        }
    );


// ===============================
// TOAST
// ===============================

function showToast(
    title,
    message,
    type = "success"
) {

    const toast =
        document.getElementById("toast");


    const icon =
        document.getElementById("toastIcon");


    document.getElementById(
        "toastTitle"
    ).textContent = title;


    document.getElementById(
        "toastMessage"
    ).textContent = message;


    if (type === "error") {

        icon.textContent = "×";

    } else {

        icon.textContent = "✓";

    }


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3500);

}


// ===============================
// COMPANY INITIALS
// ===============================

function getInitials(name) {

    if (!name) return "?";


    const words =
        name.trim().split(" ");


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[1][0]
    ).toUpperCase();

}


// ===============================
// SECURITY / HTML ESCAPE
// ===============================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}
// =========================
// LOGOUT
// =========================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (!confirmLogout) {
            return;
        }

        localStorage.removeItem("loggedIn");

        window.location.href = "login.html";
    });
}
/* =========================================
   EDIT LEAD
========================================= */

async function editLead(id) {

    const lead = allLeads.find(item => item.id === id);

    if (!lead) {
        showToast(
            "Error",
            "Lead not found.",
            "error"
        );
        return;
    }

    const companyName = prompt(
        "Company Name:",
        lead.companyName
    );

    if (companyName === null) {
        return;
    }

    const industry = prompt(
        "Industry:",
        lead.industry
    );

    if (industry === null) {
        return;
    }

    const country = prompt(
        "Country:",
        lead.country
    );

    if (country === null) {
        return;
    }

    const internationalSales =
        confirm(
            "Does this company have international sales?"
        );

    const updatedLead = {

        companyName: companyName,
        industry: industry,
        country: country,
        internationalSales: internationalSales,
        website: lead.website || "",
        leadDescription: lead.leadDescription || ""

    };

    try {

        const response = await fetch(
            `${API_BASE}/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedLead)
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to update lead"
            );
        }

        showToast(
            "Lead updated",
            `${companyName} was updated successfully.`
        );

        await loadLeads();

    } catch (error) {

        console.error(error);

        showToast(
            "Update failed",
            "Could not update the lead.",
            "error"
        );
    }
}


/* =========================================
   DELETE LEAD
========================================= */

async function deleteLead(id) {

    const lead = allLeads.find(
        item => item.id === id
    );

    if (!lead) {
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete ${lead.companyName}?`
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to delete lead"
            );
        }

        showToast(
            "Lead deleted",
            `${lead.companyName} was removed from the pipeline.`
        );

        await loadLeads();

    } catch (error) {

        console.error(error);

        showToast(
            "Delete failed",
            "Could not delete the lead.",
            "error"
        );
    }
}