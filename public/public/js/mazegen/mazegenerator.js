const CELL_LENGTH = 10; // in px
const MIN_MAZE_DIMENSION = 5; // in cells
const TIME_PER_CELL_MS = 70;

const USER_COLOR = "red";
const OBSTACLE_COLOR = "black";
const EMPTY_COLOR = "white";
const OBJECTIVE_COLOR = "lime";

const OBSTACLE_CELL = "obstacle";
const EMPTY_CELL = "empty";
const OBJECTIVE_CELL = "objective";

var canvas;
var ctx;

var up;
var down;
var left;
var right;

var maze = [];
var userLocation = { x: 0, y: 0 };
var originalLocation = { x: 0, y: 0 };
var objectiveCell;
var cols;
var rows;

var stepsTaken = 0;
var optimalPath = 0;

function Cell(type, x, y, color) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.color = color;
    this.neighbors = [];
    this.accessibleNeighbors = [];

    this.isObjective = function () { return this.type == OBJECTIVE_CELL; }
    this.isObstacle = function () { return this.type == OBSTACLE_CELL; }
    this.isEmpty = function () { return this.type == EMPTY_CELL; }

    this.equals = function (other) { return this.x == other.x && this.y == other.y; }

    this.convertToEmpty = function () {
        this.type = EMPTY_CELL;
        this.color = EMPTY_COLOR;
    }

    this.convertToObstacle = function () {
        this.type = OBSTACLE_CELL;
        this.color = OBSTACLE_COLOR;
    }

    this.draw = function (drawColor = this.color) {
        ctx.fillStyle = drawColor;
        ctx.fillRect(this.x * CELL_LENGTH, this.y * CELL_LENGTH, CELL_LENGTH, CELL_LENGTH);
    }
}

function makeObstacleCell(x, y) { return new Cell(OBSTACLE_CELL, x, y, OBSTACLE_COLOR); }
function makeObjectiveCell(x, y) { return new Cell(OBJECTIVE_CELL, x, y, OBJECTIVE_COLOR); }
function makeEmptyCell(x, y) { return new Cell(EMPTY_CELL, x, y, EMPTY_COLOR); }

function getCellAtUserLocation() {
    return maze[userLocation.y][userLocation.x];
}

function updateCanvasSize() {
    canvas.width = CELL_LENGTH * cols;
    canvas.height = CELL_LENGTH * rows;
}

/*
    Modifies the given maze m, assumed empty, to be a fully-connected maze.

    This method starts with a grid of walls. Every wall is considered for
    removal, in random order. A wall is only removed if the empty spaces
    on either side of that wall are NOT already connected by empty space.

    More here: http://weblog.jamisbuck.org/2011/1/3/maze-generation-kruskal-s-algorithm
*/
function generateMazeKruskal(m) {

    // TODO: eyespots

    // Edges that will be considered for removal
    var edges = [];

    // Place initial grid and fill edges array
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var rowMod = (row % 2 == 0);
            var colMod = (col % 2 == 0);
            if (rowMod || colMod) {
                m[row][col].convertToObstacle();
                if (rowMod != colMod) edges.push(m[row][col]);
            }
            else {
                var c = [];
                c.push(m[row][col]);

                // We don't have to update quite as many references if we store the sets in an object
                // rather than just as a simple array. See note labeled @setObjects below...
                m[row][col].containingSet = { set: c };
            }
        }
    }

    // Generate graph
    generateGraphForMaze(m);

    // Loop over the list of relevant edges
    while (edges.length > 0) {

        // Choose a random edge and remove it from the list of edges
        var edgeInd = randomIndexOf(edges);
        var edge = edges[edgeInd];
        edges.splice(edgeInd, 1);

        // Gather all empty cell neighbors in n0 and n1
        var n0 = false;
        var n1 = false;
        var extra = false;
        for (var i = 0; i < edge.accessibleNeighbors.length; i++) {
            var neighbor = edge.accessibleNeighbors[i];

            if (!n0) n0 = neighbor;
            else if (!n1) n1 = neighbor;
            else extra = true;
        }

        // Consider tearing the wall down only if there are exactly
        // TWO empty neighbors -- any less/more and it wouldn't make sense
        if (n0 && n1 && !extra) {
            var setsAreEqual = true;
            var set0 = n0.containingSet.set;
            var set1 = n1.containingSet.set;

            // Check if the spaces are joined or not
            if (set0 !== set1) {

                m[edge.y][edge.x].convertToEmpty();

                // Array of length 2, the smaller array is at 0, bigger is at 1
                var setsBySize = set0.length > set1.length ? [set1, set0] : [set0, set1];

                var setContainer = setsBySize[1][0].containingSet;
                m[edge.y][edge.x].containingSet = setContainer;

                // @setObjects
                // Rather than have to update every set in every tile, we now only have to
                // update half at the most -- we can force all tiles in the same set to have
                // the same containingSet object, so that's the only reference we need to update
                setsBySize[1][0].containingSet.set = set0.concat(set1); // instantly update all references in the bigger set
                for (var i = 0; i < setsBySize[0].length; i++) // update references in the smaller set
                    setsBySize[0][i].containingSet = setContainer;
            }
        }
    }
}

