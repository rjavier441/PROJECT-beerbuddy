$(document).ready(init);

function init()
{
	$("#submit2").on("click", logout);
}

function logout() 
{
	console.log("logging out");
	post("http://localhost/beerbuddy/backend/logout.php", "ajax", null, true);
	// window.location = "http://localhost/beerbuddy/";
	// $.get("backend/logout.php");
}

function empty()
{

}