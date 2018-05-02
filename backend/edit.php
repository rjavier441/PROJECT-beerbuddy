<?php
    require "utility.php";
    // Acquire POST request body parameters
    $action = $_POST['action'];
    $data = $_POST['data'];
    $credentials = [
        "user" => "root",
        "pwd" => "mysql"
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
            try 
            {
                switch ($action) 
                {
                    case "add":
                        $name = $data['name'];
                        $name = mysql_real_escape_string($name);
                        $type = $data['type'];
                        $type = mysql_real_escape_string($type);
                        $content = intval($data['content']);
                        //$content = mysql_real_escape_string($content);
                        $calories = intval($data['calories']);
                        //$calories = mysql_real_escape_string($calories);
                        $price = intval($data['price']);
                        //$price = mysql_real_escape_string($price);
                        $barid = intval($data['barid']);
                        //$barid = mysql_real_escape_string($barid);

                        $query = ("INSERT INTO drink (name, alcohol_content, type, calories, price, bar_id)
                        VALUES ('$name' , '$content' , '$type', '$calories' , '$price', '$barid')");
                        
                        if ($mysqli->query($query) === TRUE) {
                            echo "New record created successfully";
                        } else {
                            echo "Error: " . $query . "<br>" . $mysqli->error;
                        }
                        
                        break;
                    case "edit":
                        $name =  mysql_real_escape_string($data['name']);
                        $barid = intval($data['barid']);
                        $editvalue = mysql_real_escape_string($data['editvalue']);
                        if($editvalue === "type")
                        {
                            $value = mysql_real_escape_string($data['value']);
                        }
                        else
                        {
                            $value = intval($data['value']);
                        }
                        $query = ("UPDATE drink SET $editvalue='$value' WHERE name='$name' AND bar_id='$barid'");
                        if ($mysqli->query($query) === TRUE) {
                            echo "Edit created successfully";
                        } else {
                            echo "Error: " . $query . "<br>" . $mysqli->error;
                        }
                        break;
                    case "delete":
                        $name = $data['name'];
                        $name = mysql_real_escape_string($name);
                        $barid = intval($data['barid']);
                        $query = ("DELETE FROM drink WHERE name='$name' AND bar_id='$barid'");
                         if ($mysqli->query($query) === TRUE) {
                            echo "Delete created successfully";
                        } else {
                            echo "Error: " . $query . "<br>" . $mysqli->error;
                        }
                    break;
                    default:
                        $response = formatResponse("failure","Invalid action '$action'");
                        break;
                }
            } 
            catch (Exception $e) 
            {
                $response = formatResponse("failure", "An error occurred: $e");
            }
        }

        // Close instance
        mysqli_close($mysqli);
        return;
    }


    // END readRating.php
?>