document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("register-form");

    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username && password) {
                // Отправка данных на сервер через fetch
                fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Регистрация успешна.') {
                        alert(data.message);
                        window.location.href = 'login.html';
                    } else {
                        alert(data.message); // Вывод сообщения об ошибке
                    }
                })
                .catch(error => {
                    console.error('Ошибка при регистрации:', error);
                    alert('Ошибка при регистрации. Попробуйте позже.');
                });
            } else {
                alert("Заполните все поля.");
            }
        });
    }
});
