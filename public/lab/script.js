const videos = [
    {
        "title": "Jaded",
        "band": "Spiritbox",
        "venue": "Fete Music Hall",
        "date": "2023-01-15",
        "shooter": "Shooter 1",
        "poster": "Poster 1",
        "thumbnail_url": "/assets/img/thumbnail.png",
    },
    {
        "title": "Song Title 2",
        "band": "Band 2",
        "venue": "Venue 2",
        "date": "2023-02-20",
        "shooter": "Shooter 2",
        "poster": "Poster 2",
        "thumbnail_url": "/assets/img/thumbnail.png",
    },
    {
        "title": "Song Title 2",
        "band": "Band 2",
        "venue": "Venue 2",
        "date": "2023-02-20",
        "shooter": "Shooter 2",
        "poster": "Poster 2",
        "thumbnail_url": "/assets/img/thumbnail.png",
    },
    {
        "title": "Song Title 2",
        "band": "Band 2",
        "venue": "Venue 2",
        "date": "2023-02-20",
        "shooter": "Shooter 2",
        "poster": "Poster 2",
        "thumbnail_url": "/assets/img/thumbnail.png",
    },
    {
        "title": "Song Title 2",
        "band": "Band 2",
        "venue": "Venue 2",
        "date": "2023-02-20",
        "shooter": "Shooter 2",
        "poster": "Poster 2",
        "thumbnail_url": "/assets/img/thumbnail.png",
    },
    {
        "title": "Song Title 2",
        "band": "Band 2",
        "venue": "Venue 2",
        "date": "2023-02-20",
        "shooter": "Shooter 2",
        "poster": "Poster 2",
        "thumbnail_url": "/assets/img/thumbnail.png",
    },
    {
        "title": "Song Title 2",
        "band": "Band 2",
        "venue": "Venue 2",
        "date": "2023-02-20",
        "shooter": "Shooter 2",
        "poster": "Poster 2",
        "thumbnail_url": "/assets/img/thumbnail.png",
    },
    // Add more video entries as needed
];

const videoContainer = document.getElementById("video-container");

videos.forEach((video) => {
    const videoCard = document.createElement("div");
    videoCard.className = "video-card";

    const thumbnail = document.createElement("img");
    thumbnail.className = "video-thumbnail";
    thumbnail.src = video.thumbnail_url;

    const title = document.createElement("div");
    title.className = "video-title";
    title.textContent = video.title;

    const details = document.createElement("div");
    details.className = "video-details";
    details.innerHTML = `
        <p><strong>Band:</strong> ${video.band}</p>
        <p><strong>Venue:</strong> ${video.venue}</p>
        <p><strong>Date:</strong> ${video.date}</p>
        <p><strong>Shooter:</strong> ${video.shooter}</p>
        <p><strong>Poster:</strong> ${video.poster}</p>
    `;

    videoCard.appendChild(thumbnail);
    videoCard.appendChild(title);
    videoCard.appendChild(details);

    videoContainer.appendChild(videoCard);
});
