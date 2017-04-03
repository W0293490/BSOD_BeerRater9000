var Crypt = new Crypt();
var beerTypes;

if (typeof(Storage) !== "undefined") {
    var currentUser = localStorage.getItem("user");
} else {
    var currentUser = null;
}
$( document ).ready(function() {
    if(currentUser != "null" && currentUser != null){
        currentUser = JSON.parse(currentUser);
        setUserInfo();
        setLoggedOutClasses(false);
    }

    $( "#about" ).click(function() {
        $("<form><p>By: Blue Screen of Death</p><p>Class: Rich Internet Applications" +
              "</p><p>Created: March. 30nd 2017</p><p>Version 1.0.2</p></form>").dialog({
            modal: true,
            title: "About",
            buttons: {
                'OK': function () {
                    $(this).dialog('close');
                }
            }
        });
    });
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
    var usernameOrEmailTaken = false;
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
    if(!validateEmail(email)){
        error.innerHTML = "ERROR: Email Field - Invalid email format";
        return;
    }
	
    var register_password = password; // Get text from password field to variable, R1
    var hashed_register_password = Crypt.HASH.sha512(register_password); // Hash the password in a new variable, R2
    hashed_register_password = hashed_register_password.words.join(''); // Join the hash array to a string

    var newUser = {
    Username: username,
    password: hashed_register_password, // Write hashed pw to db, R2
    email: email,
    isAdmin: false
    }
	
	register_password = ""; // attempted fix 
	hashed_register_password = ""; // attempted fix

    $.ajax({
        url: "http://localhost:3000/Users",
        type: "GET",
        success: function(users){
            for( var i = 0; i < users.length; i ++){
                if(username == users[i].Username){
                    error.innerHTML = "ERROR: Username already taken.";
                    usernameOrEmailTaken = true;
                }
                else if(email == users[i].email){
                    error.innerHTML = "ERROR: Email already in use.";
                    usernameOrEmailTaken = true;
                }
            }

            if(!usernameOrEmailTaken){
                $.ajax({
                    url: "http://localhost:3000/Users",
                    type: "POST",
                    data: newUser,
                    success: function(data){
                        currentUser = newUser;
                        localStorage.setItem("user", JSON.stringify(currentUser));
                        setLoggedOutClasses(false);
                        setUserInfo();
                        changeDiv();
                        document.getElementById("username-register").value = "";
                        password = document.getElementById("password-register").value = "";
                        email = document.getElementById("password-email").value = "";
                        error.innerHTML = "";
                    },
                    error: function(){
                        error.innerHTML = "Error registering user.";
                        return;
                    }
                });
            }
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

    var loggingInPassword = password; // Get login password text, L1
    var hashLoginPassword = Crypt.HASH.sha512(loggingInPassword); // Hash the login password, L2
    hashLoginPassword = hashLoginPassword.words.join(''); // Join the hash array as string
    
    $.ajax({
        url: "http://localhost:3000/Users",
        type: "GET",
        success: function(data){
            for( var i = 0; i < data.length; i ++){
                if(username == data[i].Username && hashLoginPassword == data[i].password){
                    currentUser = data[i];
                    localStorage.setItem("user", JSON.stringify(currentUser));
                    setLoggedOutClasses(false);
                    setUserInfo();
                    changeDiv();
                    document.getElementById("username-login").value = "";
                    document.getElementById("password-login").value = "";
					loggingInPassword=""; // Attempted fix 
					hashLoginPassword=""; // Attempted fix 
                    error.innerHTML = "";
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

function setUserInfo(){
    document.getElementById("user-info").style.display = "inline";
    document.getElementById("user-name").innerHTML = currentUser.Username;
}

function logout(){
    currentUser = null;
    localStorage.setItem("user", null);
    document.getElementById("user-info").style.display = "none";
    document.getElementById("user-name").innerHTML = "";
    setLoggedOutClasses(true);
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


function getBeerTypes(){
    beerTypes = [];
    var numOfBeers = 0;
    $.ajax({
        url: "http://localhost:3000/Beer-Types",
        type: "GET",
        success: function(data){
            for(var i = 0; i < data.length; i ++){
                if(data[i].isActive == "true"){
                    beerTypes[numOfBeers] = data[i];
                    numOfBeers ++;
                }
            }
        },
        error: function(){
            error.innerHTML = "Error getting beer types.";
            return;
        }
    });
}

function checkIfBeerTaken(beerTypeName){
    var beerNameTaken = false;
    for(var i = 0; i < beerTypes.length; i ++){
        if(beerTypeName == beerTypes[i].name){
                $('<form><p>Sorry, Beer type already exists.</p></form>').dialog({
                modal: true,
                title: "Beer Type Taken",
                buttons: {
                    'OK': function () {
                        $(this).dialog('close');
                    }
                }
            });
            beerNameTaken = true;
        }
    }
    return beerNameTaken;
}

function invalidBeerType(){
    $('<form><p>Sorry, that is not a valid name.</p></form>').dialog({
        modal: true,
        title: "Invalid name",
        buttons: {
            'OK': function () {
                getBeerTypes()
                $(this).dialog('close');
            }
        }
    });
}


function createBeerType(){
    $('<form><p>Enter Beer Name:</p> <input type="text" id="beer-type-name"><br></form>').dialog({
        modal: true,
        title: "Create Beer Type",
        buttons: {
            'OK': function () {
                var beerTypeName = $(this).find("#beer-type-name").val();
                $(this).dialog('close');
                if(beerTypeName.length > 0){
                    storeBeerType(beerTypeName);
                }
                else{
                    invalidBeerType();
                }
            },
            'Cancel': function () {
                $(this).dialog('close');
            }
        }
    });
}

function storeBeerType(beerTypeName){
    var beerNameTaken = checkIfBeerTaken(beerTypeName);

    if(!beerNameTaken){
        var currDate = new Date();
        var newBeerType = {
            name: beerTypeName,
            createdAt: currDate.toDateString() + " " + currDate.toLocaleTimeString(),
            isActive: true
        };

        $.ajax({
            url: "http://localhost:3000/Beer-Types",
            type: "POST",
            data: newBeerType,
            success: function(data){
                $('<form><p>The new beer type has been created.</p></form>').dialog({
                modal: true,
                title: "Beer Type Created",
                buttons: {
                    'OK': function () {
                        getBeerTypes()
                        $(this).dialog('close');
                    }
                }
            });
            },
            error: function(){
                $('<form><p>Error adding new beer type.</p></form>').dialog({
                    modal: true,
                    title: "Error",
                    buttons: {
                        'OK': function () {
                            getBeerTypes()
                            $(this).dialog('close');
                        }
                    }
                });
            }
        });
    }
}

function updateBeerType(){
    var dialog = "<form><label>Beer To Change:</label> <select id='beerToChange'>"
    for(var i = 0; i < beerTypes.length; i ++){
        dialog += "<option value='" + beerTypes[i].id + "'>" + beerTypes[i].name + "</option>";
    }
    dialog += "</select> <label>Enter new Name:</label> <input type='text' id='new-beer-type-name'></form>";

    $(dialog).dialog({
        modal: true,
        title: "Update Beer Type",
        buttons: {
            'OK': function () {
                var beerId = $(this).find("#beerToChange").val();
                var beerTypeName = $(this).find("#new-beer-type-name").val();
                $(this).dialog('close');
                if(beerTypeName.length > 0){
                    patchBeerType(beerId, beerTypeName);
                }
                else{
                    invalidBeerType();
                }
            },
            'Cancel': function () {
                $(this).dialog('close');
            }
        }
    });
}

function patchBeerType(beerId, beerTypeName){
    var beerNameTaken = checkIfBeerTaken(beerTypeName);

    if(!beerNameTaken){
        var updatedBeerType = {
            name: beerTypeName
        };
        $.ajax({
            url: "http://localhost:3000/Beer-Types/" + beerId,
            type: "Patch",
            data: updatedBeerType,
            success: function(data){
                $('<form><p>Beer type updated.</p></form>').dialog({
                    modal: true,
                    title: "Success",
                    buttons: {
                        'OK': function () {
                            getBeerTypes();
                            $(this).dialog('close');
                        }
                    }
                });
            },
            error: function(){
                $('<form><p>Error updating beer type.</p></form>').dialog({
                    modal: true,
                    title: "Error",
                    buttons: {
                        'OK': function () {
                            $(this).dialog('close');
                        }
                    }
                });
            }
        });
    }
}
function deleteBeerType(){
    var dialog = "<form><label>Beer To Delete:</label> <select id='beerToDelete'>"
    console.log(beerTypes);
    for(var i = 0; i < beerTypes.length; i ++){
        dialog += "<option value='" + beerTypes[i].id  + "'>" + beerTypes[i].name + "</option>";
    }
    dialog += "</select></form>";

    $(dialog).dialog({
        modal: true,
        title: "Delete Beer Type",
        buttons: {
            'OK': function () {
                var beerId = $(this).find("#beerToDelete").val();
                deleteBeer(beerId);
                $(this).dialog('close');
            },
            'Cancel': function () {
                $(this).dialog('close');
            }
        }
    });
}

function deleteBeer(beerId){
    var removedBeerType = {
            isActive: false
        };
    $.ajax({
        url: "http://localhost:3000/Beer-Types/" + beerId,
        type: "Patch",
        data: removedBeerType,
        success: function(data){
            $('<form><p>Beer type deleted.</p></form>').dialog({
                modal: true,
                title: "Success",
                buttons: {
                    'OK': function () {
                        getBeerTypes();
                        $(this).dialog('close');
                    }
                }
            });
        },
        error: function(){
            $('<form><p>Error deleting beer type.</p></form>').dialog({
                modal: true,
                title: "Error",
                buttons: {
                    'OK': function () {
                        $(this).dialog('close');
                    }
                }
            });
        }
    });
}
getBeerTypes();