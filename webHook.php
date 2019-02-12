<?php
$leads = $_POST['leads']['add'];
$f = fopen("data.csv","at") or die("Что-то пошло не так!!!");
flock($f, LOCK_EX);

$keys = '';
$values = '';
foreach ($leads as $key => $value) {
    $keys .= ';'.$key;
    $values .=';'.$value;
}
fputs ($f, $keys);
fputs ($f, $values);

$account = $_POST['account'];
$keys = '';
$values = '';
foreach ($account as $key => $value) {
    $keys .= ';'.$key;
    $values .=';'.$value;
}
fputs ($f, $keys);
fputs ($f, $values);

flock($f, LOCK_UN);
fclose($f);
