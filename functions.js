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
    changeText('r1c1',data["weapons"][0]["name"]);
}