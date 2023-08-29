// Initialize the DOM elements once the document has fully loaded
document.addEventListener("DOMContentLoaded", async function () {
    await loadHeader();
    await loadPopup();
    await loadFooter();

    // Add this check to make sure elements exist
    const toggleButton = document.getElementsByClassName('toggle-button')[0];
    const navbarLinks = document.getElementsByClassName('navbar-links')[0];
    if (toggleButton && navbarLinks) {
        toggleButton.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
        });
    }

    // Move this inside the DOMContentLoaded event handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (event) {
            // Your existing form submission code here
        });
    }

    // Inside the DOMContentLoaded event handler
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Show loading spinner or message
            document.getElementById('responseMessage').textContent = "Loading...";

            const formData = new FormData(event.target);
            const body = JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            });

            try {
                const response = await fetch('/.netlify/functions/sign-in', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body
                });

                // Check if request was successful
                if (response.status === 200) {
                    const responseBody = await response.json();
                    document.getElementById('responseMessage').textContent = responseBody.message;
                } else {
                    // Handle errors based on status code
                    document.getElementById('responseMessage').textContent = 'An error occurred.';
                }
            } catch (error) {
                console.error(error);
                document.getElementById('responseMessage').textContent = 'An error occurred.';
            }
        });
    }

});

async function loadHeader() {
    const response = await fetch("/partials/header.html");
    const data = await response.text();
    document.getElementById("header").innerHTML = data;
}

async function loadFooter() {
    const response = await fetch("/partials/footer.html");
    const data = await response.text();
    document.getElementById("footer").innerHTML = data;
}

async function loadPopup() {
    const response = await fetch("/partials/popup.html");
    const data = await response.text();
    document.getElementById("popup").innerHTML = data;
    setupPopup();
}

// Function to set up event listeners and behavior for the popup
function setupPopup() {
    const popup = document.getElementById('popup');
    const acceptBtn = document.getElementById('accept');
    const denyBtn = document.getElementById('deny');

    if (popup && acceptBtn && denyBtn) {
        // Event listeners for accept and deny buttons in the popup
        acceptBtn.addEventListener('click', () => {
            setCookie('cookieConsent', '1', 365);
            popup.style.display = 'none';
        });

        denyBtn.addEventListener('click', () => {
            setCookie('cookieConsent', '0', 365);
            popup.style.display = 'none';
        });

        // Display the popup based on the cookie consent status
        const cookieConsent = getCookie('cookieConsent');
        popup.style.display = (cookieConsent === '') ? 'block' : 'none';
    }
}

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Function to get a cookie
function getCookie(name) {
    const cookieName = name + "=";
    const cookieArray = decodeURIComponent(document.cookie).split(';');
    for (const cookie of cookieArray) {
        let c = cookie.trim();
        if (c.indexOf(cookieName) === 0) return c.substring(cookieName.length);
    }
    return "";
}

// Event listener for form submission
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Collect form data and send POST request to create a new user
        const formData = new FormData(event.target);
        const body = JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        });
        const response = await fetch('/.netlify/functions/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        });

        // Display the response message
        const responseBody = await response.json();
        document.getElementById('responseMessage').textContent = responseBody.message;
    });
}
if (document.getElementById('confirmationForm')) {

    document.getElementById('confirmationForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const code = formData.get('code');

        const response = await fetch('/.netlify/functions/confirm-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code })
        });

        const responseBody = await response.json();

        document.getElementById('responseMessage').textContent = responseBody.message;
    });
}

const videoPlayer = document.getElementById('videoPlayer');
if (videoPlayer) {
    // Play the video when it's ready
    videoPlayer.addEventListener('canplay', () => {
        videoPlayer.play();
    });

    // Update playback time based on video progress
    videoPlayer.addEventListener('timeupdate', () => {
        // Implement custom time update logic here if needed
    });

    // Handle errors
    videoPlayer.addEventListener('error', () => {
        alert('An error occurred while loading the video.');
    });
}
// Customize other player behaviors as needed

// Change the video source dynamically
function changeVideoSource(newSource) {
    const sourceElement = videoPlayer.querySelector('source');
    sourceElement.src = newSource;
    videoPlayer.load();
}

// Existing event listener for form submission in your script.js
const signInForm = document.getElementById('signInForm');
if (signInForm) {
    document.getElementById('signInForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(event.target);
        const body = JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password')
        });

        // Send POST request to sign in
        const response = await fetch('/.netlify/functions/sign-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        });

        // Get the response
        const responseBody = await response.json();

        // Check if sign-in was successful
        if (response.ok) {
            const token = responseBody.token;
            document.cookie = `token=${token}; SameSite=Strict;`;  // Writes the token as a cookie
        } else {
            console.error(responseBody.message);
        }
    });

}

function signOut() {
    // Clear the token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Reload the homepage
    window.location.href = '/index.html';
}