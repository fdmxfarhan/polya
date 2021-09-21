$(document).ready(function(){
    var sampleIndex = parseInt(document.getElementById('cnt').textContent);
    var cnt = sampleIndex;
    var deleteButton = document.getElementsByClassName('delete-card');
    for (let i = 0; i < deleteButton.length; i++) {
        const element = deleteButton[i];
        element.addEventListener('click', () => {
            element.parentElement.parentElement.remove();
        })
    }

    var deck = []
    for(var i=0; i<cnt; i++){
        deck.push({
            pictureButton: $(`#change-to-picture${i}`), 
            textButton: $(`#change-to-text${i}`), 
            fileQuestion: $(`#fileQuestion${i}`), 
            fileAnswer: $(`#fileAnswer${i}`), 
            question: $(`#question${i}`), 
            answer: $(`#answer${i}`), 
            imgQuestion: $(`#imgQuestion${i}`), 
            imgAnswer: $(`#imgAnswer${i}`), 
            type: document.getElementById(`type${i}`), 
        });
    }
    var cardEvents = (card) => {
        card.pictureButton.click(() => {
            card.question.hide()
            card.answer.hide()
            card.fileQuestion.show()
            card.fileAnswer.show()
            card.pictureButton.hide()
            card.textButton.show()
            card.type.setAttribute('value', 'picture');
            card.imgQuestion.show();
            card.imgAnswer.show();
        });
        card.textButton.click(() => {
            card.question.show()
            card.answer.show()
            card.fileQuestion.hide()
            card.fileAnswer.hide()
            card.pictureButton.show()
            card.textButton.hide()
            card.type.setAttribute('value', 'text');
            card.imgQuestion.hide();
            card.imgAnswer.hide();
        });
    }
    deck.forEach(card => cardEvents(card));
    var index = 2;
    var cardsTable = document.getElementById('cards-table');
    $('#add-flashcard').click(() => {
        var itm = document.getElementById("card");
        var row = itm.cloneNode(true);
        row.classList.remove("hidden");
        cardsTable.appendChild(row);
        var deleteButton = document.getElementsByClassName('delete-card');
        console.log(row.childNodes)
        row.childNodes[3].childNodes[1].id = `fileQuestion${cnt}`;
        row.childNodes[4].childNodes[1].id = `fileAnswer${cnt}`;
        row.childNodes[3].childNodes[1].name = `fileQuestion${cnt}`;
        row.childNodes[4].childNodes[1].name = `fileAnswer${cnt}`;
        row.childNodes[3].childNodes[2].id = `question${cnt}`;
        row.childNodes[4].childNodes[2].id = `answer${cnt}`;
        row.childNodes[3].childNodes[2].name = `question${cnt}`;
        row.childNodes[4].childNodes[2].name = `answer${cnt}`;
        row.childNodes[6].childNodes[1].id = `change-to-picture${cnt}`;
        row.childNodes[6].childNodes[2].id = `change-to-text${cnt}`;
        row.childNodes[2].textContent = cnt+1;
        row.childNodes[1].childNodes[1].id = `type${cnt}`;
        row.childNodes[1].childNodes[1].name = `type${cnt}`;
        
        for (let i = 0; i < deleteButton.length; i++) {
            const element = deleteButton[i];
            element.addEventListener('click', () => {
                element.parentElement.parentElement.remove();
            })
        }
        cardEvents({
            pictureButton: $(`#change-to-picture${cnt}`), 
            textButton: $(`#change-to-text${cnt}`), 
            fileQuestion: $(`#fileQuestion${cnt}`), 
            fileAnswer: $(`#fileAnswer${cnt}`), 
            question: $(`#question${cnt}`), 
            answer: $(`#answer${cnt}`), 
            type: document.getElementById(`type${cnt}`), 
        })
        document.getElementById('numberOfCards').setAttribute('value', cnt);
        cnt++;
    });
});