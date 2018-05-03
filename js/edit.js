//  PROJECT:        BeerBuddy
//  Name:           Rolando Javier
//  File:           index.js
//  Date Created:   April 24, 2018
//  Last Modified:  April 24, 2018
//  Details:
//                  This file holds the javascript that controls the index.html homepage
//  Dependencies:
//                  JQuery 3.x.x or higher
//                  Bootstrap 3.x.x

/*
    @function   init
    @parameter  n/a
    @returns    n/a
    @details    This function initializes the page
*/


var buffer = {
    name : "None",
    content: 100,
    type: "None",
    calories: 200,
    price: 10 ,
    barid: 0
};

var model = {
    "mode": "delete",
    "barList": [],
    "drinkList": [],
    "selectedBar": -1,
    "selectedBarFavoritesStats": [],
    "selectedBarServiceStats": []
};

$(document).ready(init);

function init () {
    // Bind logout action to logout button
    $("#logout").on("click", function (event) {
        console.log("logging out");
    });

    // Bind homepage redirect to the logout button
    $("#logout").on("click", function () {
        logout();
    });

    // Bind create drink to drink submission button
    $("#Add").on("click", function () {
        // Check for all fields
        setError("");
        var newdrink = {
            "name": $("#drinkName").val(),
            "type": $("#drinkType").val(),
            "calories": Number.parseInt($("#calories").val()),
            "content": Number.parseInt($("#alcoholContent").val()),
            "price": Number.parseInt($("#price").val()),
            "barid": model.selectedBar
        }

        if (newdrink.name === "") {
            setError("Please enter a name!");
        } else if (newdrink.type === "") {
            setError("Please enter a type!");
        } else if (Number.isNaN(newdrink.calories)) {
            setError("Please enter a valid calorie count!");
        } else if (Number.isNaN(newdrink.content)) {
            setError("Please enter a valid alcohol content!");
        } else if (Number.isNaN(newdrink.price)) {
            setError("Please enter a valid price!");
        } else if (Number.isNaN(newdrink.barid) || newdrink.barid < 0) {
            console.log(`Invalid bar id "${newdrink.barid}" (${typeof newdrink.barid})`);
            setError(`Please select a bar to assign this drink to`);
        } else {
            add(newdrink);
        }
    });

    // Get the client's user name
    getClientInfo();

    // Start in drink creator mode
    changeMode("create");
}

function hideAllPanels () {
    $("#createDrinkPanel").addClass("hidden");
    $("#editDrinkPanel").addClass("hidden");
    $("#deleteDrinkPanel").addClass("hidden");
    $("#barListPanel").addClass("hidden");
}

function renderUI () {
    hideAllPanels();
    switch (model.mode) {
        case "delete": {
            $("#deleteDrinkPanel").removeClass("hidden");
            $("#barListPanel").removeClass("hidden");
            getMyDrinks($(".barName").html(), model.selectedBar);
            break;
        }
        case "edit": {
            $("#editDrinkPanel").removeClass("hidden");
            $("#barListPanel").removeClass("hidden");
            getMyDrinks($(".barName").html(), model.selectedBar);
            break;
        }
        case "create": {
            $("#createDrinkPanel").removeClass("hidden");
            $("#barListPanel").removeClass("hidden");
            break;
        }
        default: {
            console.log(`Unrecognized mode ${model.mode}`);
            changeMode("delete");
            $("#deleteDrinkPanel").removeClass("hidden");
            $("#barListPanel").removeClass("hidden");
            break;
        }
    }
}

function changeMode (newmode) {
    model.mode = newmode;
    $("#modeName").html(newmode);
    renderUI();
}

function getBarStats () {
    var bar_id = model.selectedBar;
    var data = {
        "action": "getBarStats",
        "data": {
            "bar_id": bar_id
        }
    };
    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply (${typeof reply}): ${reply}`);    // debug

        try {
            reply = JSON.parse(reply);
            switch (status) {
                case "success": {
                    model.selectedBarFavoritesStats = reply.message["top3drinkavg"];
                    model.selectedBarServiceStats = reply.message.baravg;
                    renderStatsReport();
                    break;
                }
                default: {
                    console.log("Something went wrong");
                    setError("Bar stats request failed");
                    break;
                }
            }
        } catch (e) {
            console.log(e);
            setError("Invalid input format");
        }
    };
    post("http://localhost/beerbuddy/backend/edit.php", data, callback, true);
}

function setError (msg) {
    $("#error").html(msg);
}

function logout () {
    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply (${typeof reply}): ${reply}`);    // debug
        try {
            reply = JSON.parse(reply);
            switch (status) {
                case "error": {
                    var msg = `An error occurred`;
                    console.log(msg);
                    setError(msg);
                    break;
                }
                case "success": {
                    console.log(`Logout successful: ${reply.message}`);
                    setError(`Logout successful`);
                    window.location = reply.message.redirect;
                    break;
                }
                default: {
                    var msg = `An unknown status was received: "${status}"`;
                    console.log(msg);
                    setError(msg);
                    break;
                }
            }
        } catch (e) {
            console.log(e);
            setError(`Invalid reply format: ${e}`);
        }
    };

    // post("http://localhost/beerbuddy/backend/logout.php", {}, callback, true);
    var options = {
        "async": true,
        "method": "GET",
        "success": function (data, status, jqxhr) {
            if (callback) {
                callback(data, status, jqxhr);
            }
            logDebug("post()", "ajax request result", "success");
        },
        "error": function (jqxhr, status, err) {
            if (callback) {
                callback(err, status, jqxhr);
            }
            logDebug("post()", "ajax request result", `failure -> ${err}`);
        }
    };
    $.ajax("http://localhost/beerbuddy/backend/logout.php", options);
}

