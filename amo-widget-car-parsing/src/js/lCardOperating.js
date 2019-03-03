'use strict'

define(['jquery', './dataOperating.js', './linkOperating.js'],
    function ($, DataOperator, LinkOperator) {
    /**
     * Модуль для работы в карточке сделки
     * @param {string} inputSelector - селектор элемента в котором вводится текст
     * @param {string} appendToSelector - селектор элемента, ПЕРЕД которым надо будет вставить список вариантов-подсказок для выбора
     */

    class DealNameOperator {

        constructor (inputSelector, interval, strLen, linkObj){

            this.minStrLen = strLen ? strLen : 3; //минимальная длина строки, которую стоит отправлять запросом в базу
            this.minCallInterval = interval ? interval : 500; //минимальный интервал обращения к базе (мсек)

            //перечень кодов клавиш, нажатие которых не надо обрабатывать в keyUpListener
            this.notForKeyUp = [9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145, 154, 157];

            this.prevCallTime = undefined; //время предыдущего обращения к базе (мсек)

            this.dataObj = new DataOperator (); //объект для работы с данными из базы
            this.linkWorker = linkObj ? linkObj : new LinkOperator (); //объект для работы с таблицей соответствий

            this.liClassName = 'liClassName'; //класс для элементов с вариантами подсказок
            this.liIdPrefix = 'db-option-'; //префикс для id у варианта подсказки
            this.ulId = 'ulBdOptions'; //id списка ul с вариантами подсказок

            let inputEl = $(inputSelector);
            this.textInputElement = inputEl.length === 0 ? null : inputEl[0];

//            let beforeEl = $(beforeSelector);
//            this.insertPointElement = beforeEl.length === 0 ? null : beforeEl[0];

            //найден элемент для ввода названия сделки
            if (inputEl.length !== 0) {
                //назначаем обработчики на события в поле ввода названия сделки
                this.keyUpListener = this.keyUpListener.bind(this);
                this.enterListener = this.enterListener.bind(this);
                this.textInputElement.addEventListener('keyup',this.keyUpListener);
                this.textInputElement.addEventListener('enter',this.enterListener); //нужна ли какая-то обработка нажатия Enter или автозаполнеине не делается?

                //не нужно ли ещё обработчки на вставку текста в поле через контекстное меню???

                //если находмся в карточке новой сделки, то нужно "заглушить" штатную контекстную подсказку
                if (this.textInputElement.nodeName === 'INPUT') this.textInputElement.dataset.url='';
            }
        }

        keyUpListener (e) {
            //является ли нажатая клавиша символом, который может отражаться в названии сделки?
            if (this.notForKeyUp.indexOf(e.which) !== -1) return;

            let userInput =  e.target.value;
            //строка слишком короткая, чтобы делать запрос
            if (userInput.length < this.minStrLen) {
                this.closeList();
                return;
            }

            let isMakeCall = !this.prevCall; //было ли уже обращение к базе

            let thisTime = Date.now();
            //если уже было, то прошел ли минимальный интервал
            if (!isMakeCall) isMakeCall = thisTime > this.prevCallTime + this.minCallInterval;

            if (isMakeCall) {

//                console.log("Пора запрашивать данные. Строка = ", userInput);

                //здесь будет запрос к algolia, в callback которого перейдут все последующие строки

                this.dataObj.setData('');
                if (!this.dataObj.isEmptyData()) {
                    this.showList(this.dataObj.getList(), userInput);
                    this.liListener = this.liListener.bind(this);
                    $("."+this.liClassName).click(this.liListener);
                    // $(document).on ('click', "."+this.liClassName, this.liListener); - это если окажется, что не находит только что добавленные элементы
                }
                this.prevCallTime = thisTime;
            }
        }

        enterListener (e) {
        }

        liListener (e) {
           let curElement = e.target;
           while (curElement.nodeName !== 'LI') curElement = curElement.parentNode;

           let choosedId = +curElement.id.replace(this.liIdPrefix,'');
           this.textInputElement.value = this.dataObj.getList()[choosedId];
           this.closeList();

           //формирование текущего списка полей карточки сделки и автозаполнение их по таблице связей
            let linkWorker = this.linkWorker;
            let valuesToSet = this.dataObj.getListItem(choosedId);
            $.ajax({
                type: "GET",
                url: "https://clevertoys.amocrm.ru/api/v2/account?with=custom_fields",
                success: function (data) {
                    let leadsCustomFields = data._embedded.custom_fields.leads;
                    linkWorker.setCustomFieldIdList(leadsCustomFields);

                    let linkTable = linkWorker.getLinkObject();
                    console.log("linkTable= ", linkTable);
                    for (let key in linkTable) {
                        let fieldValue = valuesToSet[linkTable[key]];
                        let inputSelector="input[name='CFV["+key+"]']";
                        $(".card-fields__fields-block").find(inputSelector)[0].value = fieldValue;
                    }
                }
            });
        }

        // очищает список вариантов и делает список подсказок невидимым == меняет настройки
        closeList () {
            let ulElement = $(this.textInputElement).prev();
            if (this.textInputElement.nodeName === 'TEXTAREA') {
                $(ulElement).remove();
            } else {
                //удаляем всех варианты
                $(ulElement).children().remove();
                //восстанавливаем атрибуты
                ulElement.removeClass('control--suggest--list-opened').addClass('control--suggest--list');

            }
//            $(this.textInputElement).parent().attr('style', '');

        }

        //открывает список вариантов-подсказок
        showList (optionNames, userInput) {
            console.log("In showList");

            this.closeList();

            //если редактируется существующая сделка, то построить доп. конструкцию
            if (this.textInputElement.nodeName === 'TEXTAREA') {
                $('<ul class="control--suggest--list custom-scroll"></ul>').insertBefore(this.textInputElement);
            }

            this.makeOptionList(optionNames, userInput);
//            $(this.textInputElement).parent().attr('style', 'z-index: 12;');
        }

        makeOptionList (optionNames, userStr) {
//            let ulElement = '<ul id="'+this.ulId+'">';

            let ulElement = $(this.textInputElement).prev();

            //не надо ли здесь с regExp отработать спецсимволы???
            optionNames.map((str, num) => {
                //разобраться, как находить вне зависимости от регистра и добавлять к найденной строке подчеркивание
                let reg = new RegExp(userStr, 'ig');
                let liElement = '<li id="'+this.liIdPrefix+num+'" class="'
                    +this.liClassName
                    +'" style="padding: 5px 6px; white-space: nowrap;"><span>'
                    +str.replace(reg,'<b style="background-color: #fffecd;">'+userStr+'</b>')+'</span></li>';
/*
                let liElement = '<li id="'+this.liIdPrefix+num+'" class="control--suggest--list--item '
                    +this.liClassName
                    +'"><span class="control--suggest--list--item-inner">'
                    +str.replace(reg,'<b>'+userStr+'</b>')+'</span></li>';

 */
                ulElement.append(liElement);
            });

            ulElement.removeClass('control--suggest--list js-control--suggest--list').addClass('control--suggest--list-opened');

//            ulElement += '</ul>';

        }
    }

    return DealNameOperator
});

