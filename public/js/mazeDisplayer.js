function displayMazes(mazes){
    for (var i =0; i<mazes.length; i++){
        addMazeToPage(mazes[i]);
    }
}

// use this to add a maze to userMazes page
function addMazeToPage(maze) {
    $("#mazeResults").append(
        "<span class=\"mazeEntry\"> <a href=\"./mazeView.html?"+maze._id+"\"<div class=\"uploadedMaze\" id=\""+
        maze._id + "\"> <img class=\"mazePic\" src=\"" +
        maze.image + "\" alt=\"Maze picture\"><br/><p id=\"upMazeTitle\">" +
        maze.title + "</p></div></a></span>"
    );
}