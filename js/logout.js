$(document).ready(init);

var hostname = "localhost";

function init()
{
	$("#submit2").on("click", logout);
}

function logout() 
{
	console.log("logging out");
	post(`http://${hostname}/beerbuddy/backend/logout.php`, "ajax", null, true);
	// window.location = `http://${hostname}/beerbuddy/`;
	// $.get("backend/logout.php");
}

function empty()
{

}