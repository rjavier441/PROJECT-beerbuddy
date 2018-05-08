//
//  PROJECT:        BeerBuddy
//  Name:           Varinder Singh
//  File:           ratingsPage.js
//  Date Created:   April 30, 2018
//  Last Modified:  April 30, 2018
//  Details:
//                  This file contains javascript code that runs the ratingsPage.html UI
//  Dependencies:
//                  JS ECMAscript 6
//                  utility.js

// Model
var hostname = "localhost";
var model = {
    "searchType": "drink"
};

$(document).ready(function () {
    // Start page with initial values
    init();

    $('head').append('<style>.outlineElement{background-color:Yellow;} </style>');          

    $(".highlightable")
    .mouseover(function(event) {
    $(event.target).addClass('outlineElement');
    })
    .mouseout(function(event) {
    $(event.target).removeClass('outlineElement');
    });    

    //adding state bar to intialization 
    var state= "bar"; 

    //hide the bar inputs
    $("#drink_inputs").addClass("hidden");
    //show the drink inputs
    $("#bar_inputs").removeClass("hidden");

    //

    //Bind submission to submit button
    $("#submitInfo").on("click", function(){
        var searchDrink = $("#searchDrink").val();
        var searchBarForDrink = $("#searchBarForDrink").val();
        var describeDrink = $("#describeDrink").val();
        var rateDrink = $("#rateDrink").val();
        var searchBar = $("#searchBar").val();
        var rateBar = $("#rateBar").val();


        if(state=="drink")console.log(`${searchDrink} ${searchBarForDrink} ${describeDrink} ${rateDrink}`);
        else if(state=="bar")console.log(`${searchBar} ${rateBar}`);

        //function submitRating (searchBar, rateBar, searchDrink, describeDrink, rateDrink, state) {
        submitRating(searchBar, rateBar, searchDrink, searchBarForDrink, describeDrink, rateDrink, state);


    });


    // Bind mode changing to the click of the mode change button
    $('#changeMode').on("click", function(){
        if(state=="bar"){
            state="drink";
            //hide the bar inputs
            $("#bar_inputs").addClass("hidden");
            //show the drink inputs
            $("#drink_inputs").removeClass("hidden");

        }
        else if(state=="drink"){
            state="bar";  
            //hide drink inputs
            $("#drink_inputs").addClass("hidden");
            //show bar inputs 
            $("#bar_inputs").removeClass("hidden");

        }

        console.log(`${state}`);
    });

    // Bind logout to the logout button
    $("#logout").on("click", function () {
        var data = {
            // nothing
        };
        var callback = function (reply, status, jqxhr) {
            try {
                reply = JSON.parse(reply);
                switch (status) {
                    case "success": {
                        var redirect = reply.message.redirect;
                        window.location = redirect;
                        break;
                    }
                    default: {
                        console.log("Yo. fix me.");
                        break;
                    }
                }
            } catch (e) {
                console.log("Darnit");
            }
        };
        var url = `http://${hostname}/beerbuddy/backend/logout.php`;

        post(url, data, callback, true);
    });
});

/*function init() {
    $("#searchType").html(model.searchType);
}*/

function init() {
    $("#searchType").html(model.searchType);
    getCurrentUser();
}

// Controllers
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
    @function   submitRating
    @parameter  searchBar - submit current search request for a bar title 
    @parameter  rateBar - submit a numerical value assosiated with a bar (1-5 stars)  
    @parameter  searchDrink - submit current search request for a drink title
    @parameter  describeDrink - submit drink description
    @parameter  rateDrink - sumbit a numerical value assoiated with a drink (1-5 stars)
    @parameter  state - switches between bar and drink 
    @returns    n/a
    @details    This function submits a drink or bar search
*/
function submitRating (searchBar, rateBar, searchDrink, searchBarForDrink, describeDrink, rateDrink, state) {
    var username = $("#username").html();

    var data = {
        "btitle": searchBar,
        "brating": Number.parseInt(rateBar),
        "dtitle": searchDrink,
        "btitleford": searchBarForDrink,
        "ddescription": describeDrink,
        "drating": Number.parseInt(rateDrink),
        "state": state,
        "username": username
    };

    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${reply}`);  // debug
    };

    //reply will be echo
    post(`http://${hostname}/beerbuddy/backend/rateDrinknBar.php`,data,callback, true); 

}

// @function    getCurrentUser
// @returns     n/a
// @details     This function acquires the session's associated username and populates any relevant UI elements with this information.
function getCurrentUser () {
    var data = {
        "action": "getInfo",
        "data": ""
    };
    var url = `http://${hostname}/beerbuddy/backend/readRating.php`;
    var callback = function (reply, status, jqxhr) {
        console.log(reply);
        try {
            reply = JSON.parse(reply);
            switch (status) {
                case "success": {
                    var currentUser = reply.message.username;
                    $("#username").html(currentUser);
                    break;
                }
                default: {
                    console.log("Please fix this issue");
                    break;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    post(url, data, callback, true);
}

function submitNewRating () {
    var data = {
        "name": $("#newdrinkname").val(),
        "stars": Number.parseInt($("#newdrinkstars").val()),
        "bar_name": $("#newdrinkbar").val(),
        "taste": $("#newdrinktaste").val(),
        "username": $("#username").html(),
        "action": "newRating"
    };
    var callback = function (reply, status, jqxhr) {
        try {
            reply = JSON.parse(reply);
            switch (status) {
                case "success": {
                    console.log(reply);
                    break;
                }
                default: {
                    console.log("Error!");
                    break;
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
    var url = `http://${hostname}/beerbuddy/backend/rateDrinknBar.php`;

    post(url, data, callback, true);
}
// END ratingsPage.js