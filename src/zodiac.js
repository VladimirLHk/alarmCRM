'use strict'
// secondOk.addEventListener('click', getZSign);

//класс, работащий со справочником знаков зодиака
class Zodiac {
    constructor (params) {
        this.day = +params.day;
        this.mon = +params.month;
        this.zodiacName = [
            {name: 'Козерог', startDay: 23, code: '\u2651'},
            {name: 'Водолей', startDay: 21, code: '\u2652'},
            {name: 'Рыбы', startDay: 20, code: '\u2653'},
            {name: 'Овен', startDay: 21, code: '\u2648'},
            {name: 'Телец', startDay: 21, code: '\u2649'},
            {name: 'Близнецы', startDay: 22, code: '\u264A'},
            {name: 'Рак', startDay: 22, code: '\u264B'},
            {name: 'Лев', startDay: 23, code: '\u264C'},
            {name: 'Дева', startDay: 22, code: '\u264D'},
            {name: 'Весы', startDay: 24, code: '\u264E'},
            {name: 'Скорпион', startDay: 24, code: '\u264F'},
            {name: 'Стрелец', startDay: 23, code: '\u2650'}
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
        if (monShift) arrNum = arrNum ? --arrNum : 11;
        return arrNum;
    }

    //сформировать текстовое представлние знака зодиака по номеру в справочнике
    signToString (num) {
        return 'Ваш знак зодиака: '+this.zodiacName[num].name+" "+this.zodiacName[num].code;
    }

    //сформировать строку для сообщения о введенной дате рождения
    birthdayToString () {
        return 'Ваш день рождения: '+this.day+'.'+this.mon;
    }

}

module.exports = Zodiac;
