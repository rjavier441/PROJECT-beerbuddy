<?php
    //  PROJECT:        BeerBuddy
    //  Name:           Varinder Singh
    //  File:           rateDrinknBar.php
    //  Date Created:   April 30, 2018
    //  Last Modified:  April 30, 2018
    //  Details:
    //                  This file handles all front end POST requests that read rating data from the database.
    //  Dependencies:
    //                  PHP
    //                  MySQL
    //                  Apache Web Server

    require  "utility.php";
    require  "required/credentials.php";

    $action = $_POST['action'];

            // Acquire POST request body parameter

    $response = formatResponse("success", $data);

    $credentials = $_CREDENTIALS["db"];



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
        global $action, $state, $response, $data, $credentials;  // force PHP to use the global variables
        $state = $_POST['state'];
        $username = $_POST['username'];
        $data["searchBar"] = $_POST['btitle'];
        $rateBar = intval($_POST['brating']);
        $searchDrink = $_POST['dtitle'];
        $data["searchBarForDrink"] = $_POST['btitleford'];
        $describeDrink = $_POST['ddescription'];
        $rateDrink = intval($_POST['drating']);

        // Instantiate a MySQL Connection
        $mysqli = new mysqli($credentials["host"], $credentials["user"], $credentials["pwd"], $credentials["name"]);
        if ($mysqli->connect_errno) {
            $response = formatResponse("failure", "MySQL connection failed: ($mysqli->connect_errno) $mysqli->connect_error");
        } else {
            // Perform requested action
            try {
                switch ($state) {
                    case "bar":

                        //find bar_id if it excists $averages->fetch_assoc()
                        $excistingBar = $mysqli->query("SELECT bar_id FROM bar WHERE bar_name LIKE '%$searchBar%';");   
                        
                        if(mysqli_num_rows($excistingBar)>0){

                            $rowOfTable = $excistingBar->fetch_assoc();
                            $barID = $rowOfTable['bar_id'];

                            $response = formatResponse("failure", $_POST['temp']);

                            // Update the bars rating
                            // $newBRating = $mysqli->query("UPDATE rate_bar SET stars = 4 WHERE bar_id = 1 AND username='vsingh95';");
                            $newBRating = $mysqli->query("UPDATE rate_bar SET stars = $rateBar WHERE bar_id = $barID AND username = '$username';");
                            if ($newBRating === FALSE) {
                                // $emsg = $barID;
                                $emsg = mysqli_error($mysqli);
                                $equery = "UPDATE rate_bar SET stars = $rateBar WHERE bar_id = $barID AND username = '$username';";
                                $response = formatResponse("failure", "Failed to update database: $emsg \n $equery");
                            } else {
                                $response = formatResponse("success", "Update Successful");
                            }

                            // if($newBRating) $response = formatResponse("success", "Successful Update!");
                            // else{
                            //     $emsg = mysqli_error($mysqli);
                            //     $response = formatResponse("failure", "Update Failed: $emsg");
                            // }


                        }else if(mysqli_num_rows($excistingBar)==0){
                            //bar name doesn't exist
                            $response = formatResponse("failure", "Bar is incorrect or doesn't exist!");

                        }else{
                            //error
                            $response = formatResponse("failure", "Unexpected Error!");

                        }
                        break;

                    case "drink":
                        
                        //find bar_id if it excists
                        $excistingBarDrink = $mysqli->query("SELECT bar_id FROM bar WHERE bar_name LIKE '%$searchBarForDrink%'");   



                        //find drink_id if it excists
                        $excistingDrink = $mysqli->query("SELECT name FROM drink WHERE  name LIKE '%$searchDrink%'");   


                        //Drink excists and bar excists
                        if(mysqli_num_rows($excistingBarDrink)>0 && mysqli_num_rows($excistingDrink)>0){

                            $rowOfTable = $excistingBarDrink->fetch_assoc();
                            $excistingBarDrink = $rowOfTable['bar_id'];

                            $rowOfTable = $excistingDrink->fetch_assoc();
                            $excistingDrink = $rowOfTable['name'];

                            $newDRating= $mysqli->query("UPDATE rate_drink SET stars = $rateDrink WHERE bar_id = $excistingBarDrink AND username = '$username' AND name = '$excistingDrink'");

                            $newDDescription= $mysqli->query("UPDATE rate_drink SET taste = '$describeDrink' WHERE bar_id = $excistingBarDrink AND username = '$username' AND name = '$excistingDrink'");

                            if($newDRating) $response = formatResponse("success", "Successful Rating!");
                            else $response = formatResponse("failure", "Update Failed!");

                            if($newDDescription) $response = formatResponse("success", "Successful Description!");
                            else $response = formatResponse("failure", "Update Failed!");

                        } else {

                        }

                        break;

                    default:
                        //$response = formatResponse("success", "Bar!");

                        $response = formatResponse("failure","Invalid action '$action'");
                        break;
                }

                if ($action == "newRating") {
                    $drinkname = mysqli_real_escape_string($mysqli, $_POST['name']);
                    $stars = intval($_POST['stars']);
                    $bar_name = mysqli_real_escape_string($mysqli, $_POST['bar_name']);
                    $taste = mysqli_real_escape_string($mysqli, $_POST['taste']);
                    $username = mysqli_real_escape_string($mysqli, $_POST['username']);

                    $query = "SELECT bar_id FROM bar WHERE bar_name='$bar_name'";
                    $barID_Query = $mysqli->query($query);

                    $row = $barID_Query->fetch_assoc();
                    $barID = $row['bar_id'];

                    $insertion = "INSERT INTO rate_drink(username,name,bar_id,stars,taste) VALUES ('$username', '$drinkname', '$barID', '$stars', '$taste')";
                    if ($mysqli->query($insertion)) {
                        $response = formatResponse("success", "New rating submission successful");
                    } else {
                        $response = formatResponse("failure", "Failed to submit rating: $insertion");
                    }
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
