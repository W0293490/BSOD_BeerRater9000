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
        displayBasicDialog("About", "<span style='float: right;'><img src='Images/brLogo150.png'/></span>" + "By: Blue Screen of Death</p><p>Class: Rich Internet Applications" +
                                "</p><p>Created: March. 30nd 2017</p><p>Version 1.0.2");
    });

    $( "#header" ).click(function() {
        if(this.innerText == "Beer Reviews"){
            changeDiv();
        }
    });
    
    $( "#create-review" ).click(function() {
        var rating = "</br><p>Rating: </p><p class='rating'>" +
                     "<input type='radio' id='star5' name='rating' value='5' /><label for='star5' title='Rocks!'>5 stars</label>" +
                     "<input type='radio' id='star4' name='rating' value='4' /><label for='star4' title='Pretty good'>4 stars</label>" +
                     "<input type='radio' id='star3' name='rating' value='3' /><label for='star3' title='Meh'>3 stars</label>" +
                     "<input type='radio' id='star2' name='rating' value='2' /><label for='star2' title='Kinda bad'>2 stars</label>" +
                     "<input type='radio' id='star1' name='rating' value='1' /><label for='star1' title='Sucks big time'>1 star</label>" +
                     "</p>";
        $('<form><p>Enter Review:</p> <textarea type="text" id="review-body" class="w3-input w3-border" placeholder="Review..." required></textarea>' + rating + '<br></form>').dialog({
            modal: true,
            title: "Create Review",
            width: "50%",
            close: function () { 
                $(this).dialog('destroy').remove();
            },
            buttons: {
                'OK': function () {
                    var ratings = document.getElementsByClassName('rating')[0].childNodes;
                    for(var i = 0; i < ratings.length; i ++){
                        if(ratings[i].checked != undefined && ratings[i].checked == true){
                            var beerRating = ratings[i].value;
                            break;
                        }
                    }
                    var reviewText = document.getElementById("review-body").value;
                    if(beerRating != undefined && reviewText.length > 0){
                        $(this).dialog('close');
                        createReview(reviewText, beerRating);
                    }
                    else{
                        displayBasicDialog("Incomplete", "All fields need to be filled.");
                    }
                },
                'Cancel': function () {
                    $(this).dialog('close');
                }
            }
            });
    });
    getBeerTypes();
    getBeerReviews();
});
function createReview(reviewText, beerRating) {
    var currDate = new Date();
    var review = {
        reviewText: reviewText,
        reviewRating: beerRating,
        beerID: currentBeer.id,
        createdBy: currentUser.Username,
        createdAt: currDate.toDateString() + " " + currDate.toLocaleTimeString(),
        updatedAt: currDate.toDateString() + " " + currDate.toLocaleTimeString(),
    };

    $.ajax({
        url: "http://localhost:3000/beer-reviews",
        type: "POST",
        data: review,
        success: function(data){
            displayBasicDialog("Beer Review Created", "The new review has been created.");
            getBeerTypes();
            getBeerReviews(true);
        },
        error: function(){
            displayBasicDialog("Error", "Error creating the review.");
        }
    });
}

