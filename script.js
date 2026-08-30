/* ============================================================
   AKL AI SOLUTIONS
   CEO DEMONSTRATION PROTOTYPE

   Technology:
   HTML + CSS + Vanilla JavaScript

   No external APIs.
   No database.
   No paid services.

   Data is stored locally in browser localStorage.
============================================================ */


/* ============================================================
   GLOBAL STATE
============================================================ */

const STORAGE_KEY = "akl_ai_demo_state";

const defaultState = {
    requests: [],
    notifications: [],
    audit: []
};

let state = loadState();


/* ============================================================
   STORAGE
============================================================ */

function loadState() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return structuredClone(defaultState);
        }

        return {
            ...structuredClone(defaultState),
            ...JSON.parse(saved)
        };

    } catch (error) {

        console.error("Unable to load demo state:", error);

        return structuredClone(defaultState);
    }
}


function saveState() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}


/* ============================================================
   INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();
    initializeAssistant();
    initializeDocuments();
    initializeButtons();
    initializeReset();

    updateAllUI();

});


/* ============================================================
   NAVIGATION
============================================================ */

function initializeNavigation() {

    document.querySelectorAll("[data-page]").forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            showPage(page);

        });

    });

}


function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const target = document.getElementById(`page-${pageName}`);

    if (!target) return;

    target.classList.add("active");

    document.querySelectorAll(".nav-item").forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageName
        );

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    updateAllUI();
}


/* ============================================================
   AI ASSISTANT
============================================================ */

function initializeAssistant() {

    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");

    if (!form || !input) return;


    form.addEventListener("submit", event => {

        event.preventDefault();

        const message = input.value.trim();

        if (!message) return;

        handleUserMessage(message);

        input.value = "";

        input.focus();

    });


    document.querySelectorAll(".suggestion-button").forEach(button => {

        button.addEventListener("click", () => {

            const question = button.dataset.question;

            handleUserMessage(question);

        });

    });


    document.querySelectorAll("[data-question]").forEach(button => {

        button.addEventListener("click", () => {

            const question = button.dataset.question;

            showPage("assistant");

            setTimeout(() => {

                handleUserMessage(question);

            }, 150);

        });

    });

}


function handleUserMessage(message) {

    addChatMessage("user", message);

    const response = analyzeRequest(message);

    setTimeout(() => {

        renderAIResponse(response);

    }, 300);

}


/* ============================================================
   REQUEST UNDERSTANDING
============================================================ */

