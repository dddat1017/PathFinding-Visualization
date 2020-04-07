// Script for changing bfs scripts based on algorithm selection.

// Upon loading the page, usually by refreshing or loading the
// page for the first time.
window.onload = function() {
    var choice = sessionStorage.getItem("choice");
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        // Either "Regular" or "Bidirectional" was selected
        // before the reload. Make sure the selection is
        // displayed after the reload, and the right
        // script is being used (e.g. 'bfs.js' or
        // 'bidirectional_bfs.js').
        sessionStorage.removeItem("choice");
        sessionStorage.removeItem("reloading");
        if (choice == "regular") {
            document.getElementById("reg").checked = true;
            var s = document.createElement("script");
                s.src = "bfs.js";
                s.innerHTML = null;
                document.getElementById("jsscript").innerHTML = "";
                document.getElementById("jsscript").appendChild(s);
        } else if (choice == "bidirectional") {
            document.getElementById("bi").checked = true;
            var s = document.createElement("script");
                s.src = "bidirectional_bfs.js";
                s.innerHTML = null;
                document.getElementById("jsscript").innerHTML = "";
                document.getElementById("jsscript").appendChild(s);
        }
    } else {
        // Regular refresh or when 'Clear' is clicked.
        // If mode was in "Bidirectional", it will stay that way.
        // Otherwise, default to "Regular" mode.
        if (document.getElementById("bi").checked == true) {
            var s = document.createElement("script");
                s.src = "bidirectional_bfs.js";
                s.innerHTML = null;
                document.getElementById("jsscript").innerHTML = "";
                document.getElementById("jsscript").appendChild(s);
        } else {
            document.getElementById("reg").checked == true
        }
    }
}

// When "Regular" or "Bidirectional" is selected, store the selection
// in 'sessionStorage' before reloading the page.
function reloadP(choice) {
    sessionStorage.setItem("choice", choice);
    sessionStorage.setItem("reloading", "true");
    document.location.reload(true);
}
