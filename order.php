<?php
$first_name = $_POST["first_name"];
$last_name = $_POST["last_name"];
$city = $_POST["city"];
$phone = $_POST["phone"];
$email = $_POST["email"];
$order = $_POST["order"];

$data = [];
$error = false;

if (!$first_name) {
    $data["sucess"] = false;
    $data["error"] = "First name is required";
    $error = true;
}

if (!$city) {
    $data["sucess"] = false;
    $data["error"] = "City is required";
    $error = true;
}

if (!$phone) {
    $data["sucess"] = false;
    $data["error"] = "Phone is required";
    $error = true;
}

if ($error) {
    header('Content-Type: application/json');
    echo json_encode($data);
    return;
}

$mail_body = "Замовлення \r\n";
$mail_body .= "first_name: " . $first_name . "\r\n";

$mail_body .= "city: " . $city  . "\r\n";

$mail_body .= "phone: " . $phone  . "\r\n";

if ($email) {
    $mail_body .= "email: " . $email  . "\r\n";
}

$mail_body .= "\r\n \r\n " . $order;

$headers = 'From: webmaster@example.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail("tripol.zp@gmail.com","Order",$mail_body, $headers);
mail("aa.yaroshenko@gmail.com","Order",$mail_body, $headers);

//$header('Content-Type: application/json');
$data["sucess"] = true;
echo json_encode($data);
?>