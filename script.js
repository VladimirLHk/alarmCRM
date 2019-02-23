define(['jquery'], function($){
    var CustomWidget = function () {
    	var self = this,
			system = self.system,
    		calcObj = {
    			449505:{
    				formula:'2*id458555',
					args:['458555']
				},
				458541:{
					formula:'100 + id458555',
					args:['458555']
				}
    		};


		//определяем, какие поля зависят от значения этого поля
		self.getDependingFieldsId= function (editFieldId) {
			let dependedFieldsArr = [];
			for (let fieldId in calcObj) {
				let args = calcObj[fieldId].args;
				if (args.indexOf(editFieldId) !== -1) {
					dependedFieldsArr.push(fieldId);
				}
			};
			return dependedFieldsArr;
		};

		//вычисляем значение заданных полей: передается массив, даже если в нем одно значение
		self.calcEngine = function (fieldsToCalculate) {
			fieldsToCalculate.forEach((item) => {
				//есть ли формула, привязанная к такому полю?
				if (calcObj[item] !== undefined) {
					//формула с кодами полей
					let formula = calcObj[item].formula;

					let isFindAllArguments = true;

					calcObj[item].args.forEach((fieldId) => {
						let inputSelector="input[name='CFV["+fieldId+"]']";
						let el = $(".card-fields__fields-block").find(inputSelector);
						// есть ли в карточке сделки такое поле?
						if (el.length === 0) {
							//удаляем формулу из списка
							delete calcObj[item];
							isFindAllArguments = false;
							exit;
						} else {
							let val = el[0].value;
							let reg = new RegExp('id'+fieldId, "g");
							formula = formula.replace(reg, val);
						}
					});
					if (isFindAllArguments) {
						let inputSelector="input[name='CFV["+item+"]']";
						$(".card-fields__fields-block").find(inputSelector)[0].value = eval(formula);
					}
				};
			});
		};

		self.saveFormulasObj = function () {
			let sendData = {
				'action': 'edit',
				'id': '344305',
				'code': 'list_field_calculator',
				'widget_active': 'Y',
				'settings[login]' : '123',
				'settings[formulas]': JSON.stringify(calcObj)
			};

			$.ajax({
					type: "POST",
					url: "https://clevertoys.amocrm.ru/ajax/wigets/edit",
					data: sendData,
					dataType: 'json',
					complete: function () {
						console.log("После отправки:", self.get_settings());
					}

				}
			);
		};

		self.getTemplate = function (params, callback) {
			params = (typeof params == 'object')? params:{};
			return self.render({
				href:'/templates/formula_editor.twig',
				base_path:self.params.path,
				load: callback
			}, params); //параметры для шаблона
		};

		this.callbacks = {
			render: function(){
				return true;
			},
			init: function(){
				return true;
			},
			bind_actions: function(){
				if (self.system().area === 'lcard') {
					$(".card-fields__fields-block").find("input[type='numeric']")
						.change((e)=>{
							let id = e.target.name.match(/\d+/g)[0];
							let dependedFields = self.getDependingFieldsId(id);
							if (dependedFields.length > 0) {
								self.calcEngine(dependedFields);
							}
						});
				}

				return true;
			},
			settings: function(){
				return true;
			},

			advancedSettings: function() {


				let instructText = '<b>ПРАВИЛА НАПИСАНИЯ ФОРМУЛЫ.</b><br>1)&emsp;Можно использовать знаки +,&emsp;-,&emsp;*,&emsp;/,&emsp;а также скобки: (&emsp;и&emsp;).<br>2)&emsp;Имена полей должны быть в кавычках:&emsp;"Имя поля".<br>3)&emsp;Имена полей должны точно соответствовать написанию в карточке сделки, в том числе иметь то же количество пробелов.<br>4)&emsp;Сейчас в формуле можно использовать следующие поля (кроме того,&emsp;в котром будет сохраняться значение):';

				let fourmulaToDeleteId;

				let spanClassName = 'delete_button'; //селектор кнопки удаления, для навешивания обработчиков на все кнопки

				let numericFieldsNames = {}; //все числовые поля в сделках; ключ = id поля, значение = имя поля

				//на основании объекта calcObj формирует из numericFieldsNames список полей, которые могут быть или уже являются аргументами при вычислениях
				let getPossibleArgFields = function () {
					let res = {};
					for (let item in numericFieldsNames) {
						if (calcObj[item] === undefined) res[item] = numericFieldsNames[item];
					}
					return res;
				};

				//на основании списка numericFieldsNames формирует список-подмножество: поля, которые уже являются аргументами при вычислениях
				let getArgFields = function () {
					let res = {};
					for (let item in numericFieldsNames) {
						let deps = self.getDependingFieldsId(item);
						if (deps.length > 0) res[item] = numericFieldsNames[item];
					}
					return res;
				};

				//формирует список полей, которые могут быть (и ещё не являются) вычисляемыми
				let getFieldsFreeForResult = function () {
					let res = {};

					let argsFieldsList = getArgFields();
					let notResultFieldList = getPossibleArgFields();
					for (let item in notResultFieldList) {
						if (argsFieldsList[item] === undefined) res[item] = notResultFieldList[item];
					}
					return res;
				};

				//проверят наличие переданной текстовой строки в значениях объекта, переданного вторым аргументом
				//если не находит, то возвращает false
				// если объект без свойств, то возвращает строку 'еmpty'
				let getIdByName = function (str, obj) {
					let counter = 0;
					for (let key in obj) {
						counter++;
						if (obj[key] === str) return key;
					}
					if (!counter) return "empty";
					return false;
				};

				//отрисовка шаблона по текущему состоянию объекта calсObj
				let showPage = function () {
					// формируем строки для отображения списка формул: меняем id на название полей
					let templatesFormula = [];
					for (let calcFieldId in calcObj) {

						let vFormula = calcObj[calcFieldId].formula;
						let args = calcObj[calcFieldId].args;

						args.forEach((fieldId) => {
							let reg = new RegExp('id'+fieldId, "g");
							let name = numericFieldsNames[fieldId];
							vFormula = vFormula.replace(reg, name);
						});

						templatesFormula.push({
							result: numericFieldsNames[calcFieldId], //строка левой части формулы
							formula: vFormula, //строка правой части формулы
							spanId: calcFieldId // id поля результата, чтобы знать какую формулу удалять
						});
					}


					//формирование сообщения о возможности создания новых формул
					let addFormulaMsg = '';
					let numFieldsNumber = 0;
					for (let i in numericFieldsNames) numFieldsNumber++;
					switch (numFieldsNumber) {
						case 0: addFormulaMsg = 'Нельзя создать формулы: в карточке сделок нет ни одного числового поля'; break;
						case 1: addFormulaMsg = 'Нельзя создать формулы: в карточке сделок только одно числовое поле'; break;
						default: if ($.isEmptyObject(getFieldsFreeForResult()))
									addFormulaMsg =	'Нельзя создать формулы: все числоые поля вычисляются по формуле или участвуют в вычислении. <br> Добавьте новые поля или удалите фомрулы.';
					}

					//дополняем инструкцию по написанию формулы актуальным списком полей:
					let tmpList = getPossibleArgFields();
					for (let item in tmpList) {
						instructText += " "+tmpList[item]+",";
					}
					instructText = instructText.slice(0,instructText.length-1)+'.';

					//отрисовываем шаблон

					self.getTemplate({}, function(data){
						$("#work-area-list_field_calculator")
							.append(data.render({
									params : templatesFormula, // массив объектов для формирования строк формул
									spanClass : spanClassName, // селектор внопки удаления
									textAboutAddFormula : addFormulaMsg, //текст про возможность создать формулу
									calcFeilds : getFieldsFreeForResult(), 	//список полей для выбора вычисляемого поля
									instruction: instructText //правила написания формул
								})
							);
					});
				};

				let refreshPage = function () {
					$("#work-area-list_field_calculator").children().remove();
					showPage();
				};

				//проверка правильности ввода полей
				//в случае отсутстввия ошибок (resCode = true) возвращает объект для добавления в calcObj (свойство toCalcObj)
				//в случае ошибок возвращает сообщение для вывода на экран (свойство errMsg)
				let checkFieldsInFormula = function (formulaStr, idArr, resultFieldId) {
					let resCode = true;
					let errMsg = '';
					let argsId = [];
					//а есть ли что проверять?
					if (idArr.length > 0) {
						let unknownFieldNameErrMsg = '';
						let recurFieldNameErrMsg = 'В аргументах используется поле, которому присваивается значение. <br>';
						let spSymb = ['[', "\\", '^', '$', '.', '|', '?', '*', '+', '(', ')']; //набор для экранирования в имени поля возможных спецсимволов
						let sourceList = getPossibleArgFields();
						idArr.forEach(item => {
							//убираем кавычки из значения
							let fieldName = item.slice(1,item.length-1);
							let fieldIndexInSource = getIdByName(fieldName, sourceList);
							//имени нет в списке возможных аргументов
							if (!fieldIndexInSource) {
								unknownFieldNameErrMsg += item+" ";
							} else if (fieldIndexInSource === resultFieldId) {
								//не совпадает ли поле с полем результата?
								errMsg = recurFieldNameErrMsg;
							} else {
								//поле прошло проверку, можно записать id поля в список аругментов и в строке формулы его заменять на id поля
								argsId.push(''+fieldIndexInSource);

								//защищаемся от спецсимволов regExp, которые могли быть в названии поля
								let fieldNameForRegExp = item;
								spSymb.forEach(symb => {
									let rgx = new RegExp('\\'+symb, 'g');
									fieldNameForRegExp = fieldNameForRegExp.replace(rgx,'\\'+symb);
								});

								//создаем шаблон regExp из препарированного имени поля для поиска всех вхождений в строке
								let reg = new RegExp(fieldNameForRegExp, "g");
								formulaStr = formulaStr.replace(reg, 'id'+fieldIndexInSource);
							}

						});
						//все найденные поля проверены; определяем результат проверки
						if (unknownFieldNameErrMsg !== "")  errMsg += unknownFieldNameErrMsg + '- неизвестные или не числовые поля.';
						resCode = errMsg === '';
					}
					let res = {resCode: resCode};
					if (resCode) {
						res.toCalcObj = {
							formula:formulaStr,
							args: argsId
						}
					} else {
						res.errMsg = errMsg
					}
					return res;
				};

				//НАЧАЛО ОСНОВНОЙ ПРОЦЕДУРЫ
				// получение списка полей !!! ОТРАБОТАТЬ СИТУАЦИЮ УДАЛЕННЫХ ПОЛЕЙ
				$.ajax({
					type: "GET",
					url: "https://clevertoys.amocrm.ru/api/v2/account?with=custom_fields",
					success: function (data) {
						let leadsCustomFields = data._embedded. custom_fields.leads;

						for (let fieldId in leadsCustomFields) {
							if (leadsCustomFields[fieldId].field_type === 2) {
								numericFieldsNames[fieldId] = leadsCustomFields[fieldId].name;
							}
						}

						showPage();

						// навешиваем обработчики на конпки шаблона

						//обработчик первого запроса на удаление формулы
						$(document).on('click', '.'+spanClassName, (e)=>{
							fourmulaToDeleteId = e.target.id;
							let auxMenuId = '#p'+fourmulaToDeleteId;
							$(auxMenuId).attr('hidden', false);
						});

						//обработчик отмены удаления формулы
						$(document).on('click', '.not_delete', (e)=>{
							let auxMenuId = '#p'+fourmulaToDeleteId;
							$(auxMenuId).attr('hidden', true);
						});

						//обработчик подтверждения удаления формулы
						$(document).on('click', '.delete', (e)=>{
							delete calcObj[fourmulaToDeleteId];
							console.log ("После удаления = ", calcObj);
							refreshPage();
							self.saveFormulasObj();
						});


						// обработчик включения блока добавления формул
						$(document).on('click', '#new_button', ()=> {
							$("#formula_block").attr('hidden', false);
							$("#new_button").attr('hidden', true);
						});

						// обработчик выхода из режима добавления формул без сохранения формулы
						$(document).on('click', '#not_add_button', ()=> {
							$("#formula_block").attr('hidden', true);
							$("#new_button").attr('hidden', false);
							$("#formulaString").val('');
							$("#errorMsg")[0].innerHTML = '';
						});

						//сбрасывание сообщения об ошибке при входе в одно из полей блока создания формулы
						$(document).on('click', '#formulaResult', ()=> {
							$("#errorMsg")[0].innerHTML = '';
						});
						$(document).on('click', '#formulaString', ()=> {
							$("#errorMsg")[0].innerHTML = '';
						});


						//обработчик добавления формулы
						$(document).on('click', '#add_button', ()=> {

							let formulaString = $('#formulaString')[0].value;

							//если строка формулы не пустая, то начинаем проверять
							if (formulaString === "") return;

							let resultFieldId = $('#formulaResult option:selected')[0].id;
							let syntaxTest = new SyntaxChecker(formulaString);
							let syntaxTestResult = syntaxTest.mainCycle();

							if (syntaxTestResult.resCode === 0) {
								//синтаксических ошибок нет
								let fieldTestResult = checkFieldsInFormula (formulaString, syntaxTestResult.idArr, resultFieldId);
								if (fieldTestResult.resCode) {
									//с полями все нормально - добавляем формулу в список
									calcObj[resultFieldId] = fieldTestResult.toCalcObj;
									refreshPage();
								} else {
									// с полями есть проблемы - надо выводить диагностику
									$("#errorMsg")[0].innerHTML = fieldTestResult.errMsg;
								}
							} else {
								//есть синтаксические ошибки - надо выводить диагностику
								$("#errorMsg")[0].innerHTML = 'Ошибка в позиции '+(syntaxTestResult.symblNum+1)+".<br>"+syntaxTestResult.errMsg;
							}


						});

					}

				});

			},
			onSave: function(){
				return true;
			},
			destroy: function(){
				
			},
			contacts: {
					//select contacts in list and clicked on widget name
					selected: function(){
						console.log('contacts');
					}
				},
			leads: {
					//select leads in list and clicked on widget name
					selected: function(){
						console.log('leads');
					}
				},
			tasks: {
					//select taks in list and clicked on widget name
					selected: function(){
						console.log('tasks');
					}
				}
		};
		return this;

    };

return CustomWidget;
});

