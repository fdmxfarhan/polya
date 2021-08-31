$(document).ready(function(){
    $('#add-deck-btn').click(() => {
        $('.black-modal').fadeIn(500);
        $('#add-deck-popup').fadeIn(500);
    });
    $('.black-modal').click(() =>{
        $('.black-modal').fadeOut(500);
        $('#add-deck-popup').fadeOut(500);
    });
    $('.close-popup').click(() =>{
        $('.black-modal').fadeOut(500);
        $('#add-deck-popup').fadeOut(500);
    });
    
});