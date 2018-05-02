<?php
require "utility.php";

session_start();

$username = $_SESSION['username'];

$msg = [
	"info" => "logged out $username",
	"redirect" => "http://localhost/beerbuddy"
];

$response = formatResponse("success", $msg);
replyToClient($response);
$_SESSION = array();

session_destroy();
?>