function getClientInfo () {
    var data = {
        "action": "getInfo",
        "data": ""
    };

    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply (${typeof reply}): ${reply}`);    // debug

        try {
            reply = JSON.parse(reply);
            switch (status) {
                case "error": {
                    console.log("A request error occurred");
                    setError("A request error occurred");
                    break;
                }
                case "success": {
                    var replyHasMessage = (typeof reply.message === "undefined") ? false : true;
                    var replyHasStatus = (typeof reply.status === "undefined") ? false : true;
                    var messageHasUsername = (!replyHasMessage) ? false : (typeof reply.message.username === "undefined") ? false : true;

                    if (replyHasStatus && messageHasUsername) {
                        console.log(`Welcome, ${reply.message.username}`);
                        $("#username").html(reply.message.username);

                        // Get bars
                        getMyBars(reply.message.username);
                    } else {
                        console.log(`Invalid reply`);
                        setError("Invalid reply");
                    }
                    break;
                }
                default: {
                    console.log("An unknown issue occurred");
                    setError("An unknown issue occurred");
                    break;
                }
            }
        } catch (e) {
            console.log(e);
            setError("Invalid response format");
        }
    };

    setError("");
    post("http://localhost/beerbuddy/backend/readRating.php", data, callback, true);
}

function add(drink) 
{
    console.log("Adding drink");
    var data = 
    {
        "action": "add",
        "data" : {
            "name" : drink.name,
            "content" : drink.content,
            "type": drink.type,
            "calories": drink.calories,
            "price": drink.price,
            "barid": drink.barid
        }
    }
    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply: ${reply}`);  // debug
        if (status === "failure") {
        }
    };
    post("http://localhost/beerbuddy/backend/edit.php", data, callback, true);
}

function deletes(drink,id) 
{
    console.log("delete call");
    var data = 
    {
        "action": "delete",
        "data" : { 
            "name" : unescape(drink),
            "barid" : id
        }
    }
    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply: ${reply}`);  // debug
        if (status === "success") {
            getMyDrinks($(".barName").html(), model.selectedBar);
        }
    };
    post("http://localhost/beerbuddy/backend/edit.php", data, callback, true);
}

function setBarName (name) {
    $(".barName").html(name);
}

function submitDrinkEdit() {
    var oldName = $("#drinkEditorDrink").html();
    var newName = $("#drinkNameEditor").val();
    var newType = $("#drinkTypeEditor").val();
    var newCalories = $("#caloriesEditor").val();
    var newAC = $("#alcoholContentEditor").val();
    var newPrice = $("#priceEditor").val();
    
    var data = {
        "action": "editDrink",
        "data": {
            "oldname": oldName,
            "newname": newName,
            "newtype": newType,
            "newcalories": newCalories,
            "newalcohol": newAC,
            "newprice": newPrice,
            "bar_id": model.selectedBar
        }
    };
    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply: ${reply}`);  // debug

        try {
            reply = JSON.parse(reply);
            switch (status) {
                case "success": {
                    console.log("Success");
                    clearEditorModal();
                    $("#drinkEditor").modal("hide");
                    break;
                }
                default: {
                    console.log(`Some error occurred`);
                    break;
                }
            }
        } catch (e) {
            console.log(e);
            setError("Invalid response format");
        }
    };
    post("http://localhost/beerbuddy/backend/edit.php", data, callback, true);
}

function setSelectedBar (bar_name, bar_id) {
    console.log("Setting bar name to " + unescape(bar_name));
    setBarName(unescape(bar_name));
    model.selectedBar = bar_id;
    getBarStats(bar_id);

    // Contextual actions
    switch (model.mode) {
        case "delete": {
            getMyDrinks(unescape(bar_name), bar_id);
            break;
        }
        case "edit": {
            // reload a list of drinks in that bar
            getMyDrinks(unescape(bar_name), bar_id);
            break;
        }
        case "create": {
            // do nothing
            break;
        }
        default: {
            break;
        }
    }
}

