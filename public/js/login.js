(function () {
    var submit = document.getElementById('submit');
    var register = document.getElementById('register');
    register.addEventListener('click', function () { window.location = "addNewAccount.html"; return false; });

    var apiUrl = "https://localhost:3000/login/";

    function sendlogindata(login) {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: login,
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    return false;
                } else {
                    console.log("Maze not Found");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    $("#submit").click(function () {
        var login = {
            email: $("#Email").val(),
            password: $("#Password").val()
        };
        sendlogindata(login);
    });
})();