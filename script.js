// Function to format the time remaining
function formatTimeLeft(ms) {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Function to update the countdowns
function updateCountdowns() {
    const eventItems = document.querySelectorAll(".event-item");
    
    eventItems.forEach(item => {
        const timestamp = parseInt(item.dataset.timestamp);
        const timeLeft = timestamp * 1000 - Date.now();
        const countdownElement = item.querySelector(".event-countdown");
        
        if (timeLeft > 0) {
            countdownElement.textContent = formatTimeLeft(timeLeft);
        } else {
            countdownElement.textContent = "Event is happening now!";
        }
    });
}

// Function to convert a "dd mmm yyyy" date to a Unix timestamp
function dateToTimestamp(dateString) {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000);
}

// Function to load events and render them on the page
function loadEvents(events) {
    const eventList = document.getElementById("event-list");
    const noEventsMessage = document.getElementById("no-events-message");
    
    // Convert "date" to "timestamp" for consistency
    events.forEach(event => {
        if (!event.timestamp && event.date) {
            event.timestamp = dateToTimestamp(event.date);
        }
    });
    
    // Filter and sort future events
    const futureEvents = events.filter(event => event.timestamp > Date.now() / 1000).sort((a, b) => a.timestamp - b.timestamp);
    
    // Show "No Events" message if no upcoming events are found
    if (futureEvents.length === 0) {
        noEventsMessage.style.display = "block";
        return;
    } else {
        noEventsMessage.style.display = "none";
    }
    
    // Display events
    futureEvents.forEach(event => {
        const li = document.createElement("li");
        li.classList.add("event-item");
        li.dataset.timestamp = event.timestamp;
        
        const iconHtml = event.icon ? `<img src="${event.icon}" alt="${event.name} Icon">` : "<img />";
        const nameHtml = `<span class="event-name">${event.name}</span>`;
        const countdownHtml = `<span class="event-countdown">Loading countdown...</span>`;
        
        li.innerHTML = iconHtml + nameHtml + countdownHtml;
        eventList.appendChild(li);
    });
    
    // Update countdown every second
    setInterval(updateCountdowns, 1000);
}

// Function to fetch the events from the JSON file
function fetchEvents() {
    fetch('events.json')
    .then(response => response.json())
    .then(data => {
        loadEvents(data);  // Load and display events from the JSON data
    })
    .catch(error => {
        console.error('Error loading the JSON file:', error);
        alert('Failed to load events. Please check the console for errors.');
    });
}

// Load events when the page is ready
document.addEventListener("DOMContentLoaded", fetchEvents);
