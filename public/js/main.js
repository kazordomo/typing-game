let en_words = [
    "hello",
    "no",
    "maybe",
    "fruits",
    "fingers",
    "cloud",
    "computer",
    "foot",
    "monitor",
    "food",
    "go",
    "mum",
    "shallow",
    "cup",
    "of",
    "tea",
    "race",
    "bottle",
    "finger",
    "arm",
    "stomach",
    "lamp",
    "clock",
    "and",
    "know",
    "mountain",
    "fish",
    "ask",
    "fool",
    "mobile",
    "television",
    "star",
    "paper",
    "bag",
    "doll",
    "mouse",
    "crush",
    "more",
    "five",
    "glitch",
    "journey"
];

let getElementId = (element) =>  {
    return document.getElementById(element);
};
let getElementClass = (elements) => {
    return document.getElementsByClassName(elements);
};

let words = en_words;
let refresh = getElementId('refresh');
let typingArea = getElementId('typing-area');
let showScore = getElementClass('score');
let word = getElementClass('word');
let leaderboard = getElementClass('leaderboard-wrapper')[0];
let fade = getElementClass('fade')[0];
let timeCounter = getElementId('time-counter');
let submitScore = getElementId('submit-score');
let scoreForm = getElementId('score-form');
let openLeaderboard = getElementId('open-leaderboard');
let closeLeaderboard = getElementId('close-leaderboard');
let submitButton = getElementId('submit-button');

let counter = 0;
let correct = 0;
let misses = 0;
let keystrokes = 0;
let character = 0;
//used to store the falsy character
let errorChar = 0;
let timer = 0;

//shuffle the words
let shuffle = (arr) => {
    for (let i = arr.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
    }
    return arr;
};

words = shuffle(words);
word[0].innerHTML = words[counter];
word[1].innerHTML = words[counter + 1];
word[2].innerHTML = words[counter + 2];
word[3].innerHTML = words[counter + 3];
word[4].innerHTML = words[counter + 4];

openLeaderboard.addEventListener('click', function() {
    leaderboard.style.display = 'block';
    fade.style.display = 'block';
});

closeLeaderboard.addEventListener('click', function() {
    leaderboard.style.display = 'none';
    fade.style.display = 'none';

});

//store global to make it clearable
let start;
let startTimer = (duration, element) => {
    timer = duration;
    element.innerHTML = timer;
    start = setInterval(() => {
        timer--;
        if(timer === 0) {
            clearInterval(start);
            // resets
            element.innerHTML = "GAME!";
            typingArea.disabled = true;
            typingArea.value = 'Press ENTER to restart';
            for (let i = 0; i < word.length; i++) {
                word[i].style.display = 'none';
            }
            for(let i = 0; i < showScore.length; i++) {
                showScore[i].style.display = 'block';
            }
            showScore[0].innerHTML = correct + ' correct words!';
            showScore[1].innerHTML = misses + (misses == 1 ? ' wrong word. ' : ' wrong words. ');
            showScore[2].innerHTML = keystrokes + ' total keystrokes.';
            showScore[0].style.color = "#27C42A";
            showScore[1].style.color = "#DE1D1D";
            typingArea.style.border = '3px solid transparent';
            submitScore.value = correct;
            //TODO: ajax
            // scoreForm.addEventListener('submit', function(e) {
            //     e.preventDefault();
            // });
            //this is needed to invoke the submit. .submit() do not work.
            submitButton.click();
        } else
            element.innerHTML = timer;
    }, 1000);
};

//check if the word that is typed is correct
let spellChecker = () => {
    if(typingArea.value == word[0].innerHTML) {
        counter++;
        correct++;
    } else {
        misses++;
        counter++;
        typingArea.style.border = '3px solid #DE1D1D';
    }
    typingArea.value = '';
    character = 0;
    word[0].innerHTML = words[counter];
    word[1].innerHTML = words[counter + 1];
    word[2].innerHTML = words[counter + 2];
    word[3].innerHTML = words[counter + 3];
    word[4].innerHTML = words[counter + 4];
};

let resetAll = () => {
    clearInterval(start);
    shuffle(words);
    typingArea.disabled = false;
    typingArea.value = '';
    for(let i = 0; i < showScore.length; i++) {
        showScore[i].style.display = 'none';
    }
    for(let i = 0; i < word.length; i++) {
        word[i].style.display = 'block';
    }
    counter = 0;
    correct = 0;
    misses = 0;
    keystrokes = 0;
    character = 0;
    word[0].innerHTML = words[counter];
    word[1].innerHTML = words[counter + 1];
    word[2].innerHTML = words[counter + 2];
    word[3].innerHTML = words[counter + 3];
    word[4].innerHTML = words[counter + 4];
    typingArea.focus();
    timeCounter.innerHTML = '';
    typingArea.style.border = '3px solid transparent';
    timer = 0;
};

//reset stats and timer when refresh is clicked
refresh.addEventListener("click", resetAll);

//reset game with "enter"
document.onkeydown = (e) => {
    if (e.keyCode == 13) {
        resetAll();
        //prevent page reload
        e.preventDefault();
    }
};

typingArea.onkeydown = (e) => {
    //instead of space, reset the typing area
    typingArea.value=typingArea.value.replace(/\s+/g,'');

    if(timer > 0 || timer === 0) {
        if((e.keyCode >= 65 && e.keyCode <= 95) || e.keyCode == 8 || e.keyCode == 32) {
            keystrokes++;
            if(timer === 0) {
                startTimer(5, timeCounter);
            }
            if(e.keyCode === 8) {
                character--;
                if(word[0].innerHTML.charAt(character- 1) == typingArea.value.charAt(character - 1)){
                    typingArea.style.border = '3px solid transparent';
                }
            } else {
                if(e.keyCode === 32){
                    spellChecker();
                } else {
                    character++;
                }
            }
        }
    }
};

typingArea.onkeyup = (e) => {
    if(timer > 0) {
        if(typingArea.value == '')
            character = 0;
        if(e.keyCode !== 32) {
            if (word[0].innerHTML.charAt(character - 1) != typingArea.value.charAt(character - 1)) {
                typingArea.style.border = '3px solid #DE1D1D';
                errorChar = character - 1;
            }
            else if(word[0].innerHTML.charAt(errorChar) == typingArea.value.charAt(errorChar)){
                typingArea.style.border = '3px solid transparent';
            }
        }
    }
};

/* AJAX
 ------------------------------------------------------------*/

$('#score-form').on('submit', function(event) {
    event.preventDefault();

    let scoreInput = $('#submit-score');

    $.ajax({
        url: '/game',
        method: 'POST',
        contentType: 'application/json',
        //parse score to int to prevent it to covert to a string.
        data: JSON.stringify({ score: parseInt(scoreInput.val(), 10) }),
        success: function(response) {
            console.log(response);
            scoreInput.val(null);
            // addTest(response);
        }
    })
})

//TODO: get the score.topToday/score.topAll and add to the view
let addTest = (score) => {

}













