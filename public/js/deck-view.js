$(document).ready(function(){
    $('#answer').hide()
    $('#reveal-ans').click(() => {
        $('#question').hide()
        $('#answer').show()
        $('#reveal-ans').hide()
        $('#score-btn.hidden').show()
    });
    
});