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
//			console.log(fieldsToCalculate);
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
//			settings : JSON.stringify({login: '123', formulas: JSON.stringify(calcObj)})

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
				console.log("12", self.system().area, calcObj);
				if (self.system().area === 'advanced_settings') {

				}

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

				console.log ("Запустилась advancedSettings");

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

				//отрисовка шаблона по текущему состоянию объекта calсObj
				let showPage = function () {
					console.log('Это showPage');
					console.log(calcObj);
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

					//отрисовываем шаблон

					self.getTemplate({}, function(data){
						$("#work-area-list_field_calculator")
							.append(data.render({
									params : templatesFormula, // массив объектов для формирования строк формул
									spanClass : spanClassName, // селектор внопки удаления
									textAboutAddFormula : addFormulaMsg, //текст про возможность создать формулу
									calcFeilds : getFieldsFreeForResult() 	//список полей для выбора вычисляемого поля
								})
							);
					});
				};

				let refreshPage = function () {
					$("#work-area-list_field_calculator").children().remove();
					showPage();
				};

				//получение списка полей !!! ОТРАБОТАТЬ СИТУАЦИЮ УДАЛЕННЫХ ПОЛЕЙ
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

						console.log('Уже аругменты: ', getArgFields());
						console.log('Могут быть аругментами: ', getPossibleArgFields());
						console.log('Могут быть вычисляемыми полями: ', getFieldsFreeForResult());

						showPage();

						// навешиваем обработчики на конпки шаблона

						//обработчик удаления формулы
						$(document).on('click', '.'+spanClassName, (e)=>{
							console.log("Готов к удалению формулы в поле с id = ", e.target.id);
							delete calcObj[e.target.id];
							console.log ("После удаления = ", calcObj);
							refreshPage();
							self.saveFormulasObj();
						});

						$(document).on('click', '#add_button', ()=> {
							calcObj[$('#formulaResult option:selected')[0].id] = {
								formula:$('#formulaString')[0].value,
								args:[]
							};
							console.log(calcObj);
							refreshPage();

						});

						$(document).on('click', '#get_formulas', ()=>{});


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

    };

return CustomWidget;
});