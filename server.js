const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Используем body-parser для обработки JSON-данных
app.use(bodyParser.json());

// Путь к файлу пользователей
const usersFile = './users.json';

// Чтение файла пользователей
const getUsers = () => {
    if (!fs.existsSync(usersFile)) {
        return [];
    }
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
};

// Запись данных пользователей в файл
const saveUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Маршрут для регистрации пользователя
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Введите имя пользователя и пароль.' });
    }

    let users = getUsers();

    // Проверка, существует ли пользователь
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'Пользователь уже существует.' });
    }

    // Добавление нового пользователя
    users.push({ username, password });
    saveUsers(users);

    res.status(201).json({ message: 'Регистрация успешна.' });
});

// Маршрут для входа пользователя
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Введите имя пользователя и пароль.' });
    }

    const users = getUsers();

    // Проверка правильности данных пользователя
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(400).json({ message: 'Неправильное имя пользователя или пароль.' });
    }

    res.status(200).json({ message: 'Вход выполнен успешно.' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
