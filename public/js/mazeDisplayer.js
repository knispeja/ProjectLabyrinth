function displayMazes(mazes){
    for(var i =0; i<mazes.length; i++){
        addMazeToPage(mazes[i]);
    }

    $(".mazePic").click(function () {
        window.location.href = "./mazeView.html";
        return;
    });
}

// use this to add a maze to userMazes page
function addMazeToPage(maze) {
    $("#mazes").append(
        "<span class=\"mazeEntry\"> <div class=\"uploadedMaze\" id=\""+
        maze._id + "\"> <img class=\"mazePic\" src=\"" +
        maze.image + "\" alt=\"Maze picture\"><br/><p id=\"upMazeTitle\">" +
        maze.title + "</p></div></span>"
    );
}