function analyzeRequest(message) {

    const text = message.toLowerCase();


    /* --------------------------------------------------------
       LEAVE REQUEST
    -------------------------------------------------------- */

    if (
        text.includes("leave") ||
        text.includes("vacation") ||
        text.includes("annual leave") ||
        text.includes("day off")
    ) {

        const durationMatch = text.match(/(\d+)\s*(day|days)/);

        const duration = durationMatch
            ? parseInt(durationMatch[1])
            : null;

        if (duration) {

            return {
                type: "workflow",
                workflow: "leave",
                department: "HR",
                intent: "Annual Leave Request",
                duration: duration
            };

        }

        return {
            type: "information",
            department: "HR",
            intent: "Annual Leave",
            answer:
                "Based on the sample knowledge base, annual leave requests require the appropriate approval before they are finalized. If you want to request leave, tell me the number of days and I can prepare the request."
        };

    }


    /* --------------------------------------------------------
       SICK LEAVE
    -------------------------------------------------------- */

    if (
        text.includes("sick leave") ||
        text.includes("sick")
    ) {

        return {
            type: "information",
            department: "HR",
            intent: "Sick Leave",
            answer:
                "I don't have enough approved information in the demonstration knowledge base to confirm the complete sick-leave procedure. This should be directed to HR rather than guessed."
        };

    }


    /* --------------------------------------------------------
       EXPENSE / FINANCE
    -------------------------------------------------------- */

    if (
        text.includes("expense") ||
        text.includes("reimbursement") ||
        text.includes("claim")
    ) {

        if (
            text.includes("submit") ||
            text.includes("request") ||
            text.includes("claim")
        ) {

            return {
                type: "workflow",
                workflow: "expense",
                department: "Finance",
                intent: "Expense Claim",
                amount: null
            };

        }

        return {
            type: "information",
            department: "Finance",
            intent: "Expense Claims",
            answer:
                "Expense claims in this demonstration require supporting receipts and must follow the company's approved finance process."
        };

    }


    /* --------------------------------------------------------
       PASSWORD / IT
    -------------------------------------------------------- */

    if (
        text.includes("password") ||
        text.includes("wifi") ||
        text.includes("wi-fi") ||
        text.includes("laptop") ||
        text.includes("computer") ||
        text.includes("printer") ||
        text.includes("it problem") ||
        text.includes("technical")
    ) {

        return {
            type: "routing",
            department: "IT",
            intent: "IT Support",
            answer:
                "I don't have enough approved information to resolve that specific issue. This request appears to belong to the IT Department. In a production system, I could create an IT service request and route it to the appropriate support team."
        };

    }


    /* --------------------------------------------------------
       SAFETY / OPERATIONS
    -------------------------------------------------------- */

    if (
        text.includes("safety") ||
        text.includes("ppe") ||
        text.includes("operational") ||
        text.includes("production") ||
        text.includes("incident") ||
        text.includes("finishing")
    ) {

        return {
            type: "routing",
            department: "Operations",
            intent: "Operations / Safety",
            answer:
                "This appears to be an Operations-related request. I don't have enough approved information to provide a definitive answer, so I would route it to the appropriate Operations or Safety responsible person rather than guess."
        };

    }


    /* --------------------------------------------------------
       PURCHASE
    -------------------------------------------------------- */

    if (
        text.includes("purchase") ||
        text.includes("buy") ||
        text.includes("procurement")
    ) {

        return {
            type: "workflow",
            workflow: "purchase",
            department: "Finance / Procurement",
            intent: "Purchase Request"
        };

    }


    /* --------------------------------------------------------
       CUSTOMER / SALES
    -------------------------------------------------------- */

    if (
        text.includes("customer") ||
        text.includes("sales") ||
        text.includes("lead") ||
        text.includes("client")
    ) {

        return {
            type: "routing",
            department: "Sales",
            intent: "Sales / CRM",
            answer:
                "This appears to be a Sales or CRM request. In a production system, the AI could classify the enquiry and route it to the appropriate sales staff or CRM workflow."
        };

    }


    /* --------------------------------------------------------
       DOCUMENT
    -------------------------------------------------------- */

    if (
        text.includes("pdf") ||
        text.includes("document") ||
        text.includes("excel") ||
        text.includes("powerpoint") ||
        text.includes("100 page") ||
        text.includes("100 pages")
    ) {

        return {
            type: "routing",
            department: "Document Control",
            intent: "Document Processing",
            answer:
                "This appears to be a document-processing request. The proposed workflow could extract information from an approved document, structure the data and prepare Excel, charts, PDF or PowerPoint outputs."
        };

    }


    /* --------------------------------------------------------
       REPORT
    -------------------------------------------------------- */

    if (
        text.includes("report") ||
        text.includes("analytics") ||
        text.includes("dashboard")
    ) {

        return {
            type: "routing",
            department: "Management / Reporting",
            intent: "Management Report",
            answer:
                "This appears to be a reporting request. In a production environment, the system could collect approved data sources, analyze them and prepare a management report."
        };

    }


    /* --------------------------------------------------------
       WORKING HOURS
    -------------------------------------------------------- */

    if (
        text.includes("working hours") ||
        text.includes("work hours") ||
        text.includes("office hours")
    ) {

        return {
            type: "information",
            department: "HR",
            intent: "Working Hours",
            answer:
                "The demonstration knowledge base does not contain AKL's official working-hours policy. I would not guess. Please confirm the approved policy with HR."
        };

    }


    /* --------------------------------------------------------
       SALARY
    -------------------------------------------------------- */

    if (
        text.includes("salary") ||
        text.includes("pay") ||
        text.includes("payroll")
    ) {

        return {
            type: "routing",
            department: "HR / Finance",
            intent: "Salary Information",
            answer:
                "Salary information is sensitive employee information. The production system should only provide it to an authenticated user with the required permissions. For this demonstration, I would route the request to the authorized HR or Finance process."
        };

    }


    /* --------------------------------------------------------
       DEFAULT UNKNOWN
    -------------------------------------------------------- */

    return {
        type: "unknown",
        department: "Unclassified",
        intent: "Unknown Request",
        answer:
            "I don't have enough approved information to answer that accurately. I will not guess. Please provide more information or contact the appropriate department."
    };

}


/* ============================================================
   AI RESPONSE
============================================================ */

