(function () {
    "use strict";
    var apiUrl = "http://localhost:3000/mazes/";
    var allMazes;
    var imageFile;
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
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: maze,
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    addMazeToPage(data);
                    $('form')[1].reset();
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

    // use this to add a maze to userMazes page
    function addMazeToPage(maze) {
        $("#mazes").append(
            "<span class=\"mazeEntry\"> <div id=\"uploadedMaze\"> <img class=\"mazePic\" src=\"" +
            maze.image + "\" alt=\"Maze picture\"><br/><p id=\"mazeTitle\">" +
            maze.title + "</p></div></span>"
        );
    }

    $(".mazePic").click(function () {
        window.location.href = "./mazeView.html";
        return;
    });

    $("#submit").click(function () {
        var mazeData = {
            title: $("#mazeTitle").val(),
            image: imageFile,
            text: $("#mazeDesc").val(),
            dateTime: new Date(),
            ratings: []
        };
        createMaze(mazeData);
    });
    $("#imageUploaded").change(function (){
        var file = $("#imageUploaded")[0].files[0];
        var reader = new FileReader();
        reader.addEventListener('load', function (event){
            imageFile = event.target.result;
        });
        reader.readAsDataURL(file);
    });
})();