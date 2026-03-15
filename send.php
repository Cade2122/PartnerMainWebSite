<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $city = strip_tags(trim($_POST["city"]));
    $phone = strip_tags(trim($_POST["phone"]));
    $description = strip_tags(trim($_POST["description"]));

    if (empty($name) || empty($phone)) {
        echo json_encode(["success" => false, "error" => "Заполните обязательные поля"]);
        exit;
    }

    $to = "sidorov.wanysha23031997@gmail.com"; // твоя почта
    $subject = "Новая заявка с сайта ЮрЛицо";

    $email_content = "ФИО: $name\n";
    $email_content .= "Город: $city\n";
    $email_content .= "Телефон: $phone\n";
    $email_content .= "Описание:\n$description\n";

    $headers = "From: no-reply@your-site.ru\r\n";
    $headers .= "Reply-To: no-reply@your-site.ru\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $email_content, $headers)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Не удалось отправить письмо"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Неверный метод запроса"]);
}
?>