function renderAIResponse(response) {

    if (response.type === "workflow") {

        renderWorkflowProposal(response);

        return;
    }


    if (response.type === "information") {

        addChatMessage(
            "ai",
            `
            <p>${escapeHTML(response.answer)}</p>

            <div class="chat-card">

                <div class="chat-card-title">
                    REQUEST CLASSIFICATION
                </div>

                <div class="chat-card-row">
                    <span>Department</span>
                    <strong>${escapeHTML(response.department)}</strong>
                </div>

                <div class="chat-card-row">
                    <span>Topic</span>
                    <strong>${escapeHTML(response.intent)}</strong>
                </div>

            </div>
            `
        );

        return;
    }


    if (response.type === "routing") {

        addChatMessage(
            "ai",
            `
            <p>${escapeHTML(response.answer)}</p>

            <div class="chat-card">

                <div class="chat-card-title">
                    ROUTING
                </div>

                <div class="chat-card-row">
                    <span>Department</span>
                    <strong>${escapeHTML(response.department)}</strong>
                </div>

                <div class="chat-card-row">
                    <span>Status</span>
                    <strong>Requires Human / Approved Process</strong>
                </div>

            </div>
            `
        );

        return;
    }


    addChatMessage(
        "ai",
        `
        <p>${escapeHTML(response.answer)}</p>

        <div class="chat-card">

            <div class="chat-card-title">
                NO APPROVED ANSWER FOUND
            </div>

            <div class="chat-card-row">
                <span>Action</span>
                <strong>Do not guess</strong>
            </div>

            <div class="chat-card-row">
                <span>Routing</span>
                <strong>Manual clarification</strong>
            </div>

        </div>
        `
    );

}


/* ============================================================
   WORKFLOW PROPOSAL
============================================================ */

function renderWorkflowProposal(response) {

    let description = "";

    let details = "";

    if (response.workflow === "leave") {

        description =
            `I understand that you want to request ${response.duration} day${response.duration === 1 ? "" : "s"} of annual leave.`;

        details = `

            <div class="chat-card-row">
                <span>Request</span>
                <strong>Annual Leave</strong>
            </div>

            <div class="chat-card-row">
                <span>Duration</span>
                <strong>${response.duration} day${response.duration === 1 ? "" : "s"}</strong>
            </div>

            <div class="chat-card-row">
                <span>Department</span>
                <strong>HR</strong>
            </div>

            <div class="chat-card-row">
                <span>Approval</span>
                <strong>Authorized Approver</strong>
            </div>
        `;

    }


    if (response.workflow === "expense") {

        description =
            "I can prepare an expense claim workflow for Finance.";

        details = `

            <div class="chat-card-row">
                <span>Request</span>
                <strong>Expense Claim</strong>
            </div>

            <div class="chat-card-row">
                <span>Department</span>
                <strong>Finance</strong>
            </div>

            <div class="chat-card-row">
                <span>Supporting Documents</span>
                <strong>Receipt / Evidence</strong>
            </div>

            <div class="chat-card-row">
                <span>Approval</span>
                <strong>Finance Approver</strong>
            </div>
        `;

    }


    if (response.workflow === "purchase") {

        description =
            "I can prepare a purchase request workflow.";

        details = `

            <div class="chat-card-row">
                <span>Request</span>
                <strong>Purchase Request</strong>
            </div>

            <div class="chat-card-row">
                <span>Department</span>
                <strong>Finance / Procurement</strong>
            </div>

            <div class="chat-card-row">
                <span>Approval</span>
                <strong>Authorized Approver</strong>
            </div>
        `;

    }


    addChatMessage(
        "ai",
        `
        <p>${description}</p>

        <div class="chat-card">

            <div class="chat-card-title">
                REQUEST REVIEW
            </div>

            ${details}

            <div class="chat-card-actions">

                <button
                    class="primary-button"
                    onclick='confirmWorkflow(${JSON.stringify(response)})'
                >
                    Confirm & Submit
                </button>

                <button
                    class="secondary-button"
                    onclick="cancelWorkflow()"
                >
                    Cancel
                </button>

            </div>

        </div>

        <p class="small-note">
            The AI prepares the request. Approval remains with an authorized person.
        </p>
        `
    );

}


/* ============================================================
   CREATE WORKFLOW
============================================================ */

