<?php 
require "utility.php";
require "required/credentials.php";
session_start(); 

// Unset all session variables
$_SESSION = array();

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

if (isset($_POST['username']) && isset($_POST['password'])) 
{
    $username = mysqli_real_escape_string($db, $_POST['username']);
    $password = mysqli_real_escape_string($db, $_POST['password']);

    if (empty($username)) 
    {
        array_push($errors, "Username is required");
    }
  
    if (empty($password)) 
    {
        array_push($errors, "Password is required");
    }

    if (count($errors) == 0) 
    {
        $password = hash("sha256", $password);
        $query = "SELECT * FROM user WHERE username='$username' AND password='$password'";
        $results = mysqli_query($db, $query);
        
        $_SESSION['username'] = $user_id;
      
        if (mysqli_num_rows($results) == 1) 
        {
            $_SESSION['username'] = $username;
            $_SESSION['success'] = "You are now logged in";
            header('location: ../ratingsPage.html'); //redirects to this page
        }
        
        else 
        {
            $response = formatResponse("failure", "Wrong username and password combination");
            replyToClient($response);
        }
    }
    
    else 
    {
        $response = formatResponse("failure", $errors);
        replyToClient($response);
    }
}
                                                                                                                        
mysqli_close($db);                                                                                                                        

?>