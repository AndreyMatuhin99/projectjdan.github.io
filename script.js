document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "index.html" || currentPage === "") {
        loadActivityFeed();
    } else if (currentPage === "category.html") {
        const category = localStorage.getItem("currentCategory");
        document.getElementById("category-title").textContent = category;
        loadMedia(category);
        document.getElementById("add-media-form").addEventListener("submit", function(e) {
            e.preventDefault();
            addMedia(category);
        });
    }
});

function navigateToCategory(category) {
    localStorage.setItem("currentCategory", category);
    window.location.href = "category.html";
}

function addMedia(category) {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const rating = document.getElementById("rating").value;
    const imageInput = document.getElementById("image");
    const imageFile = imageInput.files[0];

    const reader = new FileReader();
    reader.onloadend = function() {
        const media = {
            title: title,
            description: description,
            rating: rating,
            image: reader.result,
            category: category
        };

        let mediaList = JSON.parse(localStorage.getItem("mediaList")) || [];
        mediaList.push(media);
        localStorage.setItem("mediaList", JSON.stringify(mediaList));

        let activityFeed = JSON.parse(localStorage.getItem("activityFeed")) || [];
        activityFeed.unshift(`Добавлено "${title}" (Рейтинг: ${rating}) в категорию "${category}"`);
        localStorage.setItem("activityFeed", JSON.stringify(activityFeed));

        document.getElementById("add-media-form").reset();
        closeAddMediaModal();
        loadMedia(category);
        loadActivityFeed();
    };
    reader.readAsDataURL(imageFile);
}

function loadMedia(category) {
    const mediaList = JSON.parse(localStorage.getItem("mediaList")) || [];
    const filteredMedia = mediaList.filter(media => media.category === category);

    const mediaListElement = document.getElementById("media-list");
    mediaListElement.innerHTML = "";

    filteredMedia.forEach((media, index) => {
        const mediaElement = document.createElement("div");
        mediaElement.className = "media-item";
        mediaElement.innerHTML = `
            <img src="${media.image}" alt="Постер">
            <div>
                <strong>${index + 1}. ${media.title} (Рейтинг: ${media.rating})</strong>
                <p>${media.description.substring(0, 100)}...</p>
                <button onclick="deleteMedia(${index})">Удалить</button>
            </div>
        `;
        mediaListElement.appendChild(mediaElement);
    });
}

function loadActivityFeed() {
    const activityFeed = JSON.parse(localStorage.getItem("activityFeed")) || [];
    const activityFeedElement = document.getElementById("activity-feed");
    activityFeedElement.innerHTML = "";

    activityFeed.forEach(activity => {
        const activityElement = document.createElement("div");
        activityElement.textContent = activity;
        activityFeedElement.appendChild(activityElement);
    });
}

function deleteMedia(index) {
    let mediaList = JSON.parse(localStorage.getItem("mediaList")) || [];
    mediaList.splice(index, 1);
    localStorage.setItem("mediaList", JSON.stringify(mediaList));
    const category = localStorage.getItem("currentCategory");
    loadMedia(category);
    loadActivityFeed();
}

function showAddMediaForm() {
    document.getElementById("add-media-modal").style.display = "block";
}

function closeAddMediaModal() {
    document.getElementById("add-media-modal").style.display = "none";
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}
