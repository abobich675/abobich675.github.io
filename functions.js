var weapons;

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
    var modType = weapons["weapons"][0]["modifier"];
    var str = document.getElementById("str").value;;
    var dex = document.getElementById("dex").value;;
    var count = weapons["weapons"][0]["damage"]["count"];
    var size = weapons["weapons"][0]["damage"]["size"];
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

    if (modType == "strength") {
        if (isNaN(str) || str == "") alert("You must enter a valid strength modifier!");
        else modType = str;
    } else if (modType == "dexterity") {
        if (isNaN(dex) || dex == "") alert("You must enter a valid dexterity modifier!");
        else mod = dex;
    } else if (modType == "finesse") {
        if (isNaN(str) || str == "" && isNaN(dex) || dex == "") alert("You must enter a valid strength or dexterity modifier!");
        else if (isNaN(str) || str == "") mod = dex;
        else if (isNaN(dex) || dex == "") mod = str;
        else if (str >= dex) mod = str;
        else if (dex > str) mod = dex;
        else output("An error has occured (strength or dexterity score invalid)");
    } else {
        output("An error has occured (modifier named identified)");
        return;
    }

    if (toHit == 20) nat20 = true;
    else if (toHit == 1) nat1 = true;
    else toHit += mod;

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
    var label = weapons["weapons"][0]["name"] + ": " + weapons["weapons"][0]["damage"]["count"] + "d" + weapons["weapons"][0]["damage"]["size"];
    if (weapons["weapons"][1]["bonus"] != 0) weapons += " + " + weapons["weapons"][1]["bonus"];
    changeText('r1c1', label);
}

function refreshGrid() {
    var label = weapons["weapons"][0]["name"] + ": " + weapons["weapons"][0]["damage"]["count"] + "d" + weapons["weapons"][0]["damage"]["size"];
    if (weapons["weapons"][1]["bonus"] != 0) weapons += " + " + weapons["weapons"][1]["bonus"];
    changeText('r1c1', label);
}