// Variable Creation

var weapons;
var columns = 3;

function startup() {
    console.log("startup");
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            weapons = data;
            createGrid();
        })
    document.body.style.backgroundImage = "url('bgIMG/" + Math.floor(Math.random() * 7 + 1) + ".jpg')";
}

// Called once upon initialization. Creates a grid of weapons based on data parameter. Initializes "weapons" variable for use in all other functions
function createGrid() {

    var row;
    var gridCells = weapons["weapons"].length;
    while (gridCells % columns != 0) gridCells += 1;

    for (let i = 0; i < gridCells; i++) {

        if (i % columns == 0) {
            row = document.createElement("div");
            row.classList.add("row");
        }
        const column = document.createElement("div");
        column.classList.add("column");

        var multiplier = 255 / columns;
        var red = (columns - ((i % columns) + 1)) * multiplier;
        var green = 0; //(Math.floor(i / columns) + 1) * 20;
        // multiplier*columns-Abs(red-blue)
        var blue = ((i % columns) + 1) * multiplier; // (red) * (green) / 20;
        if (((Math.floor((i + 1) / columns)) + ((i + 1) % columns)) % 2 == 0) var alpha = 0.4;
        else var alpha = 0.5;
        column.style.backgroundColor = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";

        if (weapons["weapons"][i]) {
            const par = document.createElement("p");
            par.id = "gridSquare" + i;

            const button = document.createElement("input");
            button.type = "button";
            button.onclick = function () { attack(i) };
            button.value = "Roll";


            var nameLabel = weapons["weapons"][i]["name"];
            const nameNode = document.createTextNode(nameLabel);

            var damageLabel = weapons["weapons"][i]["damage"]["count"] + "d" + weapons["weapons"][i]["damage"]["size"]
            if (weapons["weapons"][i]["bonus"] != 0) damageLabel += " + " + weapons["weapons"][i]["bonus"];
            const damageNode = document.createTextNode(damageLabel);

            row.appendChild(column);
            column.appendChild(par);
            column.appendChild(button);
            par.appendChild(nameNode);
            par.appendChild(document.createElement("br"));
            par.appendChild(damageNode)
        } else row.appendChild(column);

        if (i % columns == 0) {
            document.getElementById('grid').appendChild(row);
        }
    }
}

// Refreshes the labels of all weapons in the grid. Used to update after changes are made to modifiers
function refreshGrid() {
    document.getElementById("grid").remove();
    const grid = document.createElement("div");
    grid.classList.add("column");
    grid.id = "grid";

    document.getElementById("grid&feedback").prepend(grid);
    createGrid();
}

function roll(count, size) {
    var roll = 0;
    for (let i = 0; i < count; i++) {
        let addRoll = Math.floor((Math.random() * size) + 1);
        roll += addRoll;
    }
    return roll;
}

function changeText(element, text) {
    var element = document.getElementById(element);
    element.innerHTML = text;
}

//function addText(element, text) {
//    element = document.getElementById(element);
//    element.innerHTML += "<br>" + text;
//}


// Extends a parameter element with a paragraph of parameter text
function addText(element, text) {
    const para = document.createElement("p");
    const node = document.createTextNode(text);
    para.appendChild(node);

    element = document.getElementById(element);
    element.appendChild(para);
}

// Displays a string parameter to the output/feedback box
function output(text) {
    addText('feedback', text);
}

