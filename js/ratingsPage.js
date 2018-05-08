//  PROJECT:        BeerBuddy
//  Name:           R. Javier
//  File:           ratingsPage.js
//  Date Created:   April 27, 2018
//  Last Modified:  April 27, 2018
//  Details:
//                  This file contains javascript code that runs the ratingsPage.html UI
//  Dependencies:
//                  JS ECMAscript 6
//                  utility.js

// Model
var hostname = "localhost";
var model = {
    "searchType": "bar",
    "searchResults": [],
    "averageResults": []
};

$(document).ready(function () {
    // Bind submission to submit button
    $("#submitSearch").on("click", function (event) {
        submitSearch($("#searchInput").val(), model.searchType);
    });

    // Bind homepage redirect to the logout button
    $("#logout").on("click", function () {
        logout();
    });

    // Start page with initial values
    init();
});

function init() {
    // Set search type to model default
    $("#searchType").html(model.searchType);

    // Set username to current user
    var currentUsername = "?";
    if (supportsStorage("sessionStorage")) {
        currentUsername = sessionStorage.getItem("username");
    }
    $("#username").html(currentUsername);

    // Get client's info
    getClientInfo();

    // Run an initial search
    $("#submitSearch").click();
}



// View
/*
    @function   renderRatings
    @parameter  n/a
    @returns    n/a
    @details    This function renders the ratings as UI elements
*/
function renderRatings () {
    // First, clear ratings feed
    $("#ratingFeed").html("");

    // Then, process results
    if (model.searchResults.length < 1) {
        $("#ratingFeed").html("<h3 style='font-style:italic;'>No results found...</h3>");
    } else {
        var ratingTemplate = "";
        for (var i = 0; i < model.searchResults.length; i++) {
            var starCnt = 0;
            var item = model.searchResults[i];
            ratingTemplate += `<div class="well">`;
            ratingTemplate += `<h4>${item.username}</h4>`;
            ratingTemplate += `<h5>${model.searchType}: <span>${item.name}</span></h5>`;
            if (model.searchType === "drink") {
                // also print out bar info of drinks
                ratingTemplate += `<h5>bar: <span>${item.bar_name}</span></h5>`;
            }
            ratingTemplate += `<div>`;

            // Represent the rating by filled in stars
            for (starCnt = 0; starCnt < item.stars; starCnt++) {
                ratingTemplate += `<span class="glyphicon glyphicon-star"></span>`;
            }

            // Leave the rest blank
            for (starCnt; starCnt < 5; starCnt++) {
                ratingTemplate += `<span class="glyphicon glyphicon-star-empty"></span>`;
            }
            ratingTemplate += `</div>`;
            ratingTemplate += `</div>`;
        }

        $("#ratingFeed").html(ratingTemplate);
    }
}

/*
    @function   renderAverages
    @parameter  n/a
    @parameter  n/a
    @details    This function renders UI elements for the averages pane on the right
*/
function renderAverages () {
    // First, clear average list
    $("#averageList").html("");

    // Then, process results
    if (model.averageResults.length < 1) {
        $("#averageList").html("<h3 style='font-style:italic;'>No results found...</h3>");
    } else {
        var avgTemplate = "";
        for (var i = 0; i < model.averageResults.length; i++) {
            var item = model.averageResults[i];
            avgTemplate += `<h5>`;
            avgTemplate += `<strong>${item.name}</strong> `;
            if (model.searchType === "drink") {
                avgTemplate += `@${item.bar_name} `;
            }
            avgTemplate += `<span class="glyphicon glyphicon-star"></span> ${item.avgrating}`;
            avgTemplate += `</h5>`;
        }

        $("#averageList").html(avgTemplate);
    }
}



// Controllers
/*
    @function   logout
*/
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

    // post(`http://${hostname}/beerbuddy/backend/logout.php`, {}, callback, true);
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
    $.ajax(`http://${hostname}/beerbuddy/backend/logout.php`, options);
}

/*
    @function   setSearchType
    @parameter  str - the value to set the search type as
    @returns    n/a
    @details    This function sets the search type by updating the model value and setting the UI to the new search type
*/
function setSearchType (str) {
    updateModel("searchType", str);
    $("#searchType").html(model.searchType);
}

/*
    @function   updateModel
    @parameter  key - the name of the key to update
    @parameter  value - the value to update with
    @returns    n/a
    @details    This function updates the model with new data, or creates a new value if it doesn't exist
*/
function updateModel (key, value) {
    model[key] = value;
}

/*
    @function   setError
    @parameter  msg - the error message to display
    @returns    n/a
    @details    This function displays an error message to the user
*/
function setError (msg) {
    $("#error").html(msg);
}

/*
    @function   getClientInfo
    @parameter  n/a
    @returns    a JSON object with the session data (i.e. the logged-in client's username)
    @details    This function is useful for pulling session data from the server
*/
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
    post(`http://${hostname}/beerbuddy/backend/readRating.php`, data, callback, true);
}

/*
    @function   submitSearch
    @parameter  search - a string to search for
    @parameter  type - a string determining what type of entry to search for
    @returns    n/a
    @details    This function submits a drink or bar search
*/
function submitSearch (search, type) {
    var data = {
        "action": "search",
        "data": {
            "type": type,
            "search": search
        }
    };

    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply (${typeof reply}): ${reply}`);  // debug
        
        // Do any conversion
        try {
            reply = JSON.parse(reply);
            switch (status) {
                case "error":{
                    setError("A search error occurred");
                    break;
                }
                case "success": {
                    var replyHasStatus = (typeof reply.status === "undefined") ? false : true;
                    var replyHasMessage = (typeof reply.message === "undefined") ? false : true;
                    var replyHasRatings = (!replyHasMessage) ? false : (typeof reply.message.ratings === "undefined") ? false : true;
                    var replyRatingsIsArray = (!replyHasRatings) ? false : Array.isArray(reply.message.ratings);
                    var replyHasAverages = (!replyHasMessage) ? false : (typeof reply.message.averages === "undefined") ? false : true;
                    var replyAveragesIsArray = (!replyHasAverages) ? false : Array.isArray(reply.message.averages);

                    if (replyHasStatus && replyHasRatings && replyRatingsIsArray && replyHasAverages && replyAveragesIsArray) {
                        // console.log(reply.status);  // debug
                        setError("");
                        model.searchResults = reply.message.ratings;
                        model.averageResults = reply.message.averages;
                        renderRatings();
                        renderAverages();
                    } else {
                        var invalidParts = "";
                        invalidParts += (!replyHasStatus) ? "status " : "";
                        invalidParts += (!replyHasRatings || !replyHasAverages || !replyRatingsIsArray || !replyAveragesIsArray) ? "message " : "";
                        setError(`Invalid reply parameters: ${invalidParts}`);
                    }
                    break;
                }
                default: {
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
    post(`http://${hostname}/beerbuddy/backend/readRating.php`, data, callback, true);
}

// END ratingsPage.js
