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
    "journey",
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
    "journey",
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
let openLeaderboard = getElementId('open-leaderboard');
let closeLeaderboard = getElementId('close-leaderboard');
let submitButton = getElementId('submit-button');

let counter = 0;
let correct = 0;
let misses = 0;
let keystrokes = 0;
let character = 0;
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
    if (e.keyCode == 13 && leaderboard.style.display != 'block') {
        resetAll();
        //prevent page reload
        e.preventDefault();
    }
};

let keyPress = {
    down: (e) => {
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
                    if(word[0].innerHTML.slice(0, character) == typingArea.value.slice(0, character)){
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
    },
    up: (e) => {
        if(timer > 0) {
            if(typingArea.value == '')
                character = 0;
            if(e.keyCode !== 32) {
                if (word[0].innerHTML.slice(0, character) != typingArea.value.slice(0, character)) {
                    typingArea.style.border = '3px solid #DE1D1D';
                }
                else if(word[0].innerHTML.slice(0, character) == typingArea.value.slice(0, character)){
                    typingArea.style.border = '3px solid transparent';
                }
            }
        }
    }
};

typingArea.onkeydown = (e) => {
    keyPress.down(e);
};

typingArea.onkeyup = (e) => {
    keyPress.up(e);
};

/* AJAX
 ------------------------------------------------------------*/
let userTodayScore = getElementClass('top-today-score');
let userAllScore = getElementClass('top-all-score');
let addToView = (score) => {
    for(let i = 0; i < score.topToday.length; i++) {
        userTodayScore[i].innerHTML = (i + 1) + '. ' + score.topToday[i].name + ' ' + score.topToday[i].score + ' (wpm)';
    }
    for(let i = 0; i < score.topAll.length; i++) {
        userAllScore[i].innerHTML = (i + 1) + '. ' + score.topAll[i].name + ' ' + score.topAll[i].score + ' (wpm)';
    }
};

$(document).ready(function() {

    /**
     * - the get request populates the leaderboard when the page is loaded.
     * - the post request post the score and gets back the top 10 of today/all
     *   from the server-side. it then populates the view with the same function as get.
     */

    $.ajax({
        url: '/leaderboard',
        contentType: 'application/json',
        success: function(response) {
            addToView(response);
        }
    });

    $('#score-form').on('submit', function(event) {
        event.preventDefault();

        let scoreInput = $('#submit-score');

        $.ajax({
            url: '/leaderboard',
            method: 'POST',
            contentType: 'application/json',
            //parse score to int to prevent it to covert to a string.
            data: JSON.stringify({ score: parseInt(scoreInput.val(), 10) }),
            success: function(response) {
                addToView(response);
                scoreInput.val(null);
            }
        });
    });

});