// Performs an attack for a given parameter weapon in the form of an index to a "weapon" from the data.json file
function attack(weapon) {
    var count = weapons["weapons"][weapon]["damage"]["count"];
    var size = weapons["weapons"][weapon]["damage"]["size"];
    var ac = document.getElementById("AC").value;
    var critRule = document.getElementById("nat20").checked;
    var toHit = Math.floor((Math.random() * 20) + 1);
    //for testing
    console.log("to hit: " + toHit);
    var nat20 = false;
    var nat1 = false;
    var success;
    var damage;
    var mod = getMod(weapon);

    if (document.getElementById("disadvantageBox").checked) {
        var disadvantage = Math.floor((Math.random() * 20) + 1);
        if (disadvantage < toHit) toHit = disadvantage;
        //for testing
        console.log("disadvantage: " + disadvantage);
    } else if (document.getElementById("advantageBox").checked) {
        var advantage = Math.floor((Math.random() * 20) + 1);
        if (advantage > toHit) toHit = advantage;
        //for testing

        console.log("advantage: " + advantage);

    }
    console.log("final toHit: " + toHit);

    if (critRule) {
        if (toHit == 20) nat20 = true;
        else if (toHit == 1) nat1 = true;
        else toHit += mod;
    } else toHit += mod;

    if (!(isNaN(ac) || ac == "")) {
        if (critRule && nat20) success = true;
        else if (toHit >= ac) success = true;
        else success = false;
    }
    

    damage = roll(count, size) + mod;
    if (nat20) damage += roll(count, size);
    if (!(isNaN(toHit) || toHit == "") && !(isNaN(damage) || damage == "") && !(isNaN(ac) || ac == "")) {
        if (nat20 && critRule) output("You rolled a Natural 20!!!\nYou deal " + damage + " damage!");
        else if (nat1 && critRule) output("You rolled a Natural 1.\nLoser.");
        else if (success) output("You rolled a " + toHit + " which beats your enemy's " + ac + " Armor Class.\nYou deal " + damage + " damage!");
        else output("You rolled a " + toHit + " which misses your enemy's " + ac + " Armor Class.");
    } else if (!(isNaN(toHit) || toHit == "") && !(isNaN(damage) || damage == "")) {
        if (nat20 && critRule) output("You rolled a Natural 20!!!\nYou deal " + damage + " damage!");
        else if (nat1 && critRule) output("You rolled a Natural 1.\nLoser.");
        else output("You rolled a " + toHit + ". \nYou deal " + damage + " damage!");
    }
    
}

// Returns a weapons modifier based on whether the weapon is labeled to use strength, dexterity, or finesse
function getMod(weapon) {
    var modType = weapons["weapons"][weapon]["modifier"];
    var str = document.getElementById("str").value * 1;
    var dex = document.getElementById("dex").value * 1;
    var mod;

    if (modType == "strength") {
        if (isNaN(str)) {
            alert("You must enter a valid strength modifier!");
            return;
        } else mod = str;
    } else if (modType == "dexterity") {
        if (isNaN(dex)) {
            alert("You must enter a valid dexterity modifier!");
            return;
        } else mod = dex;
    } else if (modType == "finesse") {
        if (isNaN(str) && isNaN(dex)) {
            alert("You must enter a valid strength or dexterity modifier!");
            return;
        } else if (isNaN(str) || str == "") mod = dex;
        else if (isNaN(dex) || dex == "") mod = str;
        else if (str >= dex) mod = str;
        else if (dex > str) mod = dex;
        else {
            output("An error has occured (strength or dexterity score invalid)");
            return;
        }
    } else {
        output("An error has occured (modifier named identified)");
        return;
    }

    if (mod == "") mod = 0;
    return mod;
}

// Unchecks other boxes when a advantage setting is selected
function advantageChanged(setting) {
    if (setting == -1) document.getElementById("advantageBox").checked = false;
    else if (setting == 1) document.getElementById("disadvantageBox").checked = false;
}


// When the user scrolls down 20px from the top of the document, slide down the settings bar
//window.onscroll = function () { scrollFunction() };

//function scrollFunction() {
//    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//        document.getElementById("settingsBar").style.top = "0";
//    } else {
//        document.getElementById("settingsBar").style.top = "-50px";
//    }
//}


// Changes the number of columns in the weapon grid and refreshes the grid
function columnNumber(difference) {
    if (columns += difference > 0) {
        columns += difference;
        console.log("Grid columns changed by" + difference);
        refreshGrid();
    } else console.log("Could not change grid columns by" + difference);
}

function testFunction() {

}