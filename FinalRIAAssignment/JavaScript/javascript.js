if (typeof(Storage) !== "undefined") {
    var currentUser = localStorage.getItem("user");
} else {
    var currentUser = null;
}
$( document ).ready(function() {
    if(currentUser != "null" && currentUser != null){
        currentUser = JSON.parse(currentUser);
        setUserInfo();
    }
});

function changeDiv(divName) {
    document.getElementById("beer-reviews").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";

    if(divName == null) {
        divName = "beer-reviews";
        document.getElementById("header").innerHTML = "Current Beer";
    }
    else{
        document.getElementById("header").innerHTML = "Beer Reviews";
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
    password = password.value;
    if(password.length < 6){
        error.innerHTML = "ERROR: Password Field - Must be greater than 5 characters";
        return;
    }

    if (!email.checkValidity()) {
        error.innerHTML = "ERROR: Email Field - " + email.validationMessage;
        return;
    }
    username = username.value;
    email = email.value;


    var newUser = {
    Username: username,
    password: password,
    email: email,
    isAdmin: false
    }

    $.ajax({
        url: "http://localhost:3000/Users",
        type: "POST",
        data: newUser,
        success: function(data){
            currentUser = newUser;
            localStorage.setItem("user", JSON.stringify(currentUser));
            setUserInfo();
            changeDiv();
        },
        error: function(){
            error.innerHTML = "Error registering user.";
            return;
        }
    });
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
    
    $.ajax({
        url: "http://localhost:3000/Users",
        type: "GET",
        success: function(data){
            console.log(data);

            for( var i = 0; i < data.length; i ++){
                if(username == data[i].Username && password == data[i].password){
                    currentUser = data[i];
                    localStorage.setItem("user", JSON.stringify(currentUser));
                    setUserInfo();
                    changeDiv();
                }
            }
            if(currentUser == null || currentUser == "null"){
                error.innerHTML = "ERROR: Username or Password is incorrect.";
                return;
            }
        },
        error: function(){
            error.innerHTML = "Error Logging in.";
            return;
        }
    });
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


function setUserInfo(){
    document.getElementById("user-info").style.display = "inline";
    document.getElementById("user-name").innerHTML = currentUser.Username;
}

function logout(){
    currentUser = null;
    localStorage.setItem("user", null);
    document.getElementById("user-info").style.display = "none";
    document.getElementById("user-name").innerHTML = "";
}