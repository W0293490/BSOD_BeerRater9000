$( document ).ready(function() {
    $( "#register-user-button" ).click(function() {
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
                            displayBasicDialog("Registered", "You have successfully registered.");
                            currentUser = newUser;
                            localStorage.setItem("user", JSON.stringify(currentUser));
                            setLoggedOutClasses(false);
                            setUserInfo();
                            changeDiv();
                            document.getElementById("username-register").value = "";
                            password = document.getElementById("password-register").value = "";
                            email = document.getElementById("password-email").value = "";
                            error.innerHTML = "";
                            getBeerTypeMenuItems();
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
    });

    $( "#sign-in-user-button" ).click(function() {
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
                        getBeerTypeMenuItems();
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
    });

    $( "#logout-menu-item" ).click(function() {
        currentUser = null;
        localStorage.setItem("user", null);
        document.getElementById("user-info").style.display = "none";
        document.getElementById("user-name").innerHTML = "";
        setLoggedOutClasses(true);
        displayBasicDialog("Logged Out", "You have successfully logged out.");
    });
});

function setUserInfo(){
    document.getElementById("user-info").style.display = "inline";
    document.getElementById("user-name").innerHTML = currentUser.Username;
}
