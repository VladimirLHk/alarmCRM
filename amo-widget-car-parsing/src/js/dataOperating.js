'use strict'

define([], function () {
    /**
     * Модуль для работы с данными из базы
     * @param {object} data - данные, полученные из базы;
     * пока мне не известна его структура, буду считать, что это массив с объектами, где ключами являются поля в базе,
     * о списке которых мы договорились с Павлом:
     * «Марка» => "brand",
     * «Модель» => "model",
     * «Поколение» => "generation",
     * «Дата начала производства поколения» => "startDate",
     * «Дата окончания производства поколения» => "endDate"
     */

    let testData = [
        {
            'brand': 'BMW',
            'model': 'X3',
            'generation': 'p',
            'startDate': '2004-01-01',
            'endDate': '2009-01-01'
        },
        {
            'brand': 'BMW',
            'model': 'X5',
            'generation': 'pl',
            'startDate': '2004-07-31',
            'endDate': '2012-05-03'
        },
        {
            'brand': 'BMW',
            'model': 'X1',
            'generation': 's4979',
            'startDate': '2001-09-13',
            'endDate': '2008-08-01'
        },

    ];

    class DataOperator {
        constructor () {
            this.data; // переменная для хранения набора, полученного из базы
            this.dbMode = false; //временый признак, что работаем не с базой данных, а с фиксированным тестовым набором
        }

        //формирование свойств объекта на основании сырых данных из базы
        setData(data) {
            if (this.dbMode) {

            } else {
                this.data = testData;
            }
        }

        //true - если из базы получен пустой набор
        isEmptyData () {
            return !this.data.length;
        }

        //по каждой записи из базы возвращает список значений, объединенных в строку через порбел
        getList () {
            let resList = [];
            this.data.forEach(item => {
                let line = '';
                for (let key in item) line += item[key]+" ";
                resList.push(line.substr(0,line.length-1));
            });
            return resList;
        }

        //возвращает полученную запись из базы по id == номер записи в списке
        getListItem (id) {
            return this.data[id];
        }

    }

    return DataOperator;
});