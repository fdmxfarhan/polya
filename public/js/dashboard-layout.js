$(document).ready(function(){
    $('#setting-btn').click(() => {
        $('.transparent-modal').show();
        $('#setting').fadeIn(500);
    });
    $('.transparent-modal').click(() => {
        $('.transparent-modal').hide();
        $('#setting').fadeOut(400);
    });
    $('.close-success-msg').click(() => {
        $('.success-msg').slideUp(500);
    });
    $('.close-notif-msg').click(() => {
        $('.notif-msg').slideUp(500);
    });

    $('#add-class-btn').click(() => {
        $('.black-modal').fadeIn(500);
        $('#add-class-popup').fadeIn(500);
    });
    $('#add-class-btn2').click(() => {
        $('.black-modal').fadeIn(500);
        $('#add-class-popup').fadeIn(500);
    });
    $('.close-popup').click(() => {
        $('.black-modal').hide();
        $('#add-class-popup').hide();
        $('#add-icon-popup').hide();
    });
    $('.black-modal').click(() => {
        $('.black-modal').hide();
        $('#add-class-popup').hide();
        $('#add-icon-popup').hide();
    });
    $('#choose-icon').click(() => {
        $('#add-class-popup').hide();
        $('#add-icon-popup').fadeIn(500);
    });

    $('i.class-icon').click(() => {
        alert('clicked');
        this.addClass('active')
    });


    var icons = [
        'fa-home',
        'fa-tv',
        'fa-globe',
        'fa-certificate',
        'fa-lightbulb-o',
        'fa-gears',
        'fa-deviantart',
        'fa-pinterest',
        'fa-laptop',
        'fa-clock-o',
        'fa-calculator',
        'fa-soccer-ball-o',
        'fa-database',
        'fa-car',
        'fa-black-tie',
        'fa-graduation-cap',
        'fa-book',
        'fa-flag',
        'fa-cloud',
        'fa-yelp',
        'fa-plug',
        'fa-paypal',
        'fa-cart-plus',
        'fa-skyatlas',
        'fa-diamond',
    ];

    icons.forEach(icon => {
        $('.'+icon).click(() => {
            // alert('clicked ' + icon);
            document.getElementById("iconElement").setAttribute('value', icon);
            // document.getElementById("iconElement").value = icon;
            for (let i = 0; i < icons.length; i++) $('i.'+icons[i]).removeClass('active');
            $('i.'+icon).addClass('active');
        });
    });




    $('.side-bar-collapse-btn').click(() => {
        $('#dashboard-sidebar-menu').fadeIn(500);
        $('.side-bar-modal').fadeIn(500);
    });
    $('.side-bar-modal').click(() => {
        $('#dashboard-sidebar-menu').fadeOut(500);
        $('.side-bar-modal').fadeOut(500);
    })
});