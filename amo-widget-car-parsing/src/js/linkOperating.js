'use strict'

define([], function () {
    /**
     * Модуль для работы со связями между полями карточки сделки и полями базы
     * @param {object} data - данные, полученные из базы;
     * пока мне не известна его структура, буду считать, что это массив с объектами, где ключами являются поля в базе,
     * о списке которых мы договорились с Павлом:
     * «Марка» => "brand",
     * «Модель» => "model",
     * «Поколение» => "generation",
     * «Дата начала производства поколения» => "startDate",
     * «Дата окончания производства поколения» => "endDate"
     */

    let testTable =
        {
            449505:'brand',
            458541:'startDate'
        };

    class LinkOperator {
        constructor() {
            // переменная для хранения соответствия id поля карточки сделки (ключ) ->
            // id поля базы в объекте dataOperating, по которому осуществляется автозаполнение поля в карточке (значение)
            this.linkObj = testTable;
            // массив id полей в карточке сделки, существующих на данный момент
            this.customFieldId = [];

        }

        //загрузка таблицы соответствий
        loadLinkObject () {

            this.updateLinkObject();
        }

        //сохранение таблицы соответствий
        saveLinkObject () {

        }

        //порверка таблицы соответствий на наличие в ней id полей, уже отсутствующих в карточке -> удаление таких записей из таблицы
        updateLinkObject () {

        }

        //установление списка id полей, существующих в карточке сделки
        // idList - это массив полей СДЕЛКИ, который приходит в ответ на запрос "https://clevertoys.amocrm.ru/api/v2/account?with=custom_fields"
        setCustomFieldIdList (idList) {
            this.customFieldId = [];
            //пока не накладываем никаких ограничений на поля: все существующие поля Сделки могут быть в таблице соответствия
            for (let fieldId in idList) this.customFieldId.push(fieldId);
//            console.log(this.customFieldId);
            this.updateLinkObject();
        }

        //возврат таблицы соответствий
        getLinkObject () {
            return this.linkObj
        }

    }
    return LinkOperator;
});