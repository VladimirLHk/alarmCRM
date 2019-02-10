'use strict'
secondOk.addEventListener('click', getZSign);


//класс, работащий со справочником знаков зодиака
class Zodiac {
    constructor (params) {
        this.day = params.day;
        this.mon = params.month;
        this.zodiacName = [
            {name: 'Козерог', startDay: 23, code: '2651'},
            {name: 'Водолей', startDay: 21, code: '2652'},
            {name: 'Рыбы', startDay: 20, code: '2653'},
            {name: 'Овен', startDay: 21, code: '2648'},
            {name: 'Телец', startDay: 21, code: '2649'},
            {name: 'Близнецы', startDay: 22, code: '264A'},
            {name: 'Рак', startDay: 22, code: '264B'},
            {name: 'Лев', startDay: 23, code: '264C'},
            {name: 'Дева', startDay: 22, code: '264D'},
            {name: 'Весы', startDay: 24, code: '264E'},
            {name: 'Скорпион', startDay: 24, code: '264F'},
            {name: 'Стрелец', startDay: 23, code: '2650'}
        ];
    }

    //получить номер знака зодиака в справочнике
    getZodiacNum () {
        //по месяцу рождения определяем возможный номер знака зодиака в справочном массиве
        let arrNum = this.mon % 12;
        //узнаем дату начала знака зодиака в этом месяце
        let signStartDay = this.zodiacName[arrNum].startDay;
        //определяем, нужна ли поправка к номеру массива === день рождения раньше даты начала знака?
        let monShift = this.day < signStartDay;
        if (monShift) arrNum = arrNum ? arrNum-- : 11;
        return arrNum;
    }

    //сформировать текстовое представлние знака зодиака по номеру в справочнике
    signToString (num) {
        return 'Ваш знак зодиака: '+this.zodiacName[num].name+" &#x"+this.zodiacName[num].code;
    }

    //сформировать строку для сообщения о введенной дате рождения
    birthdayToString () {
        let mon = ''+ (this.mon < 10 ? '0':'')+this.mon;
        return 'Ваш день рождения: '+this.day+'.'+mon;
    }

}

function checkMonth (mon) {
    let monNum = +mon;
    if (isNaN(monNum)) return false;
    if (monNum < 1 || monNum >=13) return false;
    return Math.floor(monNum);
}

function checkDay (day, mon) {
    let daysInMon = {
        31: [1, 3, 5, 7, 8, 10, 12],
        30: [4,6,9,11]
    };

    let dayNum = +day;
    if (isNaN(dayNum)) return false;
    if (dayNum < 1 || dayNum >32) return false;
    dayNum = Math.floor(dayNum);
    if (mon) {
        switch (dayNum) {
            case 31: if (daysInMon['31'].indexOf(mon) === -1) return false; break;
            case 30: if (daysInMon['30'].indexOf(mon) === -1) return false; break;
        }
    }
    return dayNum;
}


function getZSign () {
    let resText;
    let checked = checkMonth(secondMon.value);
    if (!checked) {
        resText = "!!! Вы ошиблись в номере месяца !!!";
    } else secondMon.value = checked;
    let month = checked;


    checked = checkDay(secondDay.value, month);
    if (!checked) {resText = (
        resText ? resText+"<br>":'')+"!!! Вы ошиблись в номере дня !!!";
    } else secondDay.value = checked;

    if (resText === undefined) {
        let zGuru = new Zodiac({day: checked, month: month});
        resText = zGuru.birthdayToString()+'<br>'+zGuru.signToString(zGuru.getZodiacNum());
    }
    secondResult.innerHTML = resText;
}
