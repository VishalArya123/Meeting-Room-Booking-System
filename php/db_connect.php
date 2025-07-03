<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "meeting_room_booking";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>