$(document).ready(function(){
    var index = 2;
    var cardsTable = document.getElementById('cards-table');
    $('#add-flashcard').click(() => {
        var itm = document.getElementById("card");
        var row = itm.cloneNode(true);
        cardsTable.appendChild(row);
        var deleteButton = document.getElementsByClassName('delete-card');
        for (let i = 0; i < deleteButton.length; i++) {
            const element = deleteButton[i];
            element.addEventListener('click', () => {
                element.parentElement.parentElement.remove();
            })
        }
    });
});