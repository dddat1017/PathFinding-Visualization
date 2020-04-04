// Runs BFS algorithm based on user's selections of start/end/barrier cells.
// Used in pathfinding page only.

// biGraph class representing the bigrid.
class biGraph {
    constructor(r, c) {
        this.numRows_ = r;
        this.numCols_ = c;
        this.grid_ = "<table>";
        this.forwardvisited_ = [];
        this.backwardvisited_ = [];
        for (var row = 0; row < r; row++) {
            this.grid_ += "<tr>"; 
            this.forwardvisited_[row] = [];
            this.backwardvisited_[row] = [];
            for (var col = 0; col < c; col++) {      
                this.grid_ += '<td id="' + row + 'r' + 'c' + col + '"' + '></td>';
                this.forwardvisited_[row][col] = false;
                this.backwardvisited_[row][col] = false;
            }
            this.grid_ += "</tr>"; 
        }
    }

    getGrid() {
        return this.grid_;
    }

    getVisitedMatrix() {
        return [this.forwardvisited_, this.backwardvisited_];
    }

    getRows() {
        return this.numRows_;
    }

    getCols() {
        return this.numCols_;
    }
}  // biGraph class.

// biGridCell class representing the row,col values of a cell in the bigrid.
class biGridCell {
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
}  // biGridCell class.

// Array representation of a queue. First-in-first-out (FIFO).
class biQueue {
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
}  // biQueue class.

// biSearch class which implements the BFS algorithm.
class biSearch {
    constructor(forwardVisited, backwardVisited, startRC, endRC, numRows, numCols) {
        this.isSuccessful_ = false;

        var forwardqueue_ = new biQueue();
        var backwardqueue_ = new biQueue();
        this.forwardedgeTo_ = new Map();
        this.backwardedgeTo_ = new Map();
        this.states = new biQueue();
        this.mid;

        forwardqueue_.add(startRC);
        backwardqueue_.add(endRC);

        var fkey = "" + startRC.getRow() + "r" + startRC.getColumn() + "c";
        var bkey = "" + endRC.getRow() + "r" + endRC.getColumn() + "c";
        this.forwardedgeTo_.set(fkey, startRC);
        this.backwardedgeTo_.set(bkey, endRC);
        forwardVisited[startRC.getRow()][startRC.getColumn()] = true;
        backwardVisited[endRC.getRow()][endRC.getColumn()] = true;

        // Direction vectors for going N,S,E,W,NE,NW,SE,SW.
        var c = [0, 1, 0, -1, 1, 1, -1, -1];
        var r = [-1, 0, 1, 0, -1, 1, -1, 1];

        while (!forwardqueue_.isEmpty() && !backwardqueue_.isEmpty()) {
            var a = forwardqueue_.remove();
            if (!a.equals(startRC)) { this.states.add(a); }
            var bR = a.getRow();
            var bC = a.getColumn();
            var maybeMid = "" + bR + "r" + bC + "c";
            if (this.backwardedgeTo_.has(maybeMid)) { 
                this.mid = a;
                this.isSuccessful_ = true;
                break;
            }
            for (var i = 0; i < 8; i++) {
                var rNeighbor = bR + r[i];
                var cNeighbor = bC + c[i];
                if (!this.isSafe(forwardVisited, rNeighbor, cNeighbor, numRows, numCols)) { continue; }
                
                forwardVisited[rNeighbor][cNeighbor] = true;
                var neighbor = new biGridCell(rNeighbor, cNeighbor);
                var fk = "" + rNeighbor + "r" + cNeighbor + "c";
                this.forwardedgeTo_.set(fk, a);
                forwardqueue_.add(neighbor);
            }

            var v = backwardqueue_.remove();
            var wR = v.getRow();
            var wC = v.getColumn();
            if (!v.equals(endRC)) { this.states.add(v); }
            maybeMid = "" + wR + "r" + wC + "c";
            if (this.forwardedgeTo_.has(maybeMid)) {
                this.mid = v;
                this.isSuccessful_ = true;
                break;
            }
            for (var i = 0; i < 8; i++) {
                var rNeighbor = wR + r[i];
                var cNeighbor = wC + c[i];
                if (!this.isSafe(backwardVisited, rNeighbor, cNeighbor, numRows, numCols)) { continue; }
                
                backwardVisited[rNeighbor][cNeighbor] = true;
                var neighbor = new biGridCell(rNeighbor, cNeighbor);
                var bk = "" + rNeighbor + "r" + cNeighbor + "c";
                this.backwardedgeTo_.set(bk, v);
                backwardqueue_.add(neighbor);
            }
        }
    }

    getPath() {
        return [this.forwardedgeTo_, this.backwardedgeTo_, this.mid];
    }

    isSuccessful() {
        return this.isSuccessful_;
    }

    statesExplored() {
        return this.states;
    }

    isSafe(bivisited, row, col, numRows, numCols) {
        return (row >= 0) && (row < numRows) && (col >= 0) && (col < numCols) && (!bivisited[row][col]); 
    }

