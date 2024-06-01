document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.getElementById('register-button');
    const loginButton = document.getElementById('login-button');

    registerButton.addEventListener('click', registerUser);
    loginButton.addEventListener('click', loginUser);

    function registerUser() {
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value.trim();
        if (username && password) {
            let users = JSON.parse(localStorage.getItem('users')) || {};
            if (users[username]) {
                alert('Username already exists.');
            } else {
                users[username] = { password, activities: [] };
                localStorage.setItem('users', JSON.stringify(users));
                alert('User registered successfully.');
            }
        } else {
            alert('Please fill in both fields.');
        }
    }

    function loginUser() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        if (username && password) {
            let users = JSON.parse(localStorage.getItem('users')) || {};
            if (users[username] && users[username].password === password) {
                localStorage.setItem('currentUser', username);
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password.');
            }
        } else {
            alert('Please fill in both fields.');
        }
    }
});
