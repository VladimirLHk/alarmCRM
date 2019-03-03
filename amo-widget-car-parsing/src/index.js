
// подключаем jq и хелпер (модуль)
define(['jquery', './js/lCardOperating.js'],
  function ($, DealNameOperator) {
  /**
   * @returns {Widget}
   * @constructor
   */
  var Widget = function () {
    var self = this,
        system = self.system;
    var wcode, settings, users, wurl, enabled;

    /**
     * Функция для загрузки шаблонов по из папки templates
     * @param template
     * @param params
     * @param callback
     * @returns {*|boolean}
     */
    self.getTemplate = function (template, params, callback) {
      params = (typeof params === 'object') ? params : {};
      template = template || '';

      return self.render({
        href:  '/templates/' + template + '.twig',
        base_path: wurl, //тут обращение к объекту виджет вернет /widgets/#WIDGET_NAME#
        load: callback, //вызов функции обратного вызова
      }, params) //параметры для шаблона
    };

    /**
     * @type {{render: (function(): boolean), init: (function(): boolean), bind_actions: (function(): boolean), settings: (function(): boolean), onSave: (function(): boolean), destroy: PandoraLoaderWidget.callbacks.destroy}}
     */
    this.callbacks = {
      render: function () {
        wurl = 'https://localhost:8080/amo-widget-car-parsing';
        console.log(self.system().area);
        if (self.system().area === 'lcard') {
          let worker = new DealNameOperator("#person_name");
        }

/*
        wcode = settings.widget_code;

        // Подставляем адрес к локальному серверу или к архиву
        if (FreePackWidgetEnv === 'dev') {
          wurl = 'https://localhost:8080/amo-widget-car-parsing'
        } else {
          wurl = '/upl/' + wcode + '/widget'
        }
        console.log("Работаем!!!");
        widgetHelper("Module");

        let caller = new Active (1000);

        caller.openFlag('Start');
        let i = 0;
        while (!caller.checkInterval() && i<1000) {console.log(i++)};

*/
        return true
      },
      init: function () {
        console.log('init');
        return true
      },
      bind_actions: function () {
        console.log('bind');
        return true
      },
      settings: function () {
        console.log('settings');
        return true
      },
      onSave: function () {
        return true
      },
      destroy: function () {
        console.log('destroy');
        return true
      }
    };
    return this
  };

  return Widget
});
