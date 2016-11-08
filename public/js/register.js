(function(){
    "use strict";

    var MIN_PASSWORD_LENGTH = 4;

    var apiUrl ="http://localhost:3000/users/";
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
                    window.location.href = "./homePage.html";
                    return false;
                }
                else{
                    console.log("User not created");
                }
            }
        });
    }

    // make ajax call to get a user from the db
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

    $(document).ready(function() {
        $("#regForm").submit(function () {

            var email = $("#email").val();
            var pass = $("#pwd").val();
            var passV = $("#pwdVerified").val();

            if (!validateEmail(email)) {
                alertUser("Please enter an email.");
                return false;
            }
            else if (pass.length < MIN_PASSWORD_LENGTH) {
                alertUser(
                    "Password is too short. Must be at least " + 
                    MIN_PASSWORD_LENGTH +
                    " characters long."
                    );
                return false;
            }
            else if (pass !== passV) {
                alertUser("Passwords do not match.");
                return false;
            }

            createUser({
                email: email,
                password: pass
            });
            
            window.location = "login.html";
        });
    });
})();