function confirmWorkflow(response) {

    const reference = generateReference(response.workflow);

    const request = {

        id: Date.now(),

        reference,

        type: response.intent,

        workflow: response.workflow,

        department: response.department,

        duration: response.duration || null,

        employee: "CEO Demo User",

        status: "Pending Approval",

        assignedTo: getResponsiblePerson(response.workflow),

        createdAt: new Date().toISOString(),

        lastAction: "Request created by AI Assistant"

    };


    state.requests.unshift(request);


    addAudit(
        reference,
        "Request created by AI Assistant",
        "CEO Demo User",
        "Pending Approval"
    );


    addNotification({

        title: "New Workflow Request",

        message:
            `${request.type} ${request.duration ? `(${request.duration} days)` : ""} has been routed to ${request.department} for review.`,

        reference,

        unread: true

    });


    saveState();

    updateAllUI();


    addChatMessage(
        "ai",
        `
        <p>
            The request has been created successfully.
        </p>

        <div class="chat-card">

            <div class="chat-card-title">
                REQUEST SUBMITTED
            </div>

            <div class="chat-card-row">
                <span>Reference</span>
                <strong>${reference}</strong>
            </div>

            <div class="chat-card-row">
                <span>Type</span>
                <strong>${escapeHTML(request.type)}</strong>
            </div>

            <div class="chat-card-row">
                <span>Department</span>
                <strong>${escapeHTML(request.department)}</strong>
            </div>

            <div class="chat-card-row">
                <span>Assigned To</span>
                <strong>${escapeHTML(request.assignedTo)}</strong>
            </div>

            <div class="chat-card-row">
                <span>Status</span>
                <strong>Pending Approval</strong>
            </div>

            <div class="chat-card-actions">

                <button
                    class="secondary-button"
                    onclick="showPage('approvals')"
                >
                    Open Approval Center
                </button>

            </div>

        </div>

        <p class="small-note">
            Prototype notification created. In production, this workflow could connect
            to AKL's approved HR, ERP, email, Teams or other internal system.
        </p>
        `
    );

}


function cancelWorkflow() {

    addChatMessage(
        "ai",
        `
        <p>
            The request was cancelled. No workflow was created.
        </p>
        `
    );

}


function getResponsiblePerson(workflow) {

    switch (workflow) {

        case "leave":
            return "HR / Authorized Line Manager";

        case "expense":
            return "Jonnah Rathore · CFO / Finance Approver";

        case "purchase":
            return "Finance / Authorized Approver";

        default:
            return "Assigned Department Head";

    }

}


/* ============================================================
   APPROVALS
============================================================ */

function renderApprovals() {

    const container = document.getElementById("approvalList");

    if (!container) return;

    const pending = state.requests.filter(
        request => request.status === "Pending Approval"
    );


    if (!pending.length) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>No pending approvals</h3>

                <p>
                    There are currently no requests awaiting approval.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = pending.map(request => `

        <div class="approval-item">

            <div class="approval-header">

                <div>
                    <strong>${escapeHTML(request.type)}</strong>

                    <div class="request-ref">
                        ${request.reference}
                    </div>
                </div>

                <span>
                    Pending Approval
                </span>

            </div>


            <div class="approval-details">

                <div>
                    <span>Employee</span>
                    <strong>${escapeHTML(request.employee)}</strong>
                </div>

                <div>
                    <span>Department</span>
                    <strong>${escapeHTML(request.department)}</strong>
                </div>

                <div>
                    <span>Duration</span>
                    <strong>
                        ${request.duration ? `${request.duration} days` : "—"}
                    </strong>
                </div>

                <div>
                    <span>Assigned To</span>
                    <strong>${escapeHTML(request.assignedTo)}</strong>
                </div>

            </div>


            <div class="approval-actions">

                <button
                    class="primary-button"
                    onclick="approveRequest(${request.id})"
                >
                    Approve Request
                </button>

                <button
                    class="secondary-button danger-button"
                    onclick="rejectRequest(${request.id})"
                >
                    Reject
                </button>

                <button
                    class="secondary-button"
                    onclick="viewRequest(${request.id})"
                >
                    Review Details
                </button>

            </div>

        </div>

    `).join("");

}


