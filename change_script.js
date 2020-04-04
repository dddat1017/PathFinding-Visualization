window.onload = function() {
    var choice = sessionStorage.getItem("choice");
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("choice");
        sessionStorage.removeItem("reloading");
        if (choice == "regular") {
            document.getElementById("reg").checked = true;
            var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = "bfs.js";
                s.innerHTML = null;
                s.id = "widget";
                document.getElementById("jsscript").innerHTML = "";
                document.getElementById("jsscript").appendChild(s);
        } else if (choice == "bidirectional") {
            document.getElementById("bi").checked = true;
            var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = "bidirectional_bfs.js";
                s.innerHTML = null;
                s.id = "widget";
                document.getElementById("jsscript").innerHTML = "";
                document.getElementById("jsscript").appendChild(s);
        }
    } else {
        if (document.getElementById("bi").checked == true) {
            var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = "bidirectional_bfs.js";
                s.innerHTML = null;
                s.id = "widget";
                document.getElementById("jsscript").innerHTML = "";
                document.getElementById("jsscript").appendChild(s);
        } else {
            document.getElementById("reg").checked == true
        }
    }
}

function reloadP(choice) {
    sessionStorage.setItem("choice", choice);
    sessionStorage.setItem("reloading", "true");
    document.location.reload(true);
}
