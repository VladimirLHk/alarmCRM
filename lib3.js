'use strict'
//создани checkbox-a для просмотра пароля и циклическое изменение типа input-а ввода пароля
$(function(){
    $(".showpassword").each(function(index,input) {
        var $input = $(input);
        $("<p class='opt'/>").append(
            $("<input type='checkbox' class='showpasswordcheckbox' id='showPassword' />").click(function() {
                var change = $(this).is(":checked") ? "text" : "password";
                var rep = $("<input type='" + change + "' />")
                    .attr("id", $input.attr("id"))
                    .attr("name", $input.attr("name"))
                    .attr('class', $input.attr('class'))
                    .val($input.val())
                    .insertBefore($input);
                $input.remove();
                $input = rep;
            })
        ).append($("<label for='showPassword'/>").text("Показать пароль")).insertAfter($input.parent());
    });
});

// гасится предупреждение о не введенном имени
$('#login').focus(function(){
    $( "#warn_msg" ).fadeOut(1000);
});

//проверки перед отправкой формы
$( "#login_form" ).submit(function( event ) {
    if ( $( "#login" ).val() === "" ) {
        $( "#warn_msg" ).text( "Не введено имя" ).show();
        event.preventDefault();
    } else {
        //здесь будут проверки на корректность введенных имени и пароля
        $( "#login_form" ).submit()
    }
});