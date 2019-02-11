<?php
require_once "checkForm.php";
require_once "authorization.php";
require_once "dealsWork.php";
require_once "doublesWork.php";

if (isFormOK()) {
    $result = ConnectToAMO();
    If ($result !== false) {
        $dealArr = getDeals();
        if (count($dealArr) !== 0) {
            checkDoublesAndSetTasks();
        }
        addDeal();
    } else {
        logDataAndProblems();
    }
} else returnToForm();