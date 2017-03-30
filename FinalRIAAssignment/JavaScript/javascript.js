function changeDiv(divName) {
    document.getElementById("beer-reviews").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";

    if(divName == null) {
        divName = "beer-reviews"
    }
    document.getElementById(divName).style.display = "inline";
}


function registerUser() {
    var username = document.getElementById("username-register");
    var password = document.getElementById("password-register");
    var email = document.getElementById("password-email");
    if (!username.checkValidity()) {
        error.innerHTML = "ERROR: Username Field - " + username.validationMessage;
        return;
    }
    if (!password.checkValidity()) {
        error.innerHTML = "ERROR: Password Field - " + password.validationMessage;
        return;
    }
    if (!email.checkValidity()) {
        error.innerHTML = "ERROR: Email Field - " + email.validationMessage;
        return;
    }
    username = username.value;
    password = password.value;
    email = email.value;

    changeDiv();
}

function signInUser() {
    var username = document.getElementById("username-login");
    var password = document.getElementById("password-login");
    if (!username.checkValidity()) {
        error.innerHTML = "ERROR: Username Field - " + username.validationMessage;
        return;
    }
    if (!password.checkValidity()) {
        error.innerHTML = "ERROR: Password Field - " + password.validationMessage;
        return;
    }
    username = username.value;
    password = password.value;
    
    changeDiv();
}



$(document).ready(function() {
    $( "#dialog" ).dialog({
        autoOpen: false,  
    });
    $( "#about" ).click(function() {
        document.getElementById("dialog").innerText 
            = "By: Blue Screen of Death\nClass: Rich Internet Applications" +
              "\nCreated: March. 30nd 2017 \nVersion 1.0.2";
        $( "#dialog" ).dialog( "open" );
    });
});