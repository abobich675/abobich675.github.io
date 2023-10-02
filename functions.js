function roll(count, size) {
    var roll = 0;
    for (let i = 0; i < count; i++) {
        let addRoll = Math.floor((Math.random() * size) + 1);
        roll += addRoll;
    }
    return roll;
}

function changeText() {
    var element = document.getElementById("greatsword");
    element.innerHTML = "Hello World!";
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
    if (isNaN(ac) || ac == "") {
        alert("You must enter a valid Armor Class!");
        return;
    }
    var toHit = Math.floor((Math.random() * 20) + 1) + mod;
    if (toHit >= ac) {
        var success = true;
    } else { var success = false; }

    var damage = dmg + mod;

    if (success) {
        output("You rolled a " + toHit + " which beats your enemy's " + ac + " Armor Class\nYou deal " + damage + " damage!");
    } else { output("You rolled a " + toHit + " which misses your enemy's " + ac + " Armor Class"); }
}

function greatsword(mod) {

    changeText();
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