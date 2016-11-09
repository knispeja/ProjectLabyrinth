(function () {

    var apiUrl = "http://localhost:3000/mazes/";


    function search() {
        $.ajax({
            url: apiUrl + maze._id,
            type: 'PUT',
            data: maze,
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    window.location.href = './index.html';
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
})();