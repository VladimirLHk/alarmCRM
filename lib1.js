'use strict'
firstOk.addEventListener('click', calc);

function calc () {
    let formatter = new Intl.NumberFormat("ru");

    let resText;
    let userNum = +firstInput.value;
    if (isNaN(userNum)) resText = "!!! Вы ошиблись при вводе числа!!!";
    else {
        let result = Math.round(100* userNum * 1000 / 3600) / 100;
        let signum = userNum<0?'"минус" ':'';
        resText = signum + formatter.format(Math.abs(userNum)) + " км/ч - это " + signum + formatter.format(Math.abs(result)) + " м/с";
    }
    firstResult.innerHTML = resText;
}