    isGoal(row, col, endRC) {
        return (row == endRC.getRow()) && (col == endRC.getColumn());
    }
}  // biSearch class.

// Flush & Create.
document.getElementById("instructions").innerHTML = "&#8618; Choose your <strong>START</strong>!";
$("#instructions").css({"float":"left", "font-weight":"590", "margin-bottom":"7px", "color":"green"});
document.getElementById("tableContainer").innerHTML = "";
document.getElementById("okClear").innerHTML = "";

var bigraph = new biGraph(20, 60);
var bigrid = bigraph.getGrid();  // Grid.
var bivisited = bigraph.getVisitedMatrix();  // Matrix initialized w/ 'false', for not bivisited.
var birows = bigraph.getRows();  // # of birows in the bigrid.
var bicols = bigraph.getCols();  // # of bicols in the bigrid.
var bisRC;  // The start cell's row,col values.
var bieRC;  // The end cell's row,col values.

$("#tableContainer").append(bigrid);  // Add the bigrid to html.

// When 'Okay!' is clicked. Where the magic all happens.
function birun() {
    var bfs = new biSearch(bivisited[0], bivisited[1], bisRC, bieRC, birows, bicols);
    $('td').off();
    document.getElementById("instructions").innerHTML = "&#8618; Please Wait until path is found!";
    $('#instructions').css('color', '#48D1CC');

    var htmlText = "";
    if (bfs.isSuccessful()) {
        var statesExplored = bfs.statesExplored();
        var path =  bfs.getPath();
        var forward = path[0];
        var backward = path[1];
        var midCell = path[2];
        var midkey = "" + midCell.getRow() + "r" + midCell.getColumn() + "c";

        var t = setInterval(doSequence, 0.01);
        function doSequence() {
            if (!statesExplored.isEmpty()) {
                var state = statesExplored.remove();
                $("#" + state.getRow() + "r" + "c" + state.getColumn()).css('background-color', '#7FFFD4');
            } else {
                var fstep = forward.get(midkey);
                while (!fstep.equals(bisRC)) {
                    $("#" + fstep.getRow() + "r" + "c" + fstep.getColumn()).css('background-color', '#e6e600');
                    var fstepkey = "" + fstep.getRow() + "r" + fstep.getColumn() + "c";
                    fstep = forward.get(fstepkey);
                }
        
                var bstep = backward.get(midkey);
                while (!bstep.equals(bieRC)) {
                    $("#" + bstep.getRow() + "r" + "c" + bstep.getColumn()).css('background-color', '#e6e600');
                    var bstepkey = "" + bstep.getRow() + "r" + bstep.getColumn() + "c";
                    bstep = backward.get(bstepkey);
                }
        
                $("#" + midCell.getRow() + "r" + "c" + midCell.getColumn()).css('background-color', '#e6e600');
                htmlText += "&#8618; Path found! Click 'Clear' to reset.";
                document.getElementById("instructions").innerHTML = htmlText;
                $('#instructions').css('color', 'black');
                clearInterval(t);
            }
        }
    } else {
        htmlText += "&#8618; No possible path found. Click 'Clear' to reset and try again!";
        document.getElementById("instructions").innerHTML = htmlText;
        $('#instructions').css('color', 'black');
    } 
}

// Wait for user to select the start/end/barrier. Once 'Okay!' is selected, birun() is invoked.
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
            bisRC = new biGridCell(rc[0], rc[1]);  // Record the start cell's row,col values.
            htmlText += "&#8618; Now choose the EXIT. (Click 'Clear' to reset)";
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
            bieRC = new biGridCell(rc[0], rc[1]);  // Record the end cell's row,col values.
            htmlText = "&#8618; Now create your BARRIER/OBSTACLE. ";
            htmlText += "(Click 'Okay!' when you're done or 'Clear' to reset)";
            document.getElementById("instructions").innerHTML = htmlText;
            htmlText = '<input id="done" type="button" value="Okay!" style="background-color:#22272F;" ';
            htmlText += 'onclick="birun(); this.onclick=null;">';
            $('#okClear')
                .append(htmlText);
            $('#instructions').css('color', 'red');
        } else {
            // Barrier selections.
            eyeD = $(this).attr('id');  // Get 'id' of the 'td' clicked.

            // Extract the row and col from the 'id' of the 'td' clicked, and put them in an array.
            rc = eyeD.split('rc').map(Number);
            $(this).addClass("highlighted");
            $(this).off('mousedown');
            counter++;
            bivisited[0][rc[0]][rc[1]] = true;
            bivisited[1][rc[0]][rc[1]] = true;
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
            bivisited[0][rc[0]][rc[1]] = true;
            bivisited[1][rc[0]][rc[1]] = true;
        }
    }).bind("selectstart", function () {
        return false;
    });

    // On desktops/laptops.
    $('td').mouseup(function () {
        isMouseDown = false;
    });
});
