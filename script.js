document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const authForm = document.getElementById('authForm');
    const addMediaForm = document.getElementById('addMediaForm');

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = registerForm.username.value;
            const password = registerForm.password.value;

            fetch('users.json')
                .then(response => response.json())
                .then(users => {
                    if (users[username]) {
                        alert('Пользователь с таким логином уже существует');
                    } else {
                        users[username] = { password, media: [] };
                        saveData('users.json', users);
                        alert('Регистрация успешна! Перенаправление на страницу входа.');
                        window.location.href = 'auth.html';
                    }
                });
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = authForm.username.value;
            const password = authForm.password.value;

            fetch('users.json')
                .then(response => response.json())
                .then(users => {
                    if (users[username] && users[username].password === password) {
                        localStorage.setItem('loggedInUser', username);
                        alert('Вход успешен! Перенаправление в профиль.');
                        window.location.href = 'profile.html';
                    } else {
                        alert('Неверный логин или пароль');
                    }
                });
        });
    }

    if (addMediaForm) {
        addMediaForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = addMediaForm.mediaTitle.value;
            const description = addMediaForm.mediaDescription.value;
            const rating = addMediaForm.mediaRating.value;
            const image = addMediaForm.mediaImage.files[0];

            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                const category = new URLSearchParams(window.location.search).get('category') || 'Other';

                fetch('media.json')
                    .then(response => response.json())
                    .then(media => {
                        if (!media[category]) {
                            media[category] = [];
                        }

                        media[category].push({ title, description, rating, image: imageData });
                        saveData('media.json', media);

                        alert('Медиа добавлено! Перенаправление на главную страницу.');
                        window.location.href = 'index.html';
                    });
            };

            if (image) {
                reader.readAsDataURL(image);
            }
        });
    }

    if (document.getElementById('userMediaList')) {
        const username = localStorage.getItem('loggedInUser');
        if (username) {
            fetch('users.json')
                .then(response => response.json())
                .then(users => {
                    const user = users[username];
                    const mediaList = user.media.map((item, index) => `
                        <div>
                            <h3>${index + 1}. ${item.title}</h3>
                            <p>${item.description}</p>
                            <p>Рейтинг: ${item.rating}</p>
                            <img src="${item.image}" alt="${item.title}" style="width: 100px; height: auto;">
                        </div>
                    `).join('');
                    document.getElementById('userMediaList').innerHTML = mediaList;
                });
        }
    }

    if (document.getElementById('activityFeed')) {
        fetch('media.json')
            .then(response => response.json())
            .then(media => {
                let activityFeed = '';
                for (let category in media) {
                    activityFeed += `<h2>${category}</h2>`;
                    media[category].forEach((item, index) => {
                        activityFeed += `
                            <div>
                                <h3>${index + 1}. ${item.title}</h3>
                                <p>${item.description}</p>
                                <p>Рейтинг: ${item.rating}</p>
                                <img src="${item.image}" alt="${item.title}" style="width: 100px; height: auto;">
                            </div>
                        `;
                    });
                }
                document.getElementById('activityFeed').innerHTML = activityFeed;
            });
    }
});

function saveData(filename, data) {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
}
