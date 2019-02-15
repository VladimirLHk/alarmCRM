let $ = require('jquery');
module.exports = function inputOnFocuse () {
    $(function(){
        $("input:visible").focus(function(){
            $(this).removeClass('error').addClass('not_error');
        })
    });
}
