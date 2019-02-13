var getZSign = require ("../src/main");

let inputArr = [
    'Я родился 28-05 на другой планете',
    '2-2',
    '12-',
    '-3',
    '31-03',
    '30-22',
    '31-04',
    '-3-8',
    '56-88',
    'Something nothing'
];

inputArr.map((value)=> {
    console.log('Введена строка: ', value);
    console.log('Результат обработки: ', '\n', getZSign(value), '\n');
})

