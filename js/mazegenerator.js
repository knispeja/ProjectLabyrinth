const CELL_LENGTH = 10; // in px
const USER_COLOR = "red";

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

    this.draw = function(ctx, drawColor = this.color) {
        ctx.fillStyle = drawColor;
        ctx.fillRect(this.x * CELL_LENGTH, this.y * CELL_LENGTH, CELL_LENGTH, CELL_LENGTH);
    }
}

function makeEmptyCell(x, y) {return new Cell("empty", x, y, "white")}
function makeObstacleCell(x, y) {return new Cell("obstacle", x, y, "black")}

function updateCanvasSize(canvas) {
    canvas.width = CELL_LENGTH * cols;
    canvas.height = CELL_LENGTH * rows;
}

function generateMaze() {

    var newMaze = [];

    for(row=0; row<rows; row++) {
        var newRow = [];
        for(col=0; col<cols; col++) {
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

function updateMaze() {

    cols = document.getElementById("cellWidth").value;
    rows = document.getElementById("cellHeight").value;

    var canvas = document.getElementById("canvas");
    updateCanvasSize(canvas);

    maze = generateMaze();

    var ctx = canvas.getContext("2d");
    drawMaze(ctx);
    updateDrawnPlayerPosition(ctx);
}

window.onload = updateMaze;