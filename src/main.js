'use strict';

let DateChecker = require('./dateChecker');
let Zodiac = require('./zodiac');

function getZSign (inputString) {

    let resText = inputString.match(/\d{1,2}-\d{1,2}/);
    if (resText === null) return "Вы не ввели дату в нужном формате: ДД-ММ.";

    let [day, mon] = resText[0].split('-');

    let dGuru = new DateChecker();
    let checked = dGuru.checkMonth(mon);
    if (!checked) {
        resText = "!!! Вы ошиблись в номере месяца !!!";
        mon = false;
    }

    checked = dGuru.checkDay(day, mon);
    if (!checked) {
        resText = (typeof resText === 'string' ? resText+"\n" : '') + "!!! Вы ошиблись в номере дня !!!";
    }

    if (typeof resText !== 'string') {
        let zGuru = new Zodiac({day: day, month: mon});
        resText = zGuru.birthdayToString()+'\n'+zGuru.signToString(zGuru.getZodiacNum());
    }
    return resText;

}

module.exports = getZSign;
