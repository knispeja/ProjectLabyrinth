(function(){
    "use strict";
    var apiUrl = "http://localhost:3000/mazes/";

    function saveMaze(mazeID) {
        $.ajax({
            url: apiUrl + mazeID,
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

    function getMaze(mazeID) {
        $.ajax({
            url: apiUrl + mazeID,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                if (data) {
                    setMazeView(data);
                } else {
                    console.log("Cannot find maze.");
                }
            },
            error: function(request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    function setMazeView(article) {
        document.getElementById("title").textContent = article.title;
        document.getElementById("desc").textContent = article.text;
        //still need to figure out how to insert images
        $("#mazePic").attr("src", article.image);
        $('#rating').text(averageRatings(article.ratings));
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

    function loadMaze() {
        getMaze(window.location.search.substr(1));
    }
    $(document).ready(loadMaze);
})();