//черз метод mainCycle класс реализует порверку строки формулы на правила синтаксиса
//возвращает объект с кодом результата resCode
// в случае отсутствия ошибок (resCode = 0) в объекте есть свойство idArr - массив с обнаруженными именами полей: может быть пустым, если в формуле только константы;
// в случае обнаружения ошибки в statusMsg находится текстовое описание ошибки,
// а в symblNum - номер позиции в переданной строке, где обнаружена ошибка.
//Пробелы игнорируются. Они не считаются разделителями для цифр. Например "42 0" = "420", хотя не знаю, правильно ли проинтерпретирует eval
//В имени поля все пробелы сохраняются, как ввел пользователь
class SyntaxChecker {
	constructor (str) {
		this.testingStr = str;
		this.strLen = this.testingStr.length;
		this.pointer = 0;
		this.currentState = 0;
		this.statusCode = 0;
		this.bracketCounter = 0;
		this.curId;
		this.idStorage = [];
		this.statusMsg = [
			'OK',
			'Ожидается (, число, имя поля, + или –',
			'Ожидается оператор',
			'Ожидается цифра или оператор',
			'Ожидается имя поля',
			'Ожидается оператор или )',
			'Несовпадающее количество скобок',
			'Пустая строка'
		];

		this.closeBracket = this.closeBracket.bind(this);
		this.collectFig = this.collectFig.bind(this);
		this.collectId = this.collectId.bind(this);
		this.err = this.err.bind(this);
		this.openBracket = this.openBracket.bind(this);
		this.operand = this.operand.bind(this);
		this.space = this.space.bind(this);
		this.strEnd = this.strEnd.bind(this);

		this.transitionMatrix = [
			[this.err, this.openBracket, this.err, this.collectFig, this.operand, this.err, this.collectId, this.space, this.err], //начало
			[this.err, this.openBracket, this.err, this.collectFig, this.operand, this.err, this.collectId, this.space,  this.err], //открывающаяся скобка
			[this.strEnd, this.err, this.closeBracket, this.err, this.operand, this.operand, this.err, this.space,  this.err], //закрывающаяся скобка
			[this.strEnd, this.err, this.closeBracket, this.collectFig, this.operand, this.operand, this.err, this.space,  this.err], //цифра
			[this.err, this.openBracket, this.err, this.collectFig, this.err, this.err, this.collectId, this.space,  this.err], //+ или -
			[this.err, this.openBracket, this.err, this.collectFig, this.err, this.err, this.collectId, this.space,  this.err], //* или /
			[this.err, this.collectId, this.collectId, this.collectId, this.collectId, this.collectId, this.err, this.collectId, this.collectId], //открывающая кавычка
			[this.err, this.collectId, this.collectId, this.collectId, this.collectId, this.collectId, this.collectId, this.collectId, this.collectId], //после открывающейся кавычки
			[this.strEnd, this.err, this.closeBracket, this.err, this.operand, this.operand, this.err, this.space, this.err] //после закрывающе двойной кавычки
		];
	}

