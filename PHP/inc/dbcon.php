<?php
 
$con = mysqli_connect("localhost", "root", "", "inventory_management_db");
 
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
} else {
    // echo "Database Connected!!!";
}