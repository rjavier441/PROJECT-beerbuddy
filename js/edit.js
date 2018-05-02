//	PROJECT: 		BeerBuddy
// 	Name: 			Rolando Javier
// 	File: 			index.js
// 	Date Created: 	April 24, 2018
// 	Last Modified: 	April 24, 2018
// 	Details:
// 					This file holds the javascript that controls the index.html homepage
// 	Dependencies:
// 					JQuery 3.x.x or higher
//					Bootstrap 3.x.x

/*
	@function 	init
	@parameter 	n/a
	@returns 	n/a
	@details 	This function initializes the page
*/


var buffer = {
	name : "None",
	content: 100,
	type: "None",
	calories: 200,
	price: 10 ,
	barid: 000
};

document.getElementById('Add').onclick = function() 
{
	buffer.name = document.getElementById('DrinkName').value ; 
	buffer.content = document.getElementById('content').value ; 
	buffer.type = document.getElementById('type').value ; 
	buffer.calories = document.getElementById('calories').value ; 
	buffer.price = document.getElementById('price').value ; 
	buffer.barid = document.getElementById('barid').value ; 
	console.log(buffer);
	add(buffer);
}

document.getElementById('Delete').onclick = function() 
{
	var drink = document.getElementById('DrinkDelete').value ; 
	var id =  document.getElementById('baridDelete').value ;
	deletes(drink,id);
}

document.getElementById('Edit').onclick = function() 
{
	var drink = document.getElementById('DrinkEdit').value ; 
	var id =  document.getElementById('baridEdit').value ;
	var value_edit = document.getElementById('ValueEdit').value;
	var value = document.getElementById('Value').value;
	edit(drink,id,value_edit,value);
}



function add(drink) 
{
	console.log("Test call");
	var data = 
	{
        "action": "add",
		"data" : {
			"name" : drink.name,
			"content" : drink.content,
			"type": drink.type,
			"calories": drink.calories,
			"price": drink.price ,
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
			"name" : drink,
			"barid" : id
		}
	}
    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply: ${reply}`);  // debug
        if (status === "failure") {
        }
    };
    post("http://localhost/beerbuddy/backend/edit.php", data, callback, true);
}

function edit(drink,id,edit_name,value) 
{
	console.log("edit call");
	var data = 
	{
        "action": "edit",
		"data" : { 
			"name" : drink,
			"barid" : id,
			"editvalue" : edit_name,
			"value" : value
		}
	}
    var callback = function (reply, status, jqxhr) {
        console.log(`Status: ${status}\nReply: ${reply}`);  // debug
        if (status === "failure") {
        }
    };
    post("http://localhost/beerbuddy/backend/edit.php", data, callback, true);
}
