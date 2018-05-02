<?php
	//  PROJECT:        BeerBuddy
    //  Name:           Rolando Javier
    //  File:           credentials.php
    //  Date Created:   April 30, 2018
    //  Last Modified:  April 30, 2018
    //  Details:
    //                  This file serves as a centralized container for all credentials necessary for authenticated transactions (i.e. database connections)
    //  Dependencies:
    //                  PHP
    //                  MySQL
    //                  Apache Web Server

	$_CREDENTIALS = [
		"db" => [
			"name" => "beerbuddy",
			"user" => "root",
			"pwd" => "cwang1984",
			"host" => "127.0.0.1"
		]
	];
	// END credentials.php
?>