function openEditorModal (index) {
    var drink = model.drinkList[index];
    console.log(drink);

    $("#drinkEditorDrink").html(drink.name);
    $("#drinkNameEditor").val(drink.name);
    $("#drinkTypeEditor").val(drink.type);
    $("#caloriesEditor").val(drink.calories);
    $("#alcoholContentEditor").val(drink.alcohol_content);
    $("#priceEditor").val(drink.price);

    $("#drinkEditor").modal("show");
}

function clearEditorModal () {
    $("#drinkEditorDrink").html("");
    $("#drinkNameEditor").val("");
    $("#drinkTypeEditor").val("");
    $("#caloriesEditor").val("");
    $("#alcoholContentEditor").val("");
    $("#priceEditor").val("");
}

function renderDeletionList () {
    var td = "";

    for (var i = 0; i < model.drinkList.length; i++) {
        var drink = model.drinkList[i];
        td += `<button class="btn btn-danger" style="min-width:100%" onclick="deletes('${escape(drink.name)}', ${drink.bar_id})">`;
        td += `Delete ${drink.name}`;
        td += `</button>`;
    }

    $("#drinkDeletionList").html(td);
}

function renderDrinkList () {
    var td = "";

    for (var i = 0; i < model.drinkList.length; i++) {
        var drink = model.drinkList[i];
        td += `<button class="btn btn-primary" style="width:100%" onclick="openEditorModal(${i})">`;
        td += `Edit ${drink.name}`;
        td += `</button>`;
    }

    $("#drinksList").html(td);
}

function renderBarList () {
    var td = "";

    for (var i = 0; i < model.barList.length; i++) {
        var bar = model.barList[i];
        td += `<button class="btn btn-default" style="width:100%;" onclick="setSelectedBar('${escape(bar.bar_name)}', ${bar.bar_id} )">`;
        td += `<span>${bar.bar_name}</span>`;
        td += `</button>`;
    }

    $("#barList").html(td);
}

function renderStatsReport () {
    var td = "";

    td += "<div>";
    td += `<h3>Your bar's average rating: <span class="glyphicon glyphicon-star"></span>${model.selectedBarServiceStats[0].average}</h3>`;
    td += "</div>";

    td += "<div>";
    for (var i = 0; i < model.selectedBarFavoritesStats.length; i++) {
        var drink = model.selectedBarFavoritesStats[i];
        var classname = "label-danger";
        var position = "3rd";
        switch (i) {
            case 0: {
                classname = "label-warning";
                position = "1st";
                break;
            }
            case 1: {
                classname = "label-default";
                position = "2nd";
                break;
            }
        }
        td += `<h4><span class="label ${classname}">${position}</span> ${drink.name} <span class="glyphicon glyphicon-star"></span>${drink.average}</h4>`;
    }

    if (model.selectedBarFavoritesStats.length < 1) {
        td += `<h4>No available ratings</h4>`;
    }

    td += "</div>";

    $("#barStats").html(td);
}

function getMyDrinks (name, id) {
    console.log(`Getting a list of drinks offered at ${name}`);
    var data = {
        "action": "getDrinks",
        "data": {
            "bar_id": id
        }
    };
    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply: ${reply}`);  // debug
        setError("");

        try {
            reply = JSON.parse(reply);
            switch (status) {
                case "success": {
                    model.drinkList = reply.message;

                    // Contextual action
                    if (model.mode === "edit") {
                        renderDrinkList();
                    } else if (model.mode === "delete") {
                        renderDeletionList();
                    }
                    break;
                }
                default: {
                    console.log(`${status}`);
                    setError("An error occurred");
                    break;
                }
            }
        } catch (e) {
            console.log(e);
            setError("Invalid response format");
        }
    };
    post("http://localhost/beerbuddy/backend/edit.php", data, callback, true);
}

function getMyBars(username) {
    console.log(`Getting a list of ${username}'s bars`);
    var data = {
        "action": "getBars",
        "data": {
            "user": username
        }
    };
    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply: ${reply}`);  // debug
        setError("");

        try {
            reply = JSON.parse(reply);
            switch (status) {
                case "success":{
                    model.barList = reply.message;
                    renderBarList();
                    break;
                }
                default: {
                    setError("Some unknown error occurred...");
                    break;
                }
            }
        } catch (e) {
            console.log(e);
            setError("Invalid response format");
        }
    };
    post("http://localhost/beerbuddy/backend/edit.php", data, callback, true);
}
