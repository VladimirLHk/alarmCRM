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

				let spanClassName = 'delete_button'; //селектор кнопки удаления, для навешивания обработчиков на все кнопки

				let numericFieldsNames = {}; //все вычисляемые поля в сделках; ключ = id поля, значение = имя поля

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

					//отрисовываем шаблон

					self.getTemplate({}, function(data){
						$("#work-area-list_field_calculator")
							.append(data.render({
									params : templatesFormula, // массив объектов для формирования строк формул
									spanClass : spanClassName // селектор внопки удаления
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

						showPage();

						// навешиваем обработчики на конпки шаблона

						$(document).on('click', '.'+spanClassName, (e)=>{
							console.log("Готов к удалению формулы в поле с id = ", e.target.id);
							delete calcObj[e.target.id];
							console.log ("После удаления = ", calcObj);
							refreshPage();
						});

						$(document).on('click', '#add_button', ()=> {
							/*	 self.set_settings({formulas:calcObj}); //создается свойство с именем par1 и значением text

											$.post ("https://clevertoys.amocrm.ru/api/ajax/wigets/edit",
                                                    {
                                                        'widget_active': "Y",
                                                        'code' : '"list_field_calculator"',
                                                        'settings[login': '',
                                                        'settings[formulas]': 'str'
                                                    });
                                                let a = self.get_settings();// в ответ придет массив с уже созданным свойством
                                                */
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
    };

return CustomWidget;
});