	getSymbolCode (symb) {
		switch (symb) {
			case '(': return 1;
			case ')': return 2;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9': return 3;
			case '+':
			case '-': return 4;
			case '*':
			case '/': return 5;
			case '"': return 6;
			case ' ': return 7;
			default: return 8
		}
	}

	openBracket (curState, symblCode) {
		this.bracketCounter++;
		this.currentState = symblCode;
	}

	closeBracket (curState, symblCode) {
		this.bracketCounter--;
		if (this.bracketCounter < 0) {

		} else {
			this.currentState = symblCode;
		}

	}

	collectFig (curState, symblCode) {
		this.currentState = symblCode;
	}

	collectId (curState, symblCode) {
		switch (curState) {
			case 6: this.currentState = 7;
				this.curId +=this.testingStr.charAt(this.pointer);
				break;
			case 7: if (symblCode === 6) { //закончилось имя поля
				this.currentState = 8;
				this.curId += '"';
				if (this.idStorage.indexOf(this.curId) === -1) this.idStorage.push(this.curId);
				this.curId = "";
			} else this.curId +=this.testingStr.charAt(this.pointer);
				break;
			default: this.currentState = 6;
				this.curId = '"';
		}
	}

	operand (curState, symblCode) {
		this.currentState = symblCode;
	}

