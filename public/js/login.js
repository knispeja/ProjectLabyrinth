(function () {

    var apiUrl = "http://localhost:3000/login/";

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