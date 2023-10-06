var weapons;
var columns = 3;

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

function addText(element, text) {
    const para = document.createElement("p");
    const node = document.createTextNode(text);
    para.appendChild(node);

    element = document.getElementById(element);
    element.appendChild(para);
}


function output(text) {
    addText('feedback', text);
}


function weapon(dmg, mod) {
    var ac = document.getElementById("AC").value;
    var critRule = document.getElementById("nat20").checked;
    var toHit = Math.floor((Math.random() * 20) + 1)
    var nat20 = false;
    var nat1 = false;
    var success;
    var damage;

    if (isNaN(ac) || ac == "") {
        alert("You must enter a valid Armor Class!");
        return;
    }

    if (toHit == 20) nat20 = true;
    else if (toHit == 1) nat1 = true;
    else toHit += mod;

    if (critRule && nat20) success = true;
    else if (toHit >= ac) success = true;
    else success = false;

    damage = dmg + mod;
    if (nat20) damage += dmg;

    if (nat20 && critRule) output("You rolled a Natural 20!!!\nYou deal " + damage + " damage!");
    else if (nat1 && critRule) output("You rolled a Natural 1.\nLoser.");
    else if (success) output("You rolled a " + toHit + " which beats your enemy's " + ac + " Armor Class\nYou deal " + damage + " damage!");
    else output("You rolled a " + toHit + " which misses your enemy's " + ac + " Armor Class");
}

function attack(weapon) {
    var count = weapons["weapons"][weapon]["damage"]["count"];
    var size = weapons["weapons"][weapon]["damage"]["size"];
    var ac = document.getElementById("AC").value;
    var critRule = document.getElementById("nat20").checked;
    var toHit = Math.floor((Math.random() * 20) + 1)
    var nat20 = false;
    var nat1 = false;
    var success;
    var damage;
    var mod = getMod(weapon);

    if (isNaN(ac) || ac == "") {
        alert("You must enter a valid Armor Class!");
        return;
    }

    if (critRule) {
        if (toHit == 20) nat20 = true;
        else if (toHit == 1) nat1 = true;
        else toHit += mod;
    } else toHit += mod;

    if (critRule && nat20) success = true;
    else if (toHit >= ac) success = true;
    else success = false;

    damage = roll(count, size) + mod;
    if (nat20) damage += roll(count, size);

    if (nat20 && critRule) output("You rolled a Natural 20!!!\nYou deal " + damage + " damage!");
    else if (nat1 && critRule) output("You rolled a Natural 1.\nLoser.");
    else if (success) output("You rolled a " + toHit + " which beats your enemy's " + ac + " Armor Class\nYou deal " + damage + " damage!");
    else output("You rolled a " + toHit + " which misses your enemy's " + ac + " Armor Class");
}

function greatsword(mod) {
    var ac = document.getElementById("AC").value;
    if (isNaN(ac) || ac == "") {
        alert("You must enter a valid Armor Class!");
        return;
    }
    var toHit = Math.floor((Math.random() * 20) + 1) + mod;
    if (toHit >= ac) {
        var success = true;
    } else var success = false;

    var damage = roll(2,6) + mod;

    if (success) {
        output("You rolled a " + toHit + " which beats your enemy's " + ac + " Armor Class\nYou deal " + damage + " damage!");
    } else { output("You rolled a " + toHit + " which misses your enemy's " + ac + " Armor Class"); }
}

function createGrid(data) {
    weapons = data;
    //for (let i = 0; i < weapons["weapons"].length; i++) {
    //    var position = "r" + (Math.floor(i / columns) + 1) + "c" + ((i + 1) % columns);
    //    console.log(position);
    //    var label = weapons["weapons"][i]["name"] + ": " + weapons["weapons"][i]["damage"]["count"] + "d" + weapons["weapons"][i]["damage"]["size"];
    //    if (weapons["weapons"][i]["bonus"] != 0) label += " + " + weapons["weapons"][i]["bonus"];
    //    changeText(position, label);
    //}
    //var label = weapons["weapons"][0]["name"] + ": " + weapons["weapons"][0]["damage"]["count"] + "d" + weapons["weapons"][0]["damage"]["size"];
    //if (weapons["weapons"][0]["bonus"] != 0) label += " + " + weapons["weapons"][0]["bonus"];
    //changeText(position, label);

    var row;

    for (let i = 0; i < weapons["weapons"].length; i++) {

        if (i % columns == 0) {
            row = document.createElement("div");
            row.classList.add("row");
        }
        const column = document.createElement("div");
        column.classList.add("column");
        column.style.backgroundColor = "rgba(0,0,0," + (((i % columns) + 1) * Math.floor(i / columns + 1) + 2) / 50 + ")";
        column.style.verticalAlign = "middle";
        column.onclick = "attack(" + i + ")";

        const par = document.createElement("p");
        par.id = "gridSquare" + i;

        const button = document.createElement("input");
        button.type = "button";
        button.onclick = "output(1)";


        var label = weapons["weapons"][i]["name"] + ": " + weapons["weapons"][i]["damage"]["count"] + "d" + weapons["weapons"][i]["damage"]["size"];
        if (weapons["weapons"][i]["bonus"] != 0) label += " + " + weapons["weapons"][i]["bonus"];
        const node = document.createTextNode(label);

        row.appendChild(column);
        column.appendChild(par);
        par.appendChild(node);

        column.appendChild(button);

        if (i % columns == 0 || i + 1 == weapons["weapons"].length) {
            document.getElementById('grid').appendChild(row);
        }
    }
}

function refreshGrid() {
    var label = weapons["weapons"][0]["name"] + ": " + weapons["weapons"][0]["damage"]["count"] + "d" + weapons["weapons"][0]["damage"]["size"];
    var mod = getMod(0);

    if (isNaN(mod) || mod == "") {
        if (weapons["weapons"][0]["bonus"] != 0) label += " + " + weapons["weapons"][0]["bonus"];
    } else {
        if (weapons["weapons"][0]["bonus"] != 0) mod += weapons["weapons"][0]["bonus"];
        label += " + " + mod;
    }
    changeText('r1c1', label);
}

function getMod(weapon) {
    var modType = weapons["weapons"][weapon]["modifier"];
    var str = document.getElementById("str").value * 1;
    var dex = document.getElementById("dex").value * 1;
    var mod;

    if (modType == "strength") {
        if (isNaN(str) || str == "") {
            alert("You must enter a valid strength modifier!");
            return;
        } else mod = str;
    } else if (modType == "dexterity") {
        if (isNaN(dex) || dex == "") {
            alert("You must enter a valid dexterity modifier!");
            return;
        } else mod = dex;
    } else if (modType == "finesse") {
        if (isNaN(str) || str == "" && isNaN(dex) || dex == "") {
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
    return mod;
}

function testFunction() {
}