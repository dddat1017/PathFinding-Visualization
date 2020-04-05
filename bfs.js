// Runs BFS algorithm based on user's selections of start/end/barrier cells.
// Used in pathfinding page only.

// Graph class representing the grid.
class Graph {
    constructor(r, c) {
        this.numRows_ = r;
        this.numCols_ = c;
        this.grid_ = "<table>";
        this.visited_ = [];
        for (var row = 0; row < r; row++) {
            this.grid_ += "<tr>"; 
            this.visited_[row] = [];
            for (var col = 0; col < c; col++) {      
                this.grid_ += '<td id="' + row + 'r' + 'c' + col + '"' + '></td>';
                this.visited_[row][col] = false;
            }
            this.grid_ += "</tr>"; 
        }
    }

    getGrid() {
        return this.grid_;
    }

    getVisitedMatrix() {
        return this.visited_;
    }

    getRows() {
        return this.numRows_;
    }

    getCols() {
        return this.numCols_;
    }
}  // Graph class.

// GridCell class representing the row,col values of a cell in the grid.
class GridCell {
    constructor(r, c) {
        this.row_ = r;
        this.column_ = c;
    }

    getRow() {
        return this.row_;
    }

    getColumn() {
        return this.column_;
    }

    equals(other) {
        return (this.row_ == other.getRow() && this.column_ == other.getColumn());
    }
}  // GridCell class.

// Array representation of a queue. First-in-first-out (FIFO).
class Queue {
    constructor() {
        this.q_ = [];
    }

    add(item) {
        this.q_.push(item);
    }

    remove() {
        if (this.isEmpty())
            return "Underflow";
        return this.q_.shift();
    }

    isEmpty() {
        return this.size() == 0;
    }

    size() {
        return this.q_.length;
    }
}  // Queue class.

// Search class which implements the BFS algorithm.
class Search {
    constructor(visitedMatrix, startRC, endRC, numRows, numCols) {
        this.isSuccessful_ = false;

        var queue_ = new Queue();
        this.edgeTo_ = new Map();  // "#r#c" -> GridCell(prevR, prevC)
        this.states = new Queue();  // All the states explored.

        queue_.add(startRC);
        visitedMatrix[startRC.getRow()][startRC.getColumn()] = true;

        var key = "" + startRC.getRow() + "r" + startRC.getColumn() + "c";
        this.edgeTo_.set(key, startRC);

        // Direction vectors.
        var c = [0, 1, 0, -1, 1, 1, -1, -1];
        var r = [-1, 0, 1, 0, -1, 1, -1, 1];

        var isTrue = true;
        while ((!queue_.isEmpty()) && isTrue) {
            var currentRC = queue_.remove();
            if (!currentRC.equals(startRC) && !currentRC.equals(endRC)) {
                this.states.add(currentRC);
            }
            var currentR = currentRC.getRow();
            var currentC = currentRC.getColumn();
            for (var i = 0; i < 8; i++) {
                var rNeighbor = currentR + r[i];
                var cNeighbor = currentC + c[i];
                if (!this.isSafe(visitedMatrix, rNeighbor, cNeighbor, numRows, numCols)) { continue; }
                if (this.isGoal(rNeighbor, cNeighbor, endRC)) {
                    isTrue = false;
                    this.isSuccessful_ = true;
                }
                
                visited[rNeighbor][cNeighbor] = true;
                var neighbor = new GridCell(rNeighbor, cNeighbor);
                key = "" + rNeighbor + "r" + cNeighbor + "c";
                this.edgeTo_.set(key, currentRC);
                queue_.add(neighbor);
            }
        }
    }

    getPath() {
        return this.edgeTo_;
    }

    isSuccessful() {
        return this.isSuccessful_;
    }

    statesExplored() {
        return this.states;
    }

    isSafe(visited, row, col, numRows, numCols) {
        return (row >= 0) && (row < numRows) && (col >= 0) && (col < numCols) && (!visited[row][col]); 
    }

    isGoal(row, col, endRC) {
        return (row == endRC.getRow()) && (col == endRC.getColumn());
    }
}  // Search class.

// Flush first (i.e. reset everything).
document.getElementById("instructions").innerHTML = "> Choose where to start!";
$("#instructions").css({"float":"left", "font-weight":"590", "margin-bottom":"7px", "color":"green"});
document.getElementById("tableContainer").innerHTML = "";
document.getElementById("okClear").innerHTML = "";

// Create.
var graph = new Graph(20, 60);
var grid = graph.getGrid();  // Grid.
var visited = graph.getVisitedMatrix();  // Matrix initialized w/ 'false', for not visited.
var rows = graph.getRows();  // # of rows in the grid.
var cols = graph.getCols();  // # of cols in the grid.
var sRC;  // The start cell's row,col values.
var eRC;  // The end cell's row,col values.

$("#tableContainer").append(grid);  // Add the grid to html.

