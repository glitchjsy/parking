const posterElement = document.getElementById("poster");
const timestampElement = document.getElementById("timestamp");

const url = "https://proxy.glitch.je/?url=https%3A%2F%2Fsojpublicdata.blob.core.windows.net%2Fsojpublicdata%2Fcarpark-data.json";

// TODO: Remove this when migrating to Glitch Data API
const carParks = {
    "Charles Street": 137,
    "Green Street": 576,
    "Minden Place": 242,
    "Sand Street": 551,
    "Patriotic Street": 625,
    "Pier Road": 836
}

let carParkData = [];

async function UpdateParkingData() {
    timestampElement.innerHTML = "Updating, please wait...";

    try {
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();

            RenderTimestamp(data);
            RenderParkingData(data.carparkData.Jersey.carpark);
        }
    } catch (e) {
        alert(e.message);
    }
}

function RenderParkingData(data) {
    posterElement.innerHTML = "";
    data.forEach(RenderCarpark);
}

function RenderCarpark(data) {
    let numSpaces = parseInt(data.spaces);
    let status = parseInt(data.status);

    // Set max spaces per carpark
    totalSpaces = carParks[data.name];

    // Calculate percentages
    let percentage = (numSpaces / totalSpaces) * 100;

    // Work out the status
    status = "empty";

    if (percentage < 75) {
        status = "almost-empty";
    }
    if (percentage < 45) {
        status = "half-full";
    }
    if (percentage < 15) {
        status = "almost-full";
    }
    if (percentage == 0) {
        status = "full";
    }

    // Make HTML
    let html = `<div class="carpark ${status}">`;
    html = html + `<div class="carpark_name">${data.name}</div>`;
    html = html + `<div class="carpark_spaces">${numSpaces}<span> spaces</span></div>`;
    html = html + `</div>`;

    posterElement.insertAdjacentHTML("beforeend", html);
}

function RenderTimestamp(data) {
    timestampElement.innerHTML = data.carparkData.Timestamp;
}

(function () {
    UpdateParkingData();

    setInterval(function () {
        UpdateParkingData();
    }, 5000);
})();
