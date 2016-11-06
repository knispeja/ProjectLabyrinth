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
        alert(text); // TODO: actually put text on page
    }

    $(document).ready(function() {
        $("#submit").click(function () {

            var email = $("#email").val();
            var pass = $("#pwd").val();
            var passV = $("#pwdVerified").val();

            if (pass.length < MIN_PASSWORD_LENGTH) {
                alertUser(
                    "Password is too short. Must be at least " + 
                    MIN_PASSWORD_LENGTH +
                    " characters long."
                    );
                return;
            }
            else if (pass !== passV) {
                alertUser("Passwords do not match.");
                return;
            } else if (email.length < 3) {
                alertUser("Please enter an email.");
                return;
            }

            createUser({
                email: email,
                psswd: pass
            });
            
            window.location = "login.html";
        });
    });
})();