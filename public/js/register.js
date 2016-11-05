var email = document.getElementById('email');
var psswd = document.getElementById('pwd');

function registerUser() {
    createUser({
        email: email.value,
        psswd: psswd.value
    });
}

var register = document.getElementById('submit');
register.addEventListener('click', registerUser);