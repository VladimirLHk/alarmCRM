<?php
require_once "authorization.php";
require_once "dealsWork.php";
require_once "doublesWork.php";

foreach ($_REQUEST as $key => $val) {
    $userInform[$key] = $val;
}

if ($userInform) {
    If (ConnectToAMO()) {
        if (! isDoubles($userInform)) {
            addDeal($userInform);
        }
    }

    $header="
        <html>
        <head>
        <title>from script</title>
        <meta content=\'text/html; charset=UTF-8\' http-equiv=Content-Type>
        </head>
        <body>
    ";

    echo $header;
    echo "<div id='OK_msg'><h1> Спасибо! Мы обязательно с Вами свяжемся!!!</h1>";
    echo "<input type=button value='Вернуться назад' OnClick='history.back()'> </div>";
}