(function () {
    "use strict";
    var apiUrl = "http://localhost:3000/mazes/";
    var allMazes;
    // make ajax call to update this maze

    function getMaze() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    allMazes = data;
                    //TODO: create a display mazes function
                    displayMazes(allMazes);
                } else {
                    console.log("Maze not Found");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    function saveMaze(maze) {
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
    function createMaze(maze) {
        for (var a of maze) {
            console.log(a);
        }
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: maze,
            // dataType: 'JSON',
            success: function (data) {
                if (data) {
                    window.location.href = './userMazes.html';
                    return false;
                } else {
                    console.log("Maze not Created/Retrived");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            },
            processData: false,
            contentType: false
        });
    }

    // make ajax call to delete this maze
    function deleteMaze(maze) {
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

    function addMazeToPage(maze) {
        $("#mazes").append(
            "<span class=\"mazeEntry\"> <img class=\"mazePic\" src=\"" +
            maze.image + "\" alt=\"Maze picture\"><br/>"
            + "</span>"
        );
    }

    $(".mazePic").click(function () {
        window.location.href = "./mazeView.html";
        return;
    });

    $("#submit").click(function () {
        var mazeData = new FormData();
        mazeData.append("title", $("#mazeTitle").val());
        mazeData.append("image", $("#imageUploaded")[0].files[0]);
        mazeData.append("text", $("#mazeDesc").val());
        mazeData.append("dateTime", new Date());
        mazeData.append("ratings", []);
        createMaze(mazeData);
        //addMazeToPage(maze);
    });
})();