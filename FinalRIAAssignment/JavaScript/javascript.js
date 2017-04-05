if (typeof(Storage) !== "undefined") {
    currentUser = localStorage.getItem("user");
} else {
    currentUser = null;
}
$( document ).ready(function() {
    if(currentUser != "null" && currentUser != null){
        currentUser = JSON.parse(currentUser);
        setUserInfo();
        setLoggedOutClasses(false);
    }

    $( "#about" ).click(function() {
        displayBasicDialog("About", "By: Blue Screen of Death</p><p>Class: Rich Internet Applications" +
                                "</p><p>Created: March. 30nd 2017</p><p>Version 1.0.2");
    });
    
    $( "#header" ).click(function() {
        if(this.innerText == "Beer Reviews"){
            changeDiv();
        }
    });

    $( "#create-review" ).click(function() {
        $('<form><p>Enter Review:</p> <textarea type="text" id="post-body" name="post-body" class="w3-input w3-border" placeholder="Post Body..." required></textarea><br></form>').dialog({
        modal: true,
        title: "Create Review",
        width: "50%",
        buttons: {
            'OK': function () {
            },
            'Cancel': function () {
                $(this).dialog('close');
            }
        }
    });
    });
    getBeerTypes();
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

function displayBasicDialog(dialogTitle, dialogBody){
    $('<form><p>' + dialogBody + '</p></form>').dialog({
        modal: true,
        title: dialogTitle,
        buttons: {
            'OK': function () {
                $(this).dialog('close');
            }
        }
    });
}

function setLoggedOutClasses(isLoggedOut){
    var displayType = "none";
    if(isLoggedOut){
        displayType = "inline";
    }
    var loggedOutMenuItems = document.getElementsByClassName("logged-out-menu-items");
    for(var i = 0; i < loggedOutMenuItems.length; i ++){
        loggedOutMenuItems[i].style.display = displayType;
    }
}

function validateEmail(email) {
    var re = /^[a-zA-Z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-zA-Z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return re.test(email);
}

function checkIfBeerTaken(beerTypeName){
    var beerNameTaken = false;
    for(var i = 0; i < beerTypes.length; i ++){
        if(beerTypeName == beerTypes[i].name){
            displayBasicDialog("Beer Type Taken", "Sorry, Beer type already exists.");
            beerNameTaken = true;
        }
    }
    return beerNameTaken;
}

function addReview(){
    
}