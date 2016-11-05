(function () {
    "use strict";
    var apiUrl = "https://localhost:3000/mazes/";
    var maze;
    
    // make ajax call to update this maze
    function saveMaze() {
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

    // make ajax call to add new maze to db
    function createMaze() {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: maze,
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    // redirect to index.html
                    window.location.href = './index.html';
                    return false;
                } else {
                    console.log("Maze not Created/Retrived");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    // make ajax call to delete this maze
    function deleteMaze() {
        $.ajax({
            url: apiUrl + maze._id,
            type: 'DELETE',
            success: function () {
                window.location.href = './index.html';
                return false;
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
        return;
    }
})();