const CELL_LENGTH = 4; // in px

var maze = [];
var userLocation = {x:0, y:0};
var cols;
var rows;

// Used for form inputs that only accept numbers
function numericOnly() {
    return event.charCode >= 48 && event.charCode <= 57;
}

function Cell(x, y) {

    this.type = "empty";
    this.x = x;
    this.y = y;

    this.draw = function(drawColor = this.color) {

    }
}
Cell.prototype.color = "white";

function updateCanvasSize() {
    var canvas = document.getElementById("canvas");
    canvas.width = CELL_LENGTH * cols;
    canvas.height = CELL_LENGTH * rows;
}

function generateMaze() {

    var newMaze = [];

    for(row=0; row<rows; row++) {
        var newRow = [];
        for(col=0; col<cols; col++) {

        }
        newMaze.push(newRow);
    }

    return newMaze;
}

function drawMaze() {
    for(row=0; row<rows; row++) {
        for(col=0; col<cols; col++) {

        }
    }
}

function updateMaze() {

    cols = document.getElementById('cellWidth').value;
    rows = document.getElementById('cellHeight').value;

    updateCanvasSize();

    maze = generateMaze();

    // TODO: Draw maze walls and clear empty space

    // TODO: Set userLocation to start position
}

window.onload = updateMaze;