function approveRequest(id) {

    const request = state.requests.find(
        item => item.id === id
    );

    if (!request) return;


    request.status = "Approved";

    request.lastAction = "Approved by CEO Demo User";

    request.approvedAt = new Date().toISOString();


    addAudit(
        request.reference,
        "Request approved",
        "Shamsa Muaid Al Ahbabi · CEO",
        "Approved"
    );


    addNotification({

        title: "Request Approved",

        message:
            `${request.reference} has been approved by the CEO demo account.`,

        reference: request.reference,

        unread: true

    });


    saveState();

    updateAllUI();


    showModal(`

        <div class="eyebrow">WORKFLOW COMPLETED</div>

        <h2>Request Approved</h2>

        <p>
            The demonstration request has been approved successfully.
        </p>

        <div class="chat-card">

            <div class="chat-card-row">
                <span>Reference</span>
                <strong>${request.reference}</strong>
            </div>

            <div class="chat-card-row">
                <span>Status</span>
                <strong>Approved</strong>
            </div>

            <div class="chat-card-row">
                <span>Approved By</span>
                <strong>Shamsa Muaid Al Ahbabi · CEO</strong>
            </div>

            <div class="chat-card-row">
                <span>Next Production Action</span>
                <strong>Update approved HR / ERP system</strong>
            </div>

        </div>

        <div class="modal-actions">

            <button
                class="primary-button"
                onclick="closeModal()"
            >
                Done
            </button>

        </div>

    `);

}


function rejectRequest(id) {

    const request = state.requests.find(
        item => item.id === id
    );

    if (!request) return;


    request.status = "Rejected";

    request.lastAction = "Rejected by CEO Demo User";

    request.rejectedAt = new Date().toISOString();


    addAudit(
        request.reference,
        "Request rejected",
        "Shamsa Muaid Al Ahbabi · CEO",
        "Rejected"
    );


    addNotification({

        title: "Request Rejected",

        message:
            `${request.reference} has been rejected.`,

        reference: request.reference,

        unread: true

    });


    saveState();

    updateAllUI();

}


/* ============================================================
   WORKFLOW CENTER
============================================================ */

function renderWorkflows() {

    const container = document.getElementById("workflowList");

    if (!container) return;


    if (!state.requests.length) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>No requests yet</h3>

                <p>
                    Start a request through the AI Assistant to see the workflow here.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = state.requests.map(request => `

        <div class="request-item">

            <div class="request-main">

                <strong>
                    ${escapeHTML(request.type)}
                </strong>

                <div class="request-ref">
                    ${request.reference}
                </div>

                <p>
                    ${escapeHTML(request.employee)}
                    · ${escapeHTML(request.department)}
                    · ${request.duration ? `${request.duration} days` : ""}
                </p>

                <div class="request-meta">

                    <span class="status ${getStatusClass(request.status)}">
                        ${escapeHTML(request.status)}
                    </span>

                    <span class="request-ref">
                        ${escapeHTML(request.lastAction)}
                    </span>

                </div>

            </div>


            <div class="request-actions">

                <button
                    class="secondary-button"
                    onclick="viewRequest(${request.id})"
                >
                    View
                </button>

                ${
                    request.status === "Pending Approval"
                    ? `
                        <button
                            class="primary-button"
                            onclick="approveRequest(${request.id})"
                        >
                            Approve
                        </button>
                    `
                    : ""
                }

            </div>

        </div>

    `).join("");

}


/* ============================================================
   REQUEST DETAIL
============================================================ */

function viewRequest(id) {

    const request = state.requests.find(
        item => item.id === id
    );

    if (!request) return;


    showModal(`

        <div class="eyebrow">REQUEST DETAILS</div>

        <h2>${escapeHTML(request.type)}</h2>

        <p>
            Detailed workflow record.
        </p>


        <div class="chat-card">

            <div class="chat-card-row">
                <span>Reference</span>
                <strong>${request.reference}</strong>
            </div>

            <div class="chat-card-row">
                <span>Employee</span>
                <strong>${escapeHTML(request.employee)}</strong>
            </div>

            <div class="chat-card-row">
                <span>Department</span>
                <strong>${escapeHTML(request.department)}</strong>
            </div>

            <div class="chat-card-row">
                <span>Duration</span>
                <strong>${request.duration ? `${request.duration} days` : "Not applicable"}</strong>
            </div>

            <div class="chat-card-row">
                <span>Responsible</span>
                <strong>${escapeHTML(request.assignedTo)}</strong>
            </div>

            <div class="chat-card-row">
                <span>Status</span>
                <strong>${escapeHTML(request.status)}</strong>
            </div>

            <div class="chat-card-row">
                <span>Created</span>
                <strong>${formatDate(request.createdAt)}</strong>
            </div>

        </div>


        <div class="modal-actions">

            ${
                request.status === "Pending Approval"
                ? `
                    <button
                        class="primary-button"
                        onclick="closeModal(); approveRequest(${request.id})"
                    >
                        Approve
                    </button>

                    <button
                        class="secondary-button danger-button"
                        onclick="closeModal(); rejectRequest(${request.id})"
                    >
                        Reject
                    </button>
                `
                : ""
            }

            <button
                class="secondary-button"
                onclick="closeModal()"
            >
                Close
            </button>

        </div>

    `);

}


