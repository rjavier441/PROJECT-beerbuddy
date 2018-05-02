<?php
    require "required/credentials.php";
    require "utility.php";
    // Acquire POST request body parameters
    $action = $_POST['action'];
    $data = $_POST['data'];
    $credentials = $_CREDENTIALS["db"];
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
        $mysqli = new mysqli($credentials["host"], $credentials["user"], $credentials["pwd"], $credentials["name"]);
        if ($mysqli->connect_errno) {
            $response = formatResponse("failure", "MySQL connection failed: ($mysqli->connect_errno) $mysqli->connect_error");
        } else {
            // Perform requested action
            try
            {
                $result = -1;
                switch ($action) 
                {
                    case "add":
                        $name = $data['name'];
                        $name = mysqli_real_escape_string($mysqli, $name);
                        $type = $data['type'];
                        $type = mysqli_real_escape_string($mysqli, $type);
                        $content = intval($data['content']);
                        //$content = mysqli_real_escape_string($mysqli, $content);
                        $calories = intval($data['calories']);
                        //$calories = mysqli_real_escape_string($mysqli, $calories);
                        $price = intval($data['price']);
                        //$price = mysqli_real_escape_string($mysqli, $price);
                        $barid = intval($data['barid']);
                        //$barid = mysqli_real_escape_string($mysqli, $barid);

                        $query = ("INSERT INTO drink (name, alcohol_content, type, calories, price, bar_id)
                        VALUES ('$name' , '$content' , '$type', '$calories' , '$price', '$barid')");
                        
                        if ($mysqli->query($query) === TRUE) {
                            echo "New record created successfully";
                        } else {
                            echo "Error: " . $query . "<br>" . $mysqli->error;
                        }
                        
                        break;
                    case "edit":
                        $name =  mysqli_real_escape_string($mysqli, $data['name']);
                        $barid = intval($data['barid']);
                        $editvalue = mysqli_real_escape_string($mysqli, $data['editvalue']);
                        if($editvalue === "type")
                        {
                            $value = mysqli_real_escape_string($mysqli, $data['value']);
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
                        $name = mysqli_real_escape_string($mysqli, $name);
                        $barid = intval($data['barid']);
                        $query = ("DELETE FROM drink WHERE name='$name' AND bar_id=$barid");
                         if ($mysqli->query($query) === TRUE) {
                            $response = formatResponse("success", "Deletion successful");
                        } else {
                            $response = formatResponse("failure", "Deletion failed");
                        }
                        break;
                    case "getBars":
                        $barOwner = mysqli_real_escape_string($mysqli, $data['user']);
                        $query = ("SELECT * FROM bar WHERE username='$barOwner'");
                        $result = $mysqli->query($query);

                        if ($result === -1) {
                            $response = formatResponse("failure", "Bar search failed");
                        } else {
                            $dataSet = [];

                            // fill array
                            while ($row = $result->fetch_assoc()) {
                                $dataSet[] = $row;
                            }

                            $response = formatResponse("success", $dataSet);
                        }
                        break;
                    case "getDrinks":
                        $barID = intval(mysqli_real_escape_string($mysqli, $data['bar_id']));
                        $query = ("SELECT * FROM drink WHERE bar_id=$barID");
                        $result = $mysqli->query($query);

                        if ($result === -1) {
                            $response = formatResponse("failure", "Drink search failed");
                        } else {
                            $dataSet = [];

                            while ($row = $result->fetch_assoc()) {
                                $dataSet[] = $row;
                            }

                            $response = formatResponse("success", $dataSet);
                        }
                        break;
                    case "editDrink":
                        $oldname = mysqli_real_escape_string($mysqli, $data['oldname']);
                        $newname = mysqli_real_escape_string($mysqli, $data['newname']);
                        $newtype = mysqli_real_escape_string($mysqli, $data['newtype']);
                        $newcalories = intval(mysqli_real_escape_string($mysqli, $data['newcalories']));
                        $newalcohol = intval(mysqli_real_escape_string($mysqli, $data['newalcohol']));
                        $newprice = intval(mysqli_real_escape_string($mysqli, $data['newprice']));
                        $barID = mysqli_real_escape_string($mysqli, $data['bar_id']);
                        $query = "UPDATE drink SET name='$newname', type='$newtype', calories='$newcalories', alcohol_content='$newalcohol', price='$newprice' WHERE name='$oldname'";
                        $result = $mysqli->query($query);

                        if ($result === FALSE) {
                            $response = formatResponse("failure", "Drink update failed");
                        } else {
                            $response = formatResponse("success", "Drink update successful");
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