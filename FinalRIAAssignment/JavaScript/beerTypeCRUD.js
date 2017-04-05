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

    if(currentUser != "null" && currentUser != null){
        document.getElementById("create-review").style.display = "inline";
    }
    else{
        document.getElementById("create-review").style.display = "none";
    }
}

function getBeerTypes(){
    beerTypes = [];
    var numOfBeers = 0;
    var list = $("#list");
    list.empty();

    $.ajax({
        url: "http://localhost:3000/Beer-Types",
        type: "GET",
        success: function(data){
            for(var i = 0; i < data.length; i ++){
                if(data[i].isActive == "true"){
                    beerTypes[numOfBeers] = data[i];
                    list.append("<li class='beer-type' value='" + beerTypes[numOfBeers].id + "'>" + beerTypes[numOfBeers].name + "</li>");
                    numOfBeers ++;
                }
            }
            getBeerTypeMenuItems();

            $(".beer-type").click(function(){
                document.getElementsByClassName("navbar-brand")[0].innerText = this.innerHTML;
                var ul = document.getElementById("list");
                var items = ul.getElementsByTagName("li");
                var selectedIndex = $(this).val();
                for(var i = 0; i < items.length; i ++)
                {
                    if(items[i].value != selectedIndex)
                    {
                        items[i].classList.remove("active");
                    }
                    else{
                        currentBeer = beerTypes[i];
                        items[i].classList.add("active");
                    }
                }
            });

        },
        error: function(){
            displayBasicDialog("Error", "Error getting beer types.");
            return;
        }
    });
}

$( document ).ready(function() {
    $( "#create-beer-menu-item" ).click(function() {
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
                        displayBasicDialog("Invalid name", "Sorry, that is not a valid name.");
                    }
                },
                'Cancel': function () {
                    $(this).dialog('close');
                }
            }
        });
    });

    $( "#update-beer-menu-item" ).click(function() {
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
    });
    $( "#delete-beer-menu-item" ).click(function() {
        var dialog = "<form><label>Beer To Delete:</label> <select id='beerToDelete'>";
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
    });
});


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
                displayBasicDialog("Beer Type Created", "The new beer type has been created.");
                getBeerTypes();
            },
            error: function(){
                displayBasicDialog("Error", "Error adding new beer type.");
            }
        });
    }
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
                displayBasicDialog("Success", "Beer type updated.");
                getBeerTypes();
            },
            error: function(){
                displayBasicDialog("Error", "Error updating beer type.");
            }
        });
    }
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
            displayBasicDialog("Success", "Beer type deleted.");
            getBeerTypes();
        },
        error: function(){
            displayBasicDialog("Error", "Error deleting beer type.");
        }
    });
}