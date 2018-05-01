<?php
    //  PROJECT:        BeerBuddy
    //  Name:           Rolando Javier
    //  File:           readRating.php
    //  Date Created:   April 26, 2018
    //  Last Modified:  April 26, 2018
    //  Details:
    //                  This file handles all front end POST requests that read rating data from the database.
    //  Dependencies:
    //                  PHP
    //                  MySQL
    //                  Apache Web Server

    require "utility.php";

    // Acquire POST request body parameters
    $action = $_POST['action'];
    $data = $_POST['data'];
    $credentials = [
        "user" => "root",
        "pwd" => "root"
    ];
    $response = [
        "status" => "success",
        "message" => "OK"
    ];

    // I'll disallow GET requests to this file for now
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        if ($_GET['action'] === "getpwd") {
            $plaintextPassword = $_GET['pwd'];
            $response = formatResponse("success", hash("sha256", $plaintextPassword));
        } else {
            $response = formatResponse("failure", "Method GET not permitted");
        }
    } else {
        processInput();
    }

    replyToClient($response);

    // @function    processInput
    // @parameter   n/a
    // @returns     n/a
    // @details     This function processes input from the client and responds based on the information given
    function processInput() {
        global $action, $response, $data, $credentials;  // force PHP to use the global variables

        // Instantiate a MySQL Connection
        $mysqli = new mysqli("localhost", $credentials["user"], $credentials["pwd"], "beerbuddy");
        if ($mysqli->connect_errno) {
            $response = formatResponse("failure", "MySQL connection failed: ($mysqli->connect_errno) $mysqli->connect_error");
        } else {
            // Perform requested action
            try {
                switch ($action) {
                    case "ping":
                        $response = formatResponse("success", "Hi!");
                        break;
                    case "search":
                        $searchTerm = $data['search'];
                        $searchType = $data['type'];
                        $result = -1;
                        $averages = -1;

                        // Check for valid search type
                        if ($searchType === "bar") {
                            $result = $mysqli->query("SELECT b.bar_name AS name, r.bar_id, r.username, r.stars FROM bar AS b INNER JOIN rate_bar AS r ON r.bar_id=b.bar_id AND b.bar_name LIKE '%$searchTerm%'");
                            $averages = $mysqli->query("SELECT b.bar_name as name, AVG(r.stars) AS avgrating FROM bar AS b INNER JOIN rate_bar AS r ON r.bar_id=b.bar_id AND b.bar_name LIKE '%$searchTerm%' GROUP BY b.bar_name");
                        } else if ($searchType === "drink") {
                            $result = $mysqli->query("SELECT r.username, r.name, r.stars, r.taste, b.bar_name FROM rate_drink AS r INNER JOIN bar AS b ON r.bar_id=b.bar_id AND r.name LIKE '%$searchTerm%'");
                            $averages = $mysqli->query("SELECT r.name, b.bar_name, AVG(r.stars) AS avgrating FROM rate_drink AS r INNER JOIN bar AS b ON r.bar_id=b.bar_id AND r.name LIKE '%$searchTerm%' GROUP BY r.name, b.bar_name");
                        }

                        // Package the data
                        if ($result === -1) {
                            $response = formatResponse("failure", "Invalid search type $searchType");
                        } else if ($averages === -1) {
                            $response = formatResponse("failure", "Unable to compute averages for search type $searchType");
                        } else {
                            $dataSet = [];
                            $avgSet = [];

                            // fill result data set
                            while ($row = $result->fetch_assoc()) {
                                $dataSet[] = $row;
                            }

                            // fill average data set
                            while ($avg = $averages->fetch_assoc()) {
                                $avgSet[] = $avg;
                            }

                            $response = formatResponse("success", ["ratings" => $dataSet, "averages" => $avgSet]);
                        }
                        break;
                    default:
                        $response = formatResponse("failure","Invalid action '$action'");
                        break;
                }
            } catch (Exception $e) {
                $response = formatResponse("failure", "An error occurred: $e");
            }
        }

        // Close instance
        mysqli_close($mysqli);
        return;
    }


    // END readRating.php
?>