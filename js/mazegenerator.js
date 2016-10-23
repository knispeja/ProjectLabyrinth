const CELL_LENGTH = 10; // in px
const TIME_PER_CELL_MS = 50;
const USER_COLOR = "red";
const OBSTACLE_CELL = "obstacle";
const EMPTY_CELL = "empty";
const OBJECTIVE_CELL = "objective";

var up;
var down;
var left;
var right;

var maze = [];
var userLocation = {x:10, y:10};
var objectiveCell;
var cols;
var rows;

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

                    var found = false;
                    for(var j=0; j<set1.length; j++) {
                        if(set0[i].equals(set1[j])) {
                            found = true;
                            break;
                        }
                    }

                    if(!found) {
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
    for(var row=0; row<rows; row++) {
        if(maze[row][1].isEmpty()) {
            userLocation = {x: 1, y:row};
            break;
        }
    }
    
    // Place objective
    for(var row=rows-1; row>=0; row--) {
        if(maze[row][cols-2].isEmpty()) {
            objectiveCell = makeObjectiveCell();
            maze[row][cols-2] = objectiveCell;
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

        var newCell;
        if(up && userLocation.y != 0) newCell = maze[userLocation.y - 1][userLocation.x];
        else if(down && userLocation.y != cols - 1) newCell = maze[userLocation.y + 1][userLocation.x];

        if(newCell && !newCell.isObstacle()) userLocation = {x: newCell.x, y: newCell.y};
        else {
            if(left) newCell = maze[userLocation.y][userLocation.x - 1];
            else if(right) newCell = maze[userLocation.y][userLocation.x + 1];

            if(newCell && !newCell.isObstacle()) userLocation = {x: newCell.x, y: newCell.y};
        }

        // TOOD: Check if user reached objective

        // TODO: Leave trail behind user's marker

        updateDrawnPlayerPosition(ctx);
    }

    setTimeout(reactToUserInput, TIME_PER_CELL_MS);
}

function updateMaze() {

    // TODO: Limit number of cols/rows to odd numbers
    cols = document.getElementById("cellWidth").value;
    rows = document.getElementById("cellHeight").value;

    var canvas = document.getElementById("canvas");
    updateCanvasSize(canvas);

    maze = generateMaze();
    graph = undefined;

    var ctx = canvas.getContext("2d");
    drawMaze(ctx);
    updateDrawnPlayerPosition(ctx);
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