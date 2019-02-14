/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("//import changeForm from './changeForm';\r\nlet changeForm = __webpack_require__(/*! ./changeForm */ \"./src/changeForm.js\");\r\nchangeForm();\r\n\r\nlet validateForm = __webpack_require__(/*! ./validateForm */ \"./src/validateForm.js\");\r\nvalidateForm();\r\n\r\nlet inputOnFocuse = __webpack_require__(/*! ./onFocus */ \"./src/onFocus.js\");\r\ninputOnFocuse();\r\n\r\n//    \"build\": \"webpack --config webpack.config.js\"\n\n//# sourceURL=webpack:///./src/app.js?");

/***/ }),

/***/ "./src/changeForm.js":
/*!***************************!*\
  !*** ./src/changeForm.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function changeForm () {\r\n    $(function(){\r\n        $(\"[name='CVF[1677]'],[name='CVF[1234]']\").each(function(index, input){\r\n            var $input = $(input);\r\n            var rep = $(\"<input class='awesome_input'/>\")\r\n                .change(e => e.target.nextSibling.value=e.target.value)\r\n                .addClass('not_error')\r\n                .insertBefore($input);\r\n            $input.hide();\r\n        })\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack:///./src/changeForm.js?");

/***/ }),

/***/ "./src/onFocus.js":
/*!************************!*\
  !*** ./src/onFocus.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function inputOnFocuse () {\r\n    $(function(){\r\n        $(\"input:visible\").focus(function(){\r\n            $(this).removeClass('error').addClass('not_error');\r\n        })\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack:///./src/onFocus.js?");

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\n\n//# sourceURL=webpack:///./src/style.scss?");

/***/ }),

/***/ "./src/validateForm.js":
/*!*****************************!*\
  !*** ./src/validateForm.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function validateForm () {\r\n    $(function(){\r\n        $(\"[type='submit']\").click(function(){\r\n            event.preventDefault();\r\n            var allVisInputs = $(\"input:visible\");\r\n            var allCorrect = true;\r\n            allVisInputs.each (function(index, element) {\r\n                var value = $(element)[0].value;\r\n                if (value === \"\") {\r\n                    flag = false;\r\n                    $(element).removeClass('not_error').addClass('error');\r\n                };\r\n            });\r\n            return allCorrect;\r\n        })\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack:///./src/validateForm.js?");

/***/ }),

/***/ 0:
/*!*******************************************!*\
  !*** multi ./src/app.js ./src/style.scss ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/app.js */\"./src/app.js\");\nmodule.exports = __webpack_require__(/*! ./src/style.scss */\"./src/style.scss\");\n\n\n//# sourceURL=webpack:///multi_./src/app.js_./src/style.scss?");

/***/ })

/******/ });