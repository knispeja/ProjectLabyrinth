(function(){
    "use strict";
    var apiUrl = "https://labyrinth-backend.herokuapp.com/mazes/";

    function saveMaze(maze) {
        $.ajax({
            url: apiUrl + maze._id,
            type: 'PUT',
            data: maze,
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    $('#rating').text(averageRatings(data.ratings));
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

    function getMaze(mazeID, src) {
        $.ajax({
            url: apiUrl + mazeID,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                if (data) {
                    if(src==="load"){
                        setMazeView(data);
                    }
                    else{
                        saveMaze({
                            _id: data._id,
                            rating: parseFloat($('#ratings option:selected').text()),
                            userID: 0
                        });
                    }
                } else {
                    console.log("Cannot find maze.");
                }
            },
            error: function(request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    function setMazeView(maze) {
        document.getElementById("title").textContent = maze.title;
        document.getElementById("desc").textContent = maze.text;
        $(".mazePic").attr("src", maze.image);
        $("#rating").text(averageRatings(maze.ratings));
        $("#download").attr("href", maze.image);
        $("#download").attr("download", maze.title + ".jpg");
    }

    function averageRatings(ratings){
        if (ratings.length<=0){
            return "No Ratings yet";
        }
        var sum = 0;
        for (var i = 0; i<ratings.length; i++){
            sum+=ratings[i].rating;
        }
        return (sum / ratings.length).toFixed(1) + "/10";
    }

    function loadMaze() {
        getMaze(window.location.search.substr(1), "load");

        // Submit rating
        $('#submit').click(function () {
            getMaze(window.location.search.substr(1), "rating");
        });
    }
    $(document).ready(loadMaze);
})();