/* ============================================================
   NOTIFICATIONS
============================================================ */

function addNotification(notification) {

    state.notifications.unshift({

        id: Date.now() + Math.random(),

        ...notification,

        createdAt: new Date().toISOString()

    });

}


function renderNotifications() {

    const container = document.getElementById("notificationList");

    if (!container) return;


    if (!state.notifications.length) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>No notifications</h3>

                <p>
                    Workflow notifications will appear here.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = state.notifications.map(notification => `

        <div class="notification-item ${notification.unread ? "unread" : ""}">

            <div>

                <strong>
                    ${escapeHTML(notification.title)}
                </strong>

                <p>
                    ${escapeHTML(notification.message)}
                </p>

                ${
                    notification.reference
                    ? `<div class="request-ref">${notification.reference}</div>`
                    : ""
                }

            </div>

            <div class="notification-time">
                ${formatDate(notification.createdAt)}
            </div>

        </div>

    `).join("");

}


/* ============================================================
   AUDIT LOG
============================================================ */

function addAudit(reference, event, user, status) {

    state.audit.unshift({

        id: Date.now() + Math.random(),

        reference,

        event,

        user,

        status,

        createdAt: new Date().toISOString()

    });

}


function renderAudit() {

    const table = document.getElementById("auditTable");

    if (!table) return;


    if (!state.audit.length) {

        table.innerHTML = `

            <tr>

                <td colspan="5">
                    No audit events yet.
                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML = state.audit.map(item => `

        <tr>

            <td>
                ${formatDate(item.createdAt)}
            </td>

            <td>
                <span class="request-ref">
                    ${escapeHTML(item.reference)}
                </span>
            </td>

            <td>
                ${escapeHTML(item.event)}
            </td>

            <td>
                ${escapeHTML(item.user)}
            </td>

            <td>

                <span class="status ${getStatusClass(item.status)}">
                    ${escapeHTML(item.status)}
                </span>

            </td>

        </tr>

    `).join("");

}


/* ============================================================
   DASHBOARD ACTIVITY
============================================================ */

function renderRecentActivity() {

    const table = document.getElementById(
        "recentActivityTable"
    );

    if (!table) return;


    const requests = state.requests.slice(0, 6);


    if (!requests.length) {

        table.innerHTML = `

            <tr>

                <td colspan="5">
                    No workflow activity yet. Use the AI Assistant to create a request.
                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML = requests.map(request => `

        <tr>

            <td>
                <span class="request-ref">
                    ${request.reference}
                </span>
            </td>

            <td>
                ${escapeHTML(request.type)}
            </td>

            <td>
                ${escapeHTML(request.department)}
            </td>

            <td>

                <span class="status ${getStatusClass(request.status)}">
                    ${escapeHTML(request.status)}
                </span>

            </td>

            <td>
                ${escapeHTML(request.lastAction)}
            </td>

        </tr>

    `).join("");

}


/* ============================================================
   DOCUMENT INTELLIGENCE
============================================================ */

function initializeDocuments() {

    const chooseButton =
        document.getElementById("chooseDocument");

    const input =
        document.getElementById("documentInput");

    const processButton =
        document.getElementById("processDocument");


    if (!chooseButton || !input) return;


    chooseButton.addEventListener(
        "click",
        () => input.click()
    );


    input.addEventListener(
        "change",
        handleDocumentSelection
    );


    if (processButton) {

        processButton.addEventListener(
            "click",
            processDocument
        );

    }

}


function handleDocumentSelection(event) {

    const file = event.target.files[0];

    if (!file) return;


    const selected =
        document.getElementById("selectedDocument");


    selected.classList.remove("hidden");


    selected.innerHTML = `

        <strong>${escapeHTML(file.name)}</strong>

        <br>

        ${formatFileSize(file.size)}

        · ${escapeHTML(file.type || "Document")}

        <br>

        <small>
            Demonstration file only.
        </small>

    `;

}


function processDocument() {

    const result =
        document.getElementById("documentResult");

    const rows =
        document.querySelectorAll(
            "#processingList > div"
        );


    if (!result || !rows.length) return;


    result.classList.add("hidden");


    rows.forEach(row => {

        row.classList.remove("complete");

        const status =
            row.querySelector("strong");

        if (status) {
            status.textContent = "Waiting";
        }

    });


    rows.forEach((row, index) => {

        setTimeout(() => {

            row.classList.add("complete");

            const status =
                row.querySelector("strong");

            if (status) {
                status.textContent = "Complete";
            }

        }, index * 600);

    });


    setTimeout(() => {

        result.classList.remove("hidden");

        addAudit(
            "DOC-DEMO",
            "Demonstration document processed",
            "CEO Demo User",
            "Completed"
        );

        saveState();

        renderAudit();

    }, rows.length * 600 + 300);

}


/* ============================================================
   REPORT / EXPORT DEMOS
============================================================ */

function initializeButtons() {

    const excel =
        document.getElementById("generateExcel");

    const charts =
        document.getElementById("generateCharts");

    const pdf =
        document.getElementById("generatePdf");

    const ppt =
        document.getElementById("generatePpt");

    const executive =
        document.getElementById("executiveReportButton");

    const chartDemo =
        document.getElementById("openChartDemo");

    const socialReport =
        document.getElementById("socialReportButton");

    const socialReport2 =
        document.getElementById("socialReportButton2");

    const socialExport =
        document.getElementById("socialExport");


    if (excel) {

        excel.addEventListener(
            "click",
            () => showExportModal("Excel")
        );

    }


    if (charts) {

        charts.addEventListener(
            "click",
            () => showExportModal("Charts")
        );

    }


    if (pdf) {

        pdf.addEventListener(
            "click",
            () => showExportModal("PDF Report")
        );

    }


    if (ppt) {

        ppt.addEventListener(
            "click",
            () => showExportModal("PowerPoint")
        );

    }


    if (executive) {

        executive.addEventListener(
            "click",
            () => showExportModal("Executive Report")
        );

    }


    if (chartDemo) {

        chartDemo.addEventListener(
            "click",
            () => {

                showPage("social");

            }
        );

    }


    if (socialReport) {

        socialReport.addEventListener(
            "click",
            () => showExportModal("Social Media Monthly Report")
        );

    }


    if (socialReport2) {

        socialReport2.addEventListener(
            "click",
            () => showExportModal("Social Media Report")
        );

    }


    if (socialExport) {

        socialExport.addEventListener(
            "click",
            () => showExportModal("Social Media Summary")
        );

    }

}


function showExportModal(type) {

    showModal(`

        <div class="eyebrow">OUTPUT GENERATION</div>

        <h2>${escapeHTML(type)}</h2>

        <p>
            The demonstration workflow has prepared the requested output.
        </p>

        <div class="chat-card">

            <div class="chat-card-row">
                <span>Output</span>
                <strong>${escapeHTML(type)}</strong>
            </div>

            <div class="chat-card-row">
                <span>Source</span>
                <strong>Approved demonstration data</strong>
            </div>

            <div class="chat-card-row">
                <span>Status</span>
                <strong>Ready</strong>
            </div>

        </div>

        <p class="small-note">
            In the production environment, this module could generate the
            actual file using approved company data and authorized systems.
        </p>

        <div class="modal-actions">

            <button
                class="primary-button"
                onclick="closeModal()"
            >
                Close
            </button>

        </div>

    `);

}


/* ============================================================
   SOCIAL
============================================================ */

function initializeSocial() {

    /* Reserved for future API integration. */

}


/* ============================================================
   RESET
============================================================ */

function initializeReset() {

    const button =
        document.getElementById("clearDemoData");

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Reset all demonstration workflow data?"
                );

            if (!confirmed) return;


            state = structuredClone(defaultState);

            saveState();

            updateAllUI();

            showPage("dashboard");

        }
    );

}


/* ============================================================
   UI UPDATE
============================================================ */

function updateAllUI() {

    updateMetrics();

    updateCounts();

    renderRecentActivity();

    renderWorkflows();

    renderApprovals();

    renderNotifications();

    renderAudit();

}


function updateMetrics() {

    const pending =
        state.requests.filter(
            request => request.status === "Pending Approval"
        ).length;


    const total =
        state.requests.length;


    const metricApprovals =
        document.getElementById("metricApprovals");

    const metricRequests =
        document.getElementById("metricRequests");


    if (metricApprovals) {
        metricApprovals.textContent = pending;
    }


    if (metricRequests) {
        metricRequests.textContent = total;
    }


    const pendingEl =
        document.getElementById("workflowPending");

    const approvedEl =
        document.getElementById("workflowApproved");

    const rejectedEl =
        document.getElementById("workflowRejected");

    const totalEl =
        document.getElementById("workflowTotal");


    if (pendingEl) {
        pendingEl.textContent = state.requests.filter(
            r => r.status === "Pending Approval"
        ).length;
    }


    if (approvedEl) {
        approvedEl.textContent = state.requests.filter(
            r => r.status === "Approved"
        ).length;
    }


    if (rejectedEl) {
        rejectedEl.textContent = state.requests.filter(
            r => r.status === "Rejected"
        ).length;
    }


    if (totalEl) {
        totalEl.textContent = state.requests.length;
    }

}


