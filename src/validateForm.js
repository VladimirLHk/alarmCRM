module.exports = function validateForm () {
    $(function(){
        $("[type='submit']").click(function(){
            event.preventDefault();
            var allVisInputs = $("input:visible");
            var allCorrect = true;
            allVisInputs.each (function(index, element) {
                var value = $(element)[0].value;
                if (value === "") {
                    flag = false;
                    $(element).removeClass('not_error').addClass('error');
                };
            });
            return allCorrect;
        })
    });
}
