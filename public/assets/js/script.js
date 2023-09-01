/**
 * script.js
 *
 * This file handles the initialization of various elements and functionalities
 * of a web application. It performs tasks such as loading headers, footers,
 * and pop-ups, as well as attaching event listeners to various DOM elements.
 *
 * Functions include:
 * - Loading partial HTML like headers and footers
 * - Setting up cookies for user preferences
 * - Adding interactivity like form submission and toggle button clicks
 */

document.addEventListener("DOMContentLoaded", async function () {
    await loadHeader();
    await loadPopup();
    await loadFooter();

    addToggleButtonEvent();
    addSignupFormEvent();
    addSigninFormEvent();
    addVideoPlayerEvents();
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

function setupPopup() {
    const popup = document.getElementById('popup');
    const acceptBtn = document.getElementById('accept');
    const denyBtn = document.getElementById('deny');

    if (popup && acceptBtn && denyBtn) {
        acceptBtn.addEventListener('click', () => {
            setCookie('cookieConsent', '1', 365);
            popup.style.display = 'none';
        });

        denyBtn.addEventListener('click', () => {
            setCookie('cookieConsent', '0', 365);
            popup.style.display = 'none';
        });

        const cookieConsent = getCookie('cookieConsent');
        popup.style.display = (cookieConsent === '') ? 'block' : 'none';
    }
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;httpOnly=false`;
}

function getCookie(name) {
    const cookieName = name + "=";
    const cookieArray = decodeURIComponent(document.cookie).split(';');
    for (const cookie of cookieArray) {
        let c = cookie.trim();
        if (c.indexOf(cookieName) === 0) return c.substring(cookieName.length);
    }
    return "";
}

function addToggleButtonEvent() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0];
    const navbarLinks = document.getElementsByClassName('navbar-links')[0];
    if (toggleButton && navbarLinks) {
        toggleButton.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
        });
    }
}

function addSignupFormEvent() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (event) {
            // Your existing form submission code here
        });
    }
}

function addSigninFormEvent() {
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async function (event) {
            event.preventDefault();
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

                if (response.status === 200) {
                    const responseBody = await response.json();
                    document.getElementById('responseMessage').textContent = responseBody.message;
                } else {
                    document.getElementById('responseMessage').textContent = 'An error occurred.';
                }
            } catch (error) {
                console.error(error);
                document.getElementById('responseMessage').textContent = 'An error occurred.';
            }
        });
    }
}

function addVideoPlayerEvents() {
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer) {
        videoPlayer.addEventListener('canplay', () => {
            videoPlayer.play();
        });
        // ... Other video event handlers...
    }
}

function signOut() {
    document.cookie = `token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/.netlify/functions`;
    window.location.href = '/index.html';
}
