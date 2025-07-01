// Refresh if no user activities in 60 seconds
let time = new Date().getTime();
$(document.body).bind("click", function(e) {
    time = new Date().getTime();
});

const refreshTime = 120000;
function refresh() {
    if (new Date().getTime() - time >= refreshTime) {
        window.location.href = "https://stanford-cogsci.org:8880/landing_page.html"
        console.log("No user activities. Reload.")
    } else {
        setTimeout(refresh, refreshTime / 2);
    }
}

// setTimeout(refresh, refreshTime / 2);

// Log data to server
function logData(data) {
    fetch('/api/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error logging action:', error));
}

// module.exports = { logData };