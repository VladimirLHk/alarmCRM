module.exports = function changeForm () {
    $(function(){
        $("[name='CVF[1677]'],[name='CVF[1234]']").each(function(index, input){
            var $input = $(input);
            var rep = $("<input class='awesome_input'/>")
                .change(e => e.target.nextSibling.value=e.target.value)
                .addClass('not_error')
                .insertBefore($input);
            $input.hide();
        })
    });
}
