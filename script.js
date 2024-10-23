
document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("register-form");
    
    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username && password) {
                // Load existing users from local storage or initialize empty array
                let users = JSON.parse(localStorage.getItem("users")) || [];

                // Check if the user already exists
                const userExists = users.some(user => user.username === username);
                if (userExists) {
                    alert("Пользователь с таким именем уже существует.");
                    return;
                }

                // Add new user
                users.push({ username: username, password: password });

                // Save updated user list to local storage
                localStorage.setItem("users", JSON.stringify(users));

                alert("Регистрация успешна!");

                // Redirect to login page
                window.location.href = "login.html";
            } else {
                alert("Заполните все поля.");
            }
        });
    }
});