// When 'Okay!' is clicked. Where the magic all happens.
function run() {
    var bfs = new Search(visited, sRC, eRC, rows, cols);
    $('td').off();
    document.getElementById("instructions").innerHTML = "> Please wait until the path is found!";
    $('#instructions').css('color', '#48D1CC');

    var statesExplored = bfs.statesExplored();

    var htmlText = "";
    if (bfs.isSuccessful()) {
        var path =  bfs.getPath();

        var t = setInterval(doSequence, 0.01);
        function doSequence() {
            if (!statesExplored.isEmpty()) {
                // Display all the states explored.
                var state = statesExplored.remove();
                $("#" + state.getRow() + "r" + "c" + state.getColumn()).css('background-color', '#7FFFD4');
            } else {
                // Retrace/display the path.
                var key = "" + eRC.getRow() + "r" + eRC.getColumn() + "c";
                var step = path.get(key);
                while (!step.equals(sRC)) {
                    $("#" + step.getRow() + "r" + "c" + step.getColumn()).css('background-color', '#e6e600');
                    key = "" + step.getRow() + "r" + step.getColumn() + "c";
                    step = path.get(key);
                }
                htmlText += "> Path found! Click 'Clear' to reset.";
                document.getElementById("instructions").innerHTML = htmlText;
                $('#instructions').css('color', 'black');
                clearInterval(t);
            }
        }
    } else {
        var t = setInterval(doSequence, 0.01);
        function doSequence() {
            if (!statesExplored.isEmpty()) {
                // Display all the states explored.
                var state = statesExplored.remove();
                $("#" + state.getRow() + "r" + "c" + state.getColumn()).css('background-color', '#7FFFD4');
            } else {
                htmlText += "> No possible path found. Click 'Clear' to reset and try again!";
                document.getElementById("instructions").innerHTML = htmlText;
                $('#instructions').css('color', 'black');
                clearInterval(t);
            }
        }
    }
}

// Wait for user to select the start/end/barrier. Once 'Okay!' is selected, run() is invoked.
$(function() {
    var isMouseDown = false;
    var eyeD;
    var rc; 
    var counter = 0;
    var htmlText = "";

    // On desktops/laptops.
    $('td').mousedown(function() {
        isMouseDown = true;
        if (counter < 1) {
            // First selection is the start cell.
            eyeD = $(this).attr('id');  // Get 'id' of the 'td' clicked.

            // Extract the row and col from the 'id' of the 'td' clicked, and put them in an array.
            rc = eyeD.split('rc').map(Number);
            $(this).css('background-color', 'green');
            $(this).off('mousedown');
            $(this).off('mouseover');
            counter++;
            sRC = new GridCell(rc[0], rc[1]);  // Record the start cell's row,col values.
            htmlText += "> Now choose where to end. (Click 'Clear' to reset)";
            document.getElementById("instructions").innerHTML = htmlText;
            $('#okClear')
                .append('<input id="reset" type="button" value="Clear" onClick="document.location.reload(false)">');
            $('#instructions').css('color', 'blue');
        } else if (counter < 2) {
            // Second selection is the end cell.
            eyeD = $(this).attr('id');  // Get 'id' of the 'td' clicked.

            // Extract the row and col from the 'id' of the 'td' clicked, and put them in an array.
            rc = eyeD.split('rc').map(Number);
            $(this).css('background-color', 'blue');
            $(this).off('mousedown');
            $(this).off('mouseover');
            counter++;
            eRC = new GridCell(rc[0], rc[1]);  // Record the end cell's row,col values.
            htmlText = "> Now create the BARRIERS. ";
            htmlText += "(Click 'Search' when done or 'Clear' to reset)";
            document.getElementById("instructions").innerHTML = htmlText;
            htmlText = '<input id="done" type="button" value="Search" style="background-color:#22272F;" ';
            htmlText += 'onclick="run(); this.onclick=null;">';
            $('#okClear').append(htmlText);
            $('#instructions').css('color', 'red');
        } else {
            // Barrier selections.
            eyeD = $(this).attr('id');  // Get 'id' of the 'td' clicked.

            // Extract the row and col from the 'id' of the 'td' clicked, and put them in an array.
            rc = eyeD.split('rc').map(Number);
            $(this).addClass("highlighted");
            $(this).off('mousedown');
            counter++;
            visited[rc[0]][rc[1]] = true;  // Mark all barrier cells as 'true', for visited.
            return false;  // Prevent text selection.
        }
    });

    // On desktops/laptops. For selecting multiple barrier cells at once (i.e. click and drag).
    $('td').mouseover(function () {
        if (isMouseDown && counter > 1) {
            eyeD = $(this).attr('id');  // Get 'id' of the 'td' clicked.

            // Extract the row and col from the 'id' of the 'td' clicked, and put them in an array.
            rc = eyeD.split('rc').map(Number);
            $(this).addClass("highlighted");
            $(this).off('mouseover');
            counter++;
            visited[rc[0]][rc[1]] = true;  // Mark all barrier cells as 'true', for visited.
        }
    }).bind("selectstart", function () {
        return false;
    });

    // On desktops/laptops.
    $('td').mouseup(function () {
        isMouseDown = false;
    });
});
