<?php
// echo "logged out";
if($_POST["ajax"])
{
$response = formatResponse("success", "logging out");
replyToClient($response);
header('Location: http://localhost/beerbuddy/index.html');
exit();
}
?>