// Dynamically creates screen option elements into UI 

import split from "./windowManager.js";

// Getting the parent table container
let table = document.getElementById("main_container");

// size of the clickable option bar in the UI
let optionWidth = 104;
let optionHeight = 41;

// different option sizes
let sizes = [[3, 7], [4, 6], [5, 5], [6, 4], [7, 3]];
let size_labels = ["3:7", "4:6", "5:5", "6:4", "7:3"]

for (let i = 0; i < sizes.length; i++) {
    var tr = document.createElement('tr');  

    var td = document.createElement('td');

    var label = document.createElement('p');
    label.setAttribute("class", "number-label");
    label.appendChild(document.createTextNode(size_labels[i]));
    td.appendChild(label);
    tr.appendChild(td);

    var td = document.createElement('td');

    for (let k = 0; k < 2; k++) {
        let sizeSplit = (10 / sizes[i][k]);
        let width = optionWidth / sizeSplit;


        // variable for the namespace 
        const svgns = "http://www.w3.org/2000/svg";

        // make a simple rectangle
        
        var svg = document.createElementNS(svgns, "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", optionHeight);
        svg.setAttribute("class", "rectangle");
    
        let newRect = document.createElementNS(svgns, "rect");

        newRect.setAttribute("width", width);
        newRect.setAttribute("height", optionHeight);        
        newRect.setAttribute("margin-right", "10px");
        newRect.setAttribute("class", "screen-name");

        // append the new rectangle to the svg
        svg.appendChild(newRect);

        function func() {
            if (k == 0) {
                split(sizes[i][k], "L");
            } else {
                split(sizes[i][k], "R");
            }
        }

        newRect.addEventListener("click", func);
        td.appendChild(svg);
    }

    tr.appendChild(td);
    table.appendChild(tr)
}