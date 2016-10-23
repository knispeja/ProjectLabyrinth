const CELL_LENGTH = 10; // in px
const MIN_MAZE_DIMENSION = 5; // in cells
const TIME_PER_CELL_MS = 70;
const USER_COLOR = "red";
const OBSTACLE_CELL = "obstacle";
const EMPTY_CELL = "empty";
const OBJECTIVE_CELL = "objective";

var up;
var down;
var left;
var right;

var maze = [];
var userLocation = {x:0, y:0};
var objectiveCell;
var cols;
var rows;

var stepsTaken = 0;
var optimalPath = 0;

// Used for form inputs that only accept numbers
function numericOnly() {
    return event.charCode >= 48 && event.charCode <= 57;
}

function Cell(type, x, y, color) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.color = color;
    this.neighbors = [];

    this.isObjective = function() {return this.type == OBJECTIVE_CELL;}
    this.isObstacle = function() {return this.type == OBSTACLE_CELL;}
    this.isEmpty = function() {return this.type == EMPTY_CELL;}

    this.equals = function(other) {return this.x == other.x && this.y == other.y;}

    this.draw = function(ctx, drawColor = this.color) {
        ctx.fillStyle = drawColor;
        ctx.fillRect(this.x * CELL_LENGTH, this.y * CELL_LENGTH, CELL_LENGTH, CELL_LENGTH);
    }
}

function makeObstacleCell(x, y) {return new Cell(OBSTACLE_CELL, x, y, "black");}
function makeObjectiveCell(x, y) {return new Cell(OBJECTIVE_CELL, x, y, "lime");}
function makeEmptyCell(x, y) {return new Cell(EMPTY_CELL, x, y, "white");}

function getCellAtUserLocation() {
    return maze[userLocation.y][userLocation.x];
}

function updateCanvasSize(canvas) {
    canvas.width = CELL_LENGTH * cols;
    canvas.height = CELL_LENGTH * rows;
}

function generateObjectivePoint() {
    objectiveCell = makeObjectiveCell(col, row);
    newRow.push(objectiveCell);
}

function generateMazeKruskal(m) {

    var edges = [];

    // Place initial grid
    for(var row=0; row<rows; row++) {
        for(var col=0; col<cols; col++) {
            if(row % 2 == 0 || col % 2 == 0) {
                if(row % 2 == 0 && col % 2 == 0) {
                    m[row][col] = makeObstacleCell(col, row);
                }
                else {
                    m[row][col] = makeObstacleCell(col, row);
                    edges.push(m[row][col]);
                }
            }
            else {
                var c = [];
                c.push(m[row][col]);
                m[row][col].containingSet = c;
            }
        }
    }
    
    // Generate graph
    maze = m;
    generateGraphFromMaze();

    // Loop over the list of relevant edges
    while(edges.length > 0) {
        // Choose a random edge and get its neighbors
        var edgeInd = Math.floor(Math.random() * edges.length);
        var edge = edges[edgeInd];
        edges.splice(edgeInd, 1);
        
        var n0 = false;
        var n1 = false;
        var extra = false;
        for(var i=0; i<edge.neighbors.length; i++) {
            var neighbor = edge.neighbors[i];
            if(!neighbor.isObstacle()) {
                if(!n0) n0 = neighbor;
                else if(!n1) n1 = neighbor;
                else extra = true;
            }
        }

        if(n0 && n1 && !extra) {
            // Check if arrays are equal
            var setsAreEqual = true;
            var set0 = n0.containingSet;
            var set1 = n1.containingSet;
            if (set0.length == set1.length) {
                for(var i=0; i<set0.length; i++) {
                    if(!set0[i].equals(set1[i])) {
                        setsAreEqual = false;
                        break;
                    }
                }
            } else {
                setsAreEqual = false;
            }

            // Check if the spaces are joined or not
            if(!setsAreEqual) {
                var newSet = set0.concat(set1);
                var newEmptyCell = makeEmptyCell(edge.x, edge.y);
                m[edge.y][edge.x] = newEmptyCell;

                newEmptyCell.containingSet = newSet;

                // TODO: Speed things up by avoiding this step using a container object
                for(var i=0; i<newSet.length; i++) {
                    newSet[i].containingSet = newSet;
                }
            }
        }
    }

    return m;
}

