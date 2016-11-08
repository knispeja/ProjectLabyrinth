(function () {

    var apiUrl = "http://localhost:3000/login/";

    function sendlogindata(login) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: login,
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    console.log(data);
                    if (data.reply === true) {
                        window.location.href = "./homePage.html";
                        return;
                    }
                    else if(data.reply === true){
                        alert("Hello, the password entered was incorrect");
                        return false;
                    }
                    else if(data.reply === "NONE"){
                        alert("Hello, we have no user that has that email ID. Please check your email or register your email");
                        return false;
                    }
                } else {
                    console.log("login not Found");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    $(document).ready(function () {
        $("#submit").click(function () {
            var login = {
                email: $("#Email").val(),
                password: $("#Password").val()
            };
            sendlogindata(login);
        });
    });

})();