/*
    Modifies the given maze m, assumed empty, to be a fully-connected maze.

    This method starts with a grid of walls. A path is carved through the grid
    by recursive backtracking/wandering -- tends to create river-like mazes.

    More here: http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
*/
function generateMazeRecursiveBacktracking(m) {

    // Place initial grid
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            if (row % 2 == 0 || col % 2 == 0)
                m[row][col].convertToObstacle();
            else
                m[row][col].visited = false;
        }
    }

    // Generate graph for neighbors
    generateGraphForMaze(m);

    // Get a random blank space as a starting point
    // This method is faster/more memory efficient than storing all blanks in an array
    var numBlanks = ((cols - 1) * (rows - 1)) / 4; // assumes odd rows/cols
    var blankCols = (cols - 1) / 2;
    var blankRows = (rows - 1) / 2;

    // Faster than running Math.rand() twice for cols and rows. Instead
    // I just generate one number using the total blanks and derive the
    // column/row position of the blank from that number
    var blankNum = Math.floor(Math.random() * numBlanks);
    var blankRow = (blankNum % blankRows) * 2 + 1;
    var blankCol = (blankNum % blankCols) * 2 + 1

    // Recursive wandering
    function carvePassages(cell) {

        cell.visited = true;

        var shuffledNeighbors = shuffleArray(cell.neighbors);

        for (var i = 0; i < shuffledNeighbors.length; i++) {
            var neighbor = shuffledNeighbors[i];
            if (neighbor.isObstacle()) {
                for (var j = 0; j < neighbor.accessibleNeighbors.length; j++) {
                    var adjacentEmptyCell = neighbor.accessibleNeighbors[j];
                    if (!adjacentEmptyCell.visited) {
                        neighbor.convertToEmpty();
                        carvePassages(adjacentEmptyCell);
                    }
                }
            }
        }
    }

    carvePassages(m[blankRow][blankCol]);
}

// Returns a new maze (2D array, row-indexed first) using the user-selected method
function generateMaze() {
    var newMaze = [];

    // Generate empty maze
    for (var row = 0; row < rows; row++) {
        var newRow = [];
        for (var col = 0; col < cols; col++) {
            newRow.push(makeEmptyCell(col, row));
        }
        newMaze.push(newRow);
    }

    // Generate maze innards -- these methods will not place starting/ending pts
    if (document.getElementById("radioKruskal").checked)
        generateMazeKruskal(newMaze);
    else
        generateMazeRecursiveBacktracking(newMaze);

    // Place starting point along west wall
    for (var row = 1; row < rows; row++) {
        if (newMaze[row][1].isEmpty()) {
            userLocation = { x: 1, y: row };
            originalLocation = userLocation;
            break;
        }
    }

    // Place objective along east wall
    for (var row = rows - 2; row >= 0; row--) {
        if (newMaze[row][cols - 2].isEmpty()) {
            objectiveCell = makeObjectiveCell(cols - 1, row);
            newMaze[row][cols - 1] = objectiveCell;
            break;
        }
    }

    return newMaze;
}

// Draw the entire maze in the default color
function drawMaze() {
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            maze[row][col].draw();
        }
    }
}

// Redraw the player in the normal player color
function updateDrawnPlayerPosition() {
    getCellAtUserLocation().draw(USER_COLOR);
}

