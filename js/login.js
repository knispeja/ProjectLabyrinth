(function () {

    var apiUrl = "https://labyrinth-backend.herokuapp.com/login/";

    function alertUser(text) {
        document.getElementById("alert").innerHTML = text;
    }

    function sendlogindata(login) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: login,
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    if (data.reply === true) {
                        window.location.href = "./homePage.html";
                        return;
                    }
                    else if(data.reply === false){
                        alertUser("Incorrect password");
                        return false;
                    }
                    else if(data.reply === "NONE"){
                        alertUser("Incorrect email. If you don't have an account, you can register at the link above.");
                        return false;
                    }
                } else {
                    console.log("Login not found");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    $(document).ready(function () {
        $("#regForm").submit(function () {
            var login = {
                email: $("#email").val(),
                password: $("#password").val()
            };
            sendlogindata(login);
            return false;
        });
    });

})();