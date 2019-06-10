// function to create matrix. Returns array consisted of [matrix, # of rows in matrix, # of cols in matrix].
function generateMatrix(rows, cols) {
    var matrix = [];
    for (i = 0; i < rows; i++) {
        matrix[i] = [];
        for (j = 0; j < cols; j++) {
            matrix[i][j] = i + "r" + "c" + j;
        }
    }
    return [matrix, rows, cols];
}

// function to create matrix same as generateMatrix(), but this matrix is initialized with all boolean values 'false'.
// used in order to keep track of which cell was visited.
function generateVisitedMatrix(rr, cc) {
    visited_matrix = generateMatrix(rr, cc)[0];
    for(i = 0; i < rr; i++) {
        for(j = 0; j < cc; j++) {
            visited_matrix[i][j] = false;
        }
    }
    return visited_matrix;
}

// function to create grid. Also, creates a matrix with same dimensions as the grid, using the generateMatrix() function. 
// Returns array consisted of [grid, matrix].
function generateGrid(r, c) {
    var matrix = generateMatrix(r, c);
    var grid = "<table>";
    for (row = 0; row < r; row++) {
        grid += "<tr>"; 
        for (col = 0; col < c; col++) {      
            grid += '<td id="' + row + 'r' + 'c' + col + '"' + '></td>';
        }
        grid += "</tr>"; 
    }
    return [grid, matrix];
}

// clicking and selecting cells.
$(function() {
    var isMouseDown = false;
    var eyeD;
    var rc; 
    var counter = 0;

    // on desktops/laptops.
    $('td').mousedown(function() {
        isMouseDown = true;
        if (counter < 1) {
            eyeD = $(this).attr('id');    // get 'id' of the 'td' clicked.

            // extract the row and col from the 'id' of the 'td' clicked, and put them in an array.
            rc = eyeD.split('rc').map(Number);
            $(this).css('background-color', 'green');
            $(this).off('mousedown');
            $(this).off('mouseover');
            counter++;
            m[rc[0]][rc[1]] = "S";
            startR = rc[0];     // row value of where "S" is in the matrix.
            startC = rc[1];     // col value of where "S" is in the matrix.
            document.getElementById("instructions").innerHTML = "&#8618; Now choose the <strong>EXIT</strong>! (Click <strong>'Clear'</strong> to reset)";
            $('#okClear').append('<input id="reset" type="button" value="Clear" onClick="document.location.reload(true)">');
            $('#instructions').css('color', 'blue');
        } else if (counter < 2) {
            eyeD = $(this).attr('id');    // get 'id' of the 'td' clicked.

            // extract the row and col from the 'id' of the 'td' clicked, and put them in an array.
            rc = eyeD.split('rc').map(Number);
            $(this).css('background-color', 'blue');
            $(this).off('mousedown');
            $(this).off('mouseover');
            counter++;
            m[rc[0]][rc[1]] = "E";
            endRC.push(rc[0]);
            endRC.push(rc[1]);
            document.getElementById("instructions").innerHTML = "&#8618; Now create your <strong>BARRIER/OBSTACLE</strong>! (Click <strong>'Okay!'</strong> when you're done or <strong>'Clear'</strong> to reset)";
            $('#okClear').append('<input id="done" type="button" value="Okay!" onclick="run(); this.onclick=null;">');
            $('#instructions').css('color', 'red');
        } else {
            eyeD = $(this).attr('id');    // get 'id' of the 'td' clicked.

            // extract the row and col from the 'id' of the 'td' clicked, and put them in an array.
            rc = eyeD.split('rc').map(Number);
            $(this).addClass("highlighted");
            $(this).off('mousedown');
            counter++;
            m[rc[0]][rc[1]] = "#";
            return false; // prevent text selection
        }
    });

    // on desktops/laptops.
    $('td').mouseover(function () {
        if (isMouseDown) {
            eyeD = $(this).attr('id');    // get 'id' of the 'td' clicked.

            // extract the row and col from the 'id' of the 'td' clicked, and put them in an array.
            rc = eyeD.split('rc').map(Number);
            $(this).addClass("highlighted");
            $(this).off('mouseover');
            counter++;
            m[rc[0]][rc[1]] = "#";
        }
    }).bind("selectstart", function () {
        return false;
    });

    // on desktops/laptops.
    $('td').mouseup(function () {
        isMouseDown = false;
    });
});

// create.
var table = generateGrid(20, 60);
var g = table[0];   // grid with size R X C.
var m = table[1][0];   // matrix from the array returned by generateMatrix(). 
var R = table[1][1];   // number of rows from the array returned by generateMatrix().
var C = table[1][2];   // number of columns from the array returned by generateMatrix().
var startR;    // (initialize) row value of where "S" is, in the matrix.
var startC;    // (initialize) col value of where "S" is, in the matrix.
var endRC = [];    // empty matrix to store 'r, c' of "E" cell.

$("#tableContainer").append(g);    // add the grid to .html.