function generateMaze() {
    var newMaze = [];

    // Generate empty maze
    for(var row=0; row<rows; row++) {
        var newRow = [];
        for(var col=0; col<cols; col++) {
            newRow.push(makeEmptyCell(col, row));
        }
        newMaze.push(newRow);
    }

    // Generate maze innards
    // TODO: Give user a choice on which method gets used
    newMaze = generateMazeKruskal(newMaze);

    // Place starting point
    for(var row=1; row<rows; row++) {
        if(newMaze[row][1].isEmpty()) {
            userLocation = {x: 1, y:row};
            break;
        }
    }
    
    // Place objective
    for(var row=rows-2; row>=0; row--) {
        if(newMaze[row][cols-2].isEmpty()) {
            objectiveCell = makeObjectiveCell(cols-1, row);
            newMaze[row][cols-1] = objectiveCell;
            break;
        }
    }

    return newMaze;
}

function drawMaze(ctx) {
    for(var row=0; row<rows; row++) {
        for(var col=0; col<cols; col++) {
            maze[row][col].draw(ctx);
        }
    }
}

function updateDrawnPlayerPosition(ctx) {
    getCellAtUserLocation().draw(ctx, USER_COLOR);
}

function clearDrawnPlayerPosition(ctx) {
    getCellAtUserLocation().draw(ctx);
}

function reactToUserInput() {

    if(!((up && down) || (left && right))) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        clearDrawnPlayerPosition(ctx);

        var oldCell = getCellAtUserLocation();
        var newCell;
        if(up && userLocation.y != 0) newCell = maze[userLocation.y - 1][userLocation.x];
        else if(down && userLocation.y != cols - 1) newCell = maze[userLocation.y + 1][userLocation.x];

        if(newCell && !newCell.isObstacle()) userLocation = {x: newCell.x, y: newCell.y};
        else {
            if(left) newCell = maze[userLocation.y][userLocation.x - 1];
            else if(right) newCell = maze[userLocation.y][userLocation.x + 1];

            if(newCell && !newCell.isObstacle()) userLocation = {x: newCell.x, y: newCell.y};
        }

        if(newCell && !newCell.isObstacle() && !newCell.equals(oldCell)) {
            stepsTaken++;
            oldCell.color = "orange";
            oldCell.draw(ctx);
            if(newCell.isObjective()) {
                var message = "Congratulations, you solved the maze!";
                message += "\nSteps taken:  " + stepsTaken;
                message += "\nOptimal path: " + optimalPath;
                alert(message);
            }
        }

        updateDrawnPlayerPosition(ctx);
    }

    setTimeout(reactToUserInput, TIME_PER_CELL_MS);
}

function updateMaze() {

    up, down, left, right = false;

    // Get columns and rows from the input boxes
    cols = document.getElementById("cellWidth").value;
    rows = document.getElementById("cellHeight").value;

    // Limit numbers to odd values
    if(cols % 2 == 0) cols++;
    if(rows % 2 == 0) rows++;

    // Prevent the user from trying to generate anything too small
    if(cols < MIN_MAZE_DIMENSION || rows < MIN_MAZE_DIMENSION) {
        alert("Maze cannot be smaller than " + MIN_MAZE_DIMENSION + " cells in any dimension.");
        return;
    }

    // Generate maze and update the canvas...
    var canvas = document.getElementById("canvas");
    updateCanvasSize(canvas);

    maze = generateMaze();
    graph = undefined;

    var ctx = canvas.getContext("2d");
    drawMaze(ctx);
    updateDrawnPlayerPosition(ctx);

    // Solve the maze in order to get the optimal number of steps
    optimalPath = 0;
    solveMaze(false);
}

function init() {
    updateMaze();
    reactToUserInput();
}

function onKeyDown(event) {
    var keyCode = event.keyCode;
    switch(keyCode){
        case 38:  //up arrow
        case 87:  //w
            event.preventDefault();
            up = true;
            break;
        case 37:  //left arrow
        case 65:  //a
            event.preventDefault();
            left = true;
            break;
        case 40:  //down arrow
        case 83:  //s
            event.preventDefault();
            down = true;
            break;
        case 39:  //right arrow
        case 68:  //d
            event.preventDefault();
            right = true;
            break;
    }
}

function onKeyUp(event) {
    var keyCode = event.keyCode;
    switch(keyCode){
        case 38:  //up arrow
        case 87:  //w
            up = false;
            break;
        case 37:  //left arrow
        case 65:  //a
            left = false;
            break;
        case 40:  //down arrow
        case 83:  //s
            down = false;
            break;
        case 39:  //right arrow
        case 68:  //d
            right = false;
            break;
    }
}

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

window.onload = init;