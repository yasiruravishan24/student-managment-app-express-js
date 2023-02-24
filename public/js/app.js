const today_date = new Date()

$(function() {

    $('#dob-input').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        endDate: today_date.toISOString()
    });

    if($('#dob-input').val() != '') {
        $('#dob-input').trigger("change")
    }

    window.setTimeout(function() {
        $(".alert").fadeTo(1000, 0).slideUp(1000, function(){
            $(this).remove(); 
        });
    }, 10000);
})


$('#dob-input').on('change', function(){

    var dob = new Date($(this).val())

    var diff = today_date.getFullYear() - dob.getFullYear()

    $('#age-input').val(diff)

})

$('#card_no').on('keyup', function(e) {

    var length = $(this).val().length

    if(e.keyCode != 8) {
        if(length == 4 || length == 9 ||length == 14) {
            $(this).val($(this).val() + '-')
        }
    }


})


$('#expire_date').on('keyup', function(e) {

    var length = $(this).val().length

    if(e.keyCode != 8) {
        if(length == 2) {
            $(this).val($(this).val() + '/')
        }
    }
})


$(".keyboard-block").keydown(function(event) {
    return false;
});