var rq = [];    // row queue.
var cq = [];    // col queue.

// "visited matrix" of size RxC initialized with all boolean values 'false', to keep track of visited cells.
// created with generateVisitedMatrix().
var visited_m = generateVisitedMatrix(R, C);

// direction vectors for going N,S,E,W,NE,NW,SE,SW.
var up = [-1, 1, 0];    
var down = [0, -1, 1];

// function to solve for the path. Returns a queue of all the "visited" cells.
function solve() {
    // enqueue the row value of the "S" cell to the row queue and col value to the col queue.
    rq.push(startR);
    cq.push(startC);

    // "visited queue" to store each visited cell and its "parent". This will help retrace steps.
    // form is [rVisited, cVisited, rParent, cParent].
    var visited_q = [];
    visited_q.push([startR, startC]);    // enqueue the [r, c] (no "parent") of the "S" cell to the "visited queue".

    visited_m[startR][startC] = true;   // mark the "S" cell as visited in the "visited matrix".
    while (rq.length > 0) {    // or (cq.size() > 0).
        var rrr = rq.shift();   // dequeue the row queue.
        var ccc = cq.shift();   // dequeue the col queue.
        explore_neighbors(rrr, ccc, visited_q);    // pass in the dequeue values and the "visited queue"
    }
    return visited_q;   // return the visited matrix.
}

// function to retrieve all possible "neighbors" of a cell. 
// Parameters take row val of parent cell, col value of parent cell, and "visited queue".
function explore_neighbors(rVal, cVal, q) {
    // iteration of the loops correspond to the number of components in the direction vectors, which is 3.
loop1:    
    for (i = 0; i < 3; i++) {
        var rNeighbor = rVal + up[i];    // row value of possible neighbor cell.
loop2:
        for (j = 0; j < 3; j++) {
            var cNeighbor = cVal + down[j];    // col value of possible neighbor cell.

            // if "out of bounds" (i.e. out of the matrix dimensions).
            if (rNeighbor < 0 || cNeighbor < 0) { continue;} 
            if (rNeighbor >= R || cNeighbor >= C) { continue;} 

            // if already visited.
            if (visited_m[rNeighbor][cNeighbor]) { continue;} 

            // if a barrier cell.
            if (m[rNeighbor][cNeighbor] === "#") { continue;}

            // if the exit, "E", cell.
            if (m[rNeighbor][cNeighbor] === "E") { 
                // empty the row queue & col queue, BC we will want to break out of the while loop in solve().
                rq = [];  
                cq = [];

                // enqueue [r"E"], c"E", rParent, cParent] to the "visited queue".
                q.push([rNeighbor, cNeighbor, rVal, cVal]);
                visited_m[rNeighbor][cNeighbor] = true;    // mark this "E" cell as 'true' in "visited" matrix.
                break loop1;    // break out of the nested loops.
            }

            // enqueue the row value and col value of this newly found (and valid) neighbor cell into the 
            // row queue and col queue, respectively.
            rq.push(rNeighbor);
            cq.push(cNeighbor);

            // enqueue [rNeighbor], cNeighbor, rParent, cParent] to the "visited queue".
            q.push([rNeighbor, cNeighbor, rVal, cVal]);
            visited_m[rNeighbor][cNeighbor] = true;    // // mark this neighbor cell as 'true' in "visited" matrix.
        }
    }
}

// function to contruct the shortest path. Returns array of shortest path.
function retrace(path_q) {
    var path = [];
    path.push([path_q[path_q.length - 1][0], path_q[path_q.length - 1][1]]);
    var parentR = path_q[path_q.length - 1][2];
    var parentC = path_q[path_q.length - 1][3];

    // start comparing from the second to last element.
    for (i = (path_q.length - 2); i >= 0; i--) {   
        if (parentR === path_q[i][0] && parentC === path_q[i][1]) {
            path.unshift([path_q[i][0], path_q[i][1]]);
            if (i === 0) {
                parentR = 0;
                parentC = 0;
            }
            parentR = path_q[i][2]; 
            parentC = path_q[i][3];
        }
    }
    return path;
}

// when 'Okay!' is clicked. Where the magic all happens.
function run() {
    $('td').off();
    var finish =  solve();
    final_path = retrace(finish);
    document.getElementById("instructions").innerHTML = "&#8618; Please Wait until path is found!";
    $('#instructions').css('color', 'darkcyan');

    var i = 1;
    // call setInterval once. It will run itself repeatedly until the "E" is reached.
    var t = setInterval(doSequence, 200);

    function doSequence() {
        if ( i >= (final_path.length - 2)) {
            document.getElementById("instructions").innerHTML = "&#8618; Click <strong>'Clear'</strong> to reset.";
            $('#instructions').css('color', 'black');
            clearInterval(t);
        }
        $("#" + final_path[i][0] + "r" + "c" + final_path[i][1]).css('background-color', 'darkcyan');
        i++;
    }
}

