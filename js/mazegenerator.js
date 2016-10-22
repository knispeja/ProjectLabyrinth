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

var animating = false;
var maze = [];
var userLocation = {x:0, y:0};
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

    this.isObjective = function() {return this.type == OBJECTIVE_CELL;}
    this.isObstacle = function() {return this.type == OBSTACLE_CELL;}
    this.isEmpty = function() {return this.type == EMPTY_CELL;}

    this.draw = function(ctx, drawColor = this.color) {
        ctx.fillStyle = drawColor;
        ctx.fillRect(this.x * CELL_LENGTH, this.y * CELL_LENGTH, CELL_LENGTH, CELL_LENGTH);
    }
}

function makeObstacleCell(x, y) {return new Cell(OBSTACLE_CELL, x, y, "black");}
function makeObjectiveCell(x, y) {return new Cell(OBJECTIVE_CELL, x, y, "green");}
function makeEmptyCell(x, y) {return new Cell(EMPTY_CELL, x, y, "white");}

function updateCanvasSize(canvas) {
    canvas.width = CELL_LENGTH * cols;
    canvas.height = CELL_LENGTH * rows;
}

function generateMaze() {
    var newMaze = [];
    for(row=0; row<rows; row++) {
        var newRow = [];
        for(col=0; col<cols; col++) {
            // TODO: Replace with real generation
            if((row + col) % 3 == 0)
                newRow.push(makeObstacleCell(col, row));
            else
                newRow.push(makeEmptyCell(col, row));
        }
        newMaze.push(newRow);
    }
    return newMaze;
}

function drawMaze(ctx) {
    for(row=0; row<rows; row++) {
        for(col=0; col<cols; col++) {
            maze[row][col].draw(ctx);
        }
    }
}

function updateDrawnPlayerPosition(ctx) {
    maze[userLocation.y][userLocation.x].draw(ctx, USER_COLOR);
}

function clearDrawnPlayerPosition(ctx) {
    maze[userLocation.y][userLocation.x].draw(ctx);
}

function reactToUserInput() {

    if(animating) return;
    if(!((up && down) || (left && right))) {
        animating = true;

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

        animating = false;
    }

    setTimeout(reactToUserInput, TIME_PER_CELL_MS);
}

function updateMaze() {

    animating = true;

    cols = document.getElementById("cellWidth").value;
    rows = document.getElementById("cellHeight").value;

    var canvas = document.getElementById("canvas");
    updateCanvasSize(canvas);

    maze = generateMaze();

    var ctx = canvas.getContext("2d");
    drawMaze(ctx);
    updateDrawnPlayerPosition(ctx);

    animating = false;
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

window.onload = updateMaze;