// Redraw the player's current position in the default color
function clearDrawnPlayerPosition() {
    getCellAtUserLocation().draw();
}

// Runs every TIME_PER_CELL_MS, so needs to be fast
function reactToUserInput() {

    // Ignore conflicting input
    if (!((up && down) || (left && right))) {

        // Remove player from old position
        clearDrawnPlayerPosition();

        var oldCell = getCellAtUserLocation();
        var newCell;

        // Determine new location if there is one...
        if (up && userLocation.y != 0) newCell = maze[userLocation.y - 1][userLocation.x];
        else if (down && userLocation.y != cols - 1) newCell = maze[userLocation.y + 1][userLocation.x];

        if (newCell && !newCell.isObstacle()) userLocation = { x: newCell.x, y: newCell.y };
        else {
            if (left) newCell = maze[userLocation.y][userLocation.x - 1];
            else if (right) newCell = maze[userLocation.y][userLocation.x + 1];

            if (newCell && !newCell.isObstacle()) userLocation = { x: newCell.x, y: newCell.y };
        }

        // Player moved to a valid space
        if (newCell && !newCell.isObstacle() && !newCell.equals(oldCell)) {

            // Update steps and leave a trail behind
            stepsTaken++;
            oldCell.draw("orange");

            // TODO: make trail darken upon backtracking

            // Player reached the objective
            if (newCell.isObjective()) {
                var message = "Congratulations, you solved the maze!";
                message += "\nSteps taken:  " + stepsTaken;
                message += "\nOptimal path: " + optimalPath;
                alert(message);
            }
        }

        // Draw player at new position
        updateDrawnPlayerPosition();
    }

    // Call this function again in TIME_PER_CELL_MS
    setTimeout(reactToUserInput, TIME_PER_CELL_MS);
}

function resetMaze(redraw = true) {
    up = down = left = right = false;
    stepsTaken = 0;
    userLocation = originalLocation;

    if (redraw) drawMaze();
}

// If the inputs are appropriate, purges the current maze and generates a new one in its place.
// Resets any variables like user position, held keys, paths, etc. that the old maze relied on.
function remakeMaze() {

    // Reset any variables from the previous maze
    resetMaze(false);

    // Get columns and rows from the input boxes
    cols = document.getElementById("cellWidth").value;
    rows = document.getElementById("cellHeight").value;

    // Limit numbers to odd values
    if (cols % 2 == 0) cols++;
    if (rows % 2 == 0) rows++;

    // Prevent the user from trying to generate anything too small
    if (cols < MIN_MAZE_DIMENSION || rows < MIN_MAZE_DIMENSION) {
        alert("Maze cannot be smaller than " + MIN_MAZE_DIMENSION + " cells in any dimension.");
        return;
    }

    // Generate maze and update the canvas...
    updateCanvasSize();

    maze = generateMaze();

    drawMaze();
    updateDrawnPlayerPosition();

    // Solve the maze in order to get the optimal number of steps
    // Function automatically changes optimalPath to the optimal number of steps
    solveMaze(false); // false prevents solution from displaying
}

function onKeyDown(event) {

    var keyCode = event.keyCode;

    // Always respond to enter being pressed by regenerating the maze
    if (keyCode == 13) {
        remakeMaze();
        return;
    }

    // Don't capture input if the user is already in a text box
    if (document.activeElement instanceof HTMLInputElement && document.activeElement.type == "text") {
        return;
    }

    // Respond to directional inputs
    switch (keyCode) {
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

    // Always keep track of direction inputs being released
    switch (keyCode) {
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

// Add event listeners to the various buttons and fields on the page
function addEventListeners() {

    // Add event listener to generate maze button
    document.getElementById("genMazeBtn").addEventListener('click', remakeMaze, false);

    // Add event listener to solve maze button
    document.getElementById("solveMazeBtn").addEventListener('click', solveMaze, false);

    // Add event listener to reset maze button
    document.getElementById("resetBtn").addEventListener('click', resetMaze, false);

    // Add download action to the download button
    document.getElementById("download").addEventListener('click', function () {
        downloadMaze(this, 'maze.png');
    }, false);

    // Add event listeners for moving about the maze
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
}

// Runs on load
function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    remakeMaze();
    addEventListeners();
    reactToUserInput();
}

document.addEventListener("DOMContentLoaded", function () {
    init();
});