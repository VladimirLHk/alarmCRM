'use strict';

class DateChecker {

    constructor (param) {
        this.daysInMon = {
            31: [1, 3, 5, 7, 8, 10, 12],
            30: [4,6,9,11]
        };
    }

    //целое одно или двузначное число (возможно, строка из одного или двух символов) проверяется на диапазон 1-12
    checkMonth (mon) {
        let monNum = +mon;
        return (!isNaN(monNum)) && monNum > 0 && monNum <13;
    }

    //целое одно или двузначное число (возможно, строка из одного или двух символов) проверяется на диапазон 1-31
    //если параметр mon - правильный номер месяца, а не false, то проверяется на соответствие номера дня числу дней в месяце
    checkDay (day, mon) {
        let daysInMon = this.daysInMon;

        let dayNum = +day;
        let monNum = +mon;
        if (isNaN(dayNum)) return false;
        if (dayNum < 1 || dayNum >31) return false;
        if (monNum) {
            switch (dayNum) {
                case 31: if (daysInMon['31'].indexOf(monNum) === -1) return false; break;
                case 30: if (daysInMon['30'].indexOf(monNum) === -1) return false; break;
            }
        }
        return dayNum;
    }
}

module.exports = DateChecker;
