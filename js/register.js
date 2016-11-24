(function(){
    "use strict";

    var MIN_PASSWORD_LENGTH = 4;

    var apiUrl = "https://labyrinth-backend.herokuapp.com/users/";
    var loginUrl = "https://labyrinth-backend.herokuapp.com/login/";
    var currentUser;

    // Make ajax call to add new user to db
    function createUser(user) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: user,
            dataType: 'JSON',
            success: function(data) {
                if(data) {
                    return false;
                }
                else{
                    console.log("User not created");
                }
            }
        });

        window.location = "login.html";
    }

    // Check if user already exists
    function continueIfUserExists(email, pass) {

        var login = {
            email: email,
            password: ""
        };

        $.ajax({
            url: loginUrl,
            type: 'POST',
            data: login,
            dataType: 'JSON',
            success: function (data) {
                if (data && data.reply === "NONE") {
                    createUser({
                        email: email,
                        password: pass
                    });
                } else {
                    alertUser("Email already taken. Forgot your password? That sucks.");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    // Make ajax call to get a user from the db
    function getUser(userID) {
        $.ajax({
            url: apiUrl + userID,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    currentUser = data;
                } else {
                    console.log("User not Found");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    function alertUser(text) {
        document.getElementById("alert").innerHTML = text;
    }

    // Taken from here: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    var defaultFormBorder;
    function resetFormBorders() {
        document.getElementById("email").style.borderColor = defaultFormBorder;
        document.getElementById("pwd").style.borderColor = defaultFormBorder;
        document.getElementById("pwdVerified").style.borderColor = defaultFormBorder;
    }

    $(document).ready(function() {

        defaultFormBorder = document.getElementById("pwd").style.borderColor;

        $("#regForm").submit(function () {

            var email = $("#email").val();
            var pass = $("#pwd").val();
            var passV = $("#pwdVerified").val();

            resetFormBorders();
            var alertText;
            if (pass !== passV) {
                alertText = "Passwords do not match.";
                document.getElementById("pwd").style.borderColor = "red";
                document.getElementById("pwdVerified").style.borderColor = "red";
            }
            else if (pass.length < MIN_PASSWORD_LENGTH) {
                alertText = 
                    "Password is too short. Must be at least " + 
                    MIN_PASSWORD_LENGTH +
                    " characters long.";
                document.getElementById("pwd").style.borderColor = "red";
                document.getElementById("pwdVerified").style.borderColor = "red";
            }
            if (!validateEmail(email)) {
                alertText = "Please enter a valid email.";
                document.getElementById("email").style.borderColor = "red";
            }

            if (alertText) {
                alertUser(alertText);
                return false;
            }

            continueIfUserExists(email, pass);
            return false;
        });
    });
})();