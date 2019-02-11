<?php
 $errorMsgs = [];

function isFormOK() {
    return true;
}

function returnToForm () {
    $header="
        <html>
        <head>
        <title>from script</title>
        <meta content=\'text/html; charset=UTF-8\' http-equiv=Content-Type>
        </head>
        <body>
    ";

    echo $header;
    global $errorMsgs;
    $errorsNum = count($errorMsgs);
    for ($i=0; $i<$errorMsgs; $i++) echo "<p>".$errorMsgs[$i]."</p>";
    echo "<input type=button value='Вернуться в форму' OnClick='history.back()'>";
}