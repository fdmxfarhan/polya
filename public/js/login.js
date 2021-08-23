$(document).ready(function(){
    if($('#email-input').val() == ''){
        $('#email-label').css('top', '0.5vw');
        $('#email-label').css('right', '3%');
        $('#email-label').css('font-size', '1.1vw');
    }
    $('#email-input').focus(() => {
        $('#email-label').css('top', '-1.5vw');
        $('#email-label').css('right', '0');
        $('#email-label').css('font-size', '0.9vw');
    });
    $('#email-input').focusout(() => {
        if($('#email-input').val() == ''){
            $('#email-label').css('top', '0.5vw');
            $('#email-label').css('right', '3%');
            $('#email-label').css('font-size', '1.1vw');
        }
    });

    if($('#pass-input').val() == ''){
        $('#pass-label').css('top', '0.5vw');
        $('#pass-label').css('right', '3%');
        $('#pass-label').css('font-size', '1.1vw');
    }
    $('#pass-input').focus(() => {
        $('#pass-label').css('top', '-1.5vw');
        $('#pass-label').css('right', '0');
        $('#pass-label').css('font-size', '0.9vw');
    });
    $('#pass-input').focusout(() => {
        if($('#pass-input').val() == ''){
            $('#pass-label').css('top', '0.5vw');
            $('#pass-label').css('right', '3%');
            $('#pass-label').css('font-size', '1.1vw');
        }
    });

    $('#login-btn').click(() => {
        $('.black-modal').fadeIn(500);
        $('#login-popup').fadeIn(500);
    });
    $('#login-btn2').click(() => {
        $('.black-modal').fadeIn(500);
        $('#login-popup').fadeIn(500);
        $('#register-popup').fadeOut(500);
    });
    $('.close-login').click(() => {
        $('.black-modal').fadeOut(500);
        $('#login-popup').fadeOut(500);
    });
    $('.black-modal').click(() => {
        $('.black-modal').fadeOut(500);
        $('#login-popup').fadeOut(500);
        $('#register-popup').fadeOut(500);
    });
    
    $('#register-btn').click(() => {
        $('.black-modal').fadeIn(500);
        $('#register-popup').fadeIn(500);
        $('#login-popup').fadeOut(500);
    });
    
    $('#register-btn2').click(() => {
        $('.black-modal').fadeIn(500);
        $('#register-popup').fadeIn(500);
        $('#login-popup').fadeOut(500);
    });
    $('.close-register').click(() => {
        $('.black-modal').fadeOut(500);
        $('#register-popup').fadeOut(500);
    });
    

});