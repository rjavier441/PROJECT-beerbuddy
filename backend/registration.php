<?php 
require "utility.php";
require "required/credentials.php";

$birthdate = "";
$username = "";
$password = "";
$errors = array();

$db = mysqli_connect($_CREDENTIALS["db"]["host"], $_CREDENTIALS["db"]["user"], $_CREDENTIALS["db"]["pwd"], $_CREDENTIALS["db"]["name"]);

//check if connecting to database
if (mysqli_connect_errno()) 
{
    $response = formatResponse("failure", mysqli_connect_errno());
    replyToClient($response);
    exit();
}

if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['birthdate'])) 
{
    $birthdate = mysqli_real_escape_string($db, $_POST['birthdate']);
    $username = mysqli_real_escape_string($db, $_POST['username']);
    $password = mysqli_real_escape_string($db, $_POST['password']);

    if (empty($birthdate)) 
    { 
        array_push($errors, "Birth date is required"); 
    }
    
    if (empty($username)) 
    { 
        array_push($errors, "Username is required"); 
    }
    
    if (empty($password)) 
    { 
        array_push($errors, "Password is required"); 
    }

    $user_check_query = "SELECT * FROM user WHERE username='$username' LIMIT 1";
    $results = mysqli_query($db, $user_check_query);
    $user = mysqli_fetch_assoc($results);

    //if the username does not exist, you can proceed to register
    if (!$user) 
    { 
        if (count($errors) == 0) 
        {
             $password = hash("sha256", $password); //encrypts the password

             $query = "INSERT INTO user (username, birthdate, password) 
                  VALUES('$username', '$birthdate', '$password')";
             mysqli_query($db, $query);
             $_SESSION['username'] = $username;
             $_SESSION['success'] = "You are now registered";
             header('location: ../loginPage.html'); //redirects to this page
        }
        else
        {
            $response = formatResponse("failure", "Cannot be inserted");
            replyToClient($response);
        }
    }
    
    else
    {
        $response = formatResponse("failure", "Username already exists");
        replyToClient($response);
    }
}
    
mysqli_close($db);
    
?>