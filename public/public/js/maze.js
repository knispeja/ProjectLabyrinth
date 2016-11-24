(function () {
    "use strict";
    var apiUrl = "https://labyrinth-backend.herokuapp.com/mazes/";
    var imageFile;
    // make ajax call to update this maze

    function getMazes() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    displayMazes(data);
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
                    addNewMaze(data);
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
    
    $(document).ready(getMazes);
})();