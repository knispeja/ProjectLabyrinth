(function(){
    "use strict";
    var apiUrl = "http://localhost:3000/mazes/";

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
                        data.ratings.push(parseFloat($('#ratings option:selected').text()));
                        saveMaze(data);
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
        //still need to figure out how to insert images
        $("#mazePic").attr("src", maze.image);
        $('#rating').text(averageRatings(maze.ratings));
    }

    function averageRatings(ratings){
        if (ratings.length<=0){
            return "No Ratings yet";
        }
        var sum = 0;
        for (var i = 0; i<ratings.length; i++){
            sum+=ratings[i];
        }
        return sum / ratings.length + "//10";
    }
    // Add download action to the download button
    // document.getElementById("download").addEventListener('click', function () {
    //     downloadMaze(this, 'maze.png');
    // }, false);

    function loadMaze() {
        getMaze(window.location.search.substr(1), "load");

        $('#submit').click(function () {
            getMaze(window.location.search.substr(1), "rating");
        });
    }
    $(document).ready(loadMaze);
})();