	space (curState, symblCode) {

	}

	strEnd (curState, symblCode) {
		if (this.bracketCounter !== 0) {
			this.statusCode = 6;
			return {
				symblNum: this.pointer,
				resCode: this.statusCode,
				errMsg: this.statusMsg[this.statusCode]
			}
		}
		return {
			symblNum: this.pointer,
			resCode: 0,
			errMsg: this.statusMsg[0],
			idArr: this.idStorage
		}
	}

	err (curState, symblCode) {

		let res = {
			symblNum: this.pointer
		};

		switch (curState) {
			case 0:
			case 1:
			case 4:
			case 5:this.statusCode = 1;
				break;
			case 2:this.statusCode = 2;
				break;
			case 3:this.statusCode = 3;
				break;
			case 6:
			case 7:this.statusCode = 4;
				break;
			case 8:this.statusCode = 5;
				break;
			default: this.statusCode = 99;
				res.errMsg = "Неизвестная ошбика";
		}
		if (this.statusCode !== 99) res.errMsg = this.statusMsg[this.statusCode];

		res.resCode = this.statusCode;

		return res;
	}

	mainCycle () {
		if (this.strLen === 0) {
			this.statusCode = 7;
			return {
				symblNum: this.pointer,
				resCode: this.statusCode,
				errMsg: this.statusMsg[this.statusCode]
			}
		}

		let result;

		for (; this.pointer <= this.strLen; this.pointer++) {
			let curSymbCode = this.pointer === this.strLen ? 0 : this.getSymbolCode(this.testingStr.charAt(this.pointer));
			result = this.transitionMatrix[this.currentState][curSymbCode](this.currentState, curSymbCode);
			if (this.statusCode !== 0) return result;
		}
		return result;
	}
};