function displayReviews(){
    if(currentUser != "null" && currentUser != null){
        document.getElementById("create-review").style.display = "inline";
    }
    else{
        document.getElementById("create-review").style.display = "none";
    }
    document.getElementById("reviews").innerHTML = "";
   
   for(var i = 0; i < beerReviews.length; i++){


   if(beerReviews[i].beerID == currentBeer.id)
   {
        beerReviewToUse = beerReviews[i];
        var review = "<div class='w3-container w3-card-4 review'>";
        if(currentUser != null && currentUser.Username == beerReviews[i].createdBy){
            var beerReviewIDToDelete = beerReviewToUse.id;
            review += "<button class='w3-btn buttons beer-review-delete-button' value='"+beerReviewIDToDelete+"'>✖</button>";
        }
        review += "<h3 class='w3-text-yellow'>Created By: " + beerReviews[i].createdBy + "</h3>";
        review += "<h4 class='w3-text-yellow'>Review Body</h4>";
        review += "<p>" + beerReviews[i].reviewText + "</p>";
        review += "<h4 class='w3-text-yellow'>Rating: ";
        for(var x = 0; x < beerReviews[i].reviewRating; x++){
            review += "🍺 ";
        }
        review += "</h4>";
        if(currentUser != null && currentUser.Username == beerReviews[i].createdBy){
            review += "<h4 class='w3-text-yellow float-left'>Last Updated At: </h4><h4>"+ beerReviews[i].updatedAt  +"</h4>";
            review += "<button class='w3-btn buttons beer-review-edit-button' value='"+i+"')'>Edit</button>";
        }
        review += "</div>";
        document.getElementById("reviews").innerHTML += review;
   }

        $( ".beer-review-delete-button" ).click(function() {
            var beerID = this.value;
            $('<form><p>Are you sure you want to delete this review?</p></form>').dialog({
                modal: true,
                title: "Delete?",
                buttons: {
                    'OK': function () {
                        $(this).dialog('close');
                        $.ajax({
                            url: "http://localhost:3000/beer-reviews/" + beerID,
                            type: "DELETE",
                            success: function(data){
                                displayBasicDialog("Success", "Review has been deleted.");
                                getBeerReviews(true);
                                beerReviewToUse = null;
                            },
                            error: function(){
                                displayBasicDialog("Error", "Error deleting the review.");
                            }
                        });
                    },
                    'cancel': function(){
                        $(this).dialog('close');
                    }
                }
            });
        });

        $( ".beer-review-edit-button" ).click(function() {
            var beerReviewID = this.value;
            var beerReview;
            for(var i = 0; i < beerReviews.length; i++){
                if(beerReviewID == i){
                    beerReview = beerReviews[i];
                    break;
                }
            }
            var rating = "</br><p>Rating: </p><p class='rating'>" +
                     "<input type='radio' id='star5' name='rating' value='5' /><label for='star5' title='Rocks!'>5 stars</label>" +
                     "<input type='radio' id='star4' name='rating' value='4' /><label for='star4' title='Pretty good'>4 stars</label>" +
                     "<input type='radio' id='star3' name='rating' value='3' /><label for='star3' title='Meh'>3 stars</label>" +
                     "<input type='radio' id='star2' name='rating' value='2' /><label for='star2' title='Kinda bad'>2 stars</label>" +
                     "<input type='radio' id='star1' name='rating' value='1' /><label for='star1' title='Sucks big time'>1 star</label>" +
                     "</p>";
            $('<form><p>Enter Review:</p> <textarea type="text" id="review-body" class="w3-input w3-border" placeholder="Review..." required></textarea>' + rating + '<br></form>').dialog({
                modal: true,
                title: "Update Review",
                width: "50%",
                open: function() {
                    document.getElementById("review-body").value = beerReview.reviewText;
                },
                close: function () { 
                    $(this).dialog('destroy').remove();
                },
                buttons: {
                    'OK': function () {
                        var ratings = document.getElementsByClassName('rating')[0].childNodes;
                        for(var i = 0; i < ratings.length; i ++){
                            if(ratings[i].checked != undefined && ratings[i].checked == true){
                                var beerRating = ratings[i].value;
                                break;
                            }
                        }
                        var reviewText = document.getElementById("review-body").value;
                        if(beerRating != undefined && reviewText.length > 0){
                            $(this).dialog('close');
                            patchReview(beerReview.id, reviewText, beerRating);
                        }
                        else{
                            displayBasicDialog("Incomplete", "All fields need to be filled.");
                        }
                    },
                    'Cancel': function () {
                        $(this).dialog('close');
                    }
                }
            });
        });
    }
}

function patchReview(beerReviewID, reviewText, beerRating){
    var currDate = new Date();
    var updatedReview = {
        reviewText: reviewText,
        reviewRating: beerRating,
        updatedAt: currDate.toDateString() + " " + currDate.toLocaleTimeString(),
    };

    $.ajax({
        url: "http://localhost:3000/beer-reviews/" + beerReviewID,
        type: "Patch",
        data: updatedReview,
        success: function(data){
            displayBasicDialog("Success", "Beer review updated.");
            getBeerReviews(true);
            beerReviewToUse = null;
        },
        error: function(){
            displayBasicDialog("Error", "Error updating beer review.");
        }
    });
}
function getBeerReviews(display){
    beerReviews = [];

    $.ajax({
        url: "http://localhost:3000/beer-reviews",
        type: "GET",
        success: function(data){
            for(var i = 0; i < data.length; i++){
                beerReviews[i] = data[i];
            }
            if(display){
                displayReviews();
            }
        },
        error: function(){
            displayBasicDialog("Error", "Error getting beer reviews.");
            return;
        }
    });
}




function changeDiv(divName) {
    document.getElementById("beer-reviews").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";

    if(divName == null) {
        divName = "beer-reviews";
        document.getElementById("header").innerHTML = "Current Beer";
        document.getElementById("reviews").innerHTML = "";
        var ul = document.getElementById("list");
        var items = ul.getElementsByTagName("li");
        for(var i = 0; i < items.length; i ++)
        {
            items[i].classList.remove("active");
        }
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

function getBeerTypeMenuItems(){
    var displayType;
    if(currentUser.isAdmin == "true"){
        displayType = "inline";
    }
    else{
        displayType = "none";
    }
    var adminItems = document.getElementsByClassName("beer-type-menu-items");
    for(var i = 0; i < adminItems.length; i ++){
        adminItems[i].style.display = displayType;
    }
}

function filter() {
    // Declare variables
    var input, filter, item, ul, li, i;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById("list");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        item = li[i];
        if (item.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}