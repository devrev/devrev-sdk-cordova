// Status items for different screens
const statusData = {
    "index.html": [
        { text: "Is the DevRev SDK configured?", checked: true },
        { text: "Is the user identified?", checked: false },
        { text: "Is session monitoring enabled?", checked: true }
    ],
    "identification.html": [
        { text: "Is the user identified?", checked: false }
    ],
    "support.html": [
        { text: "Is the user identified?", checked: true }
    ],
    "sessionAnalytics.html": [
        { text: "Are on-demand sessions enabled", checked: true },
        { text: "Is the session recorded?", checked: true }
    ],
};

function renderStatusList() {
    const list = document.getElementById("statusList");
    if (!list) return;

    const screen = window.location.pathname.split("/").pop();
    const statusItems = statusData[screen] || [];

    list.innerHTML = statusItems.map((item, index) => `
        <li>
            <span>${item.text}</span>
            <span class="circular-checkbox ${item.checked ? "checked" : ""}" data-index="${index}">
                ${item.checked ? "✔️" : ""}
            </span>
        </li>
    `).join("");

    document.querySelectorAll(".circular-checkbox").forEach(checkbox => {
        checkbox.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            statusItems[index].checked = !statusItems[index].checked;
            renderStatusList();
        });
    });
}