function updateCounts() {

    const pending =
        state.requests.filter(
            r => r.status === "Pending Approval"
        ).length;


    const unread =
        state.notifications.filter(
            n => n.unread
        ).length;


    const workflowCount =
        document.getElementById("workflowCount");

    const approvalCount =
        document.getElementById("approvalCount");

    const notificationCount =
        document.getElementById("notificationCount");

    const notificationDot =
        document.getElementById("topNotificationDot");


    if (workflowCount) {
        workflowCount.textContent =
            state.requests.length;
    }


    if (approvalCount) {
        approvalCount.textContent =
            pending;
    }


    if (notificationCount) {
        notificationCount.textContent =
            unread;
    }


    if (notificationDot) {

        notificationDot.classList.toggle(
            "visible",
            unread > 0
        );

    }

}


/* ============================================================
   CHAT RENDERING
============================================================ */

function addChatMessage(type, html) {

    const chatArea =
        document.getElementById("chatArea");

    if (!chatArea) return;


    const wrapper =
        document.createElement("div");


    wrapper.className =
        `chat-message ${type === "user" ? "user-message" : "ai-message"}`;


    wrapper.innerHTML = `

        <div class="message-label">
            ${type === "user" ? "YOU" : "AKL AI"}
        </div>

        <div class="message-bubble">
            ${html}
        </div>

    `;


    chatArea.appendChild(wrapper);


    chatArea.scrollTo({
        top: chatArea.scrollHeight,
        behavior: "smooth"
    });

}


/* ============================================================
   MODAL
============================================================ */

function showModal(content) {

    const overlay =
        document.getElementById("modalOverlay");

    const container =
        document.getElementById("modalContent");


    if (!overlay || !container) return;


    container.innerHTML = content;

    overlay.classList.remove("hidden");

}


function closeModal() {

    const overlay =
        document.getElementById("modalOverlay");

    if (!overlay) return;

    overlay.classList.add("hidden");

}


document.addEventListener("click", event => {

    if (event.target.id === "modalClose") {
        closeModal();
    }

});


document.getElementById("modalOverlay")?.addEventListener(
    "click",
    event => {

        if (event.target.id === "modalOverlay") {
            closeModal();
        }

    }
);


/* ============================================================
   HELPERS
============================================================ */

function generateReference(workflow) {

    const prefix = {

        leave: "LV",

        expense: "EX",

        purchase: "PR"

    }[workflow] || "AKL";


    const number =
        Math.floor(
            1000 + Math.random() * 9000
        );


    return `${prefix}-2026-${number}`;

}


function getStatusClass(status) {

    if (status === "Approved") {
        return "approved";
    }

    if (status === "Rejected") {
        return "rejected";
    }

    return "pending";

}


function formatDate(value) {

    if (!value) return "—";


    const date =
        new Date(value);


    return date.toLocaleString(
        "en-AE",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function formatFileSize(bytes) {

    if (!bytes) return "0 KB";


    const mb =
        bytes / (1024 * 1024);


    if (mb >= 1) {
        return `${mb.toFixed(2)} MB`;
    }


    return `${Math.max(
        1,
        Math.round(bytes / 1024)
    )} KB`;

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ============================================================
   END
============================================================ */
