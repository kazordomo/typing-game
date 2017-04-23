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

//VARIABLES

let words = en_words;
let refresh = getElementId('refresh');
let typingArea = getElementId('typing-area');
let showScore = getElementClass('score');
let word = getElementClass('word');
let timeCounter = getElementId('time-counter');
let submitScore = getElementId('submit-score');
let closeLeaderboard = getElementId('close-leaderboard');
let submitButton = getElementId('submit-button');
let userAndStats = getElementId('user-and-stats');
let openLeaderboard = getElementId('open-leaderboard');
let openUserProfile = getElementId('open-user-profile');

let slider = getElementClass('slider')[0];
let goToLeaderboard = getElementClass('go-to-leaderboard')[0];
let goToUser = getElementClass('go-to-user')[0];

let yellowColor = '#EFDC05';
let redColor = '#E53A40';
// let blueColor = '#30A9DE';
let greenColor = '#0DD442';

let counter = 0;
let correct = 0;
let misses = 0;
let keystrokes = 0;
let character = 0;
let timer = 0;

/*  MENU SECTION
------------------------------------------------------------*/

//TODO: If player is logged in, show user icon and have leaderboard avaible within the menu.
//TODO: If player is guest, show leaderboard icon and open leaderboard directly.

let openMenu = (element) => {
    let elementClass = element.className;
    element.addEventListener('click', function() {
        if(userAndStats.style.width != '100%') {
            element.className = 'fa fa-times';
            userAndStats.style.width = '100%';
        } else {
            element.className = elementClass;
            userAndStats.style.width = '0';
        }
    });
}

//avoid errors by hiding this logic if the player enters as guest
if(openUserProfile) {
    openMenu(openUserProfile);
} else {
    // openMenu(openLeaderboard);
}

/*  END OF MENU SECTION
 ------------------------------------------------------------*/

let initWords = (arr, element) => {
    for(let i = 0; i < element.length; i++) {
        element[i].innerHTML = arr[counter + i];
    }
};

//shuffle the words
let shuffle = (arr) => {
    for (let i = arr.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
    }
    initWords(arr, word);
    return arr;
};

// let toggleLeaderboard = (mode, property) => {
//     mode.addEventListener('click', () => {
//         leaderboard.style.display = property;
//         fade.style.display = property;
//     });
// };

let multipleCss = (classGroup, style) => {
    for(let i = 0; i < classGroup.length; i++) {
        classGroup[i].style.display = style;
    }
};

words = shuffle(words);
// toggleLeaderboard(openLeaderboard, 'block');
// toggleLeaderboard(closeLeaderboard, 'none');

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
            element.style.color = '#FFFFFF';
            element.innerHTML = "GAME!";
            typingArea.disabled = true;
            typingArea.value = 'Press ENTER to restart';
            multipleCss(showScore, 'block');
            multipleCss(word, 'none');
            showScore[0].innerHTML = correct + ' correct words!';
            showScore[1].innerHTML = misses + (misses == 1 ? ' wrong word. ' : ' wrong words. ');
            showScore[2].innerHTML = keystrokes + ' total keystrokes.';
            showScore[0].style.color = greenColor;
            showScore[1].style.color = redColor;
            typingArea.style.border = '3px solid transparent';
            submitScore.value = correct;
            //this is needed to invoke the submit. .submit() do not work.
            submitButton.click();
        } else {
            if (timer <= 5) {
                element.style.color = redColor;
            } else if (timer <= 10) {
                element.style.color = yellowColor;
            }
            element.innerHTML = timer;
        }
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
        typingArea.style.border = '3px solid ' + redColor;
    }
    typingArea.value = '';
    character = 0;
    initWords(words, word);
};

let resetAll = () => {
    clearInterval(start);
    shuffle(words);
    typingArea.disabled = false;
    typingArea.value = '';
    multipleCss(showScore, 'none');
    multipleCss(word, 'block');
    counter = 0;
    correct = 0;
    misses = 0;
    keystrokes = 0;
    character = 0;
    initWords(words, word);
    typingArea.focus();
    timeCounter.innerHTML = '';
    typingArea.style.border = '3px solid transparent';
    timer = 0;
};

//reset game with "enter"
document.onkeydown = (e) => {
    if (e.keyCode == 13) {
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
                    typingArea.style.border = '3px solid ' + redColor;
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

//reset stats and timer when refresh is clicked
refresh.addEventListener("click", resetAll);

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

    //create a function
    let information = getElementClass('information')[0];
    let createName = document.createElement('div');
    let createEmail = document.createElement('div');
    let createWpm = document.createElement('div');

    $.ajax({
        url: '/score',
        contentType: 'application/json',
        success: function(response) {
            // addToView(response);
            console.log("SENT");
            information.appendChild(createName);
            information.appendChild(createEmail);
            information.appendChild(createWpm);
            createName.innerHTML = response.name.toUpperCase();
            createEmail.innerHTML = response.email.toUpperCase();
            createWpm.innerHTML = response.wpm.toUpperCase();
            console.log(response);
        }
    });

    $('#score-form').on('submit', function(event) {
        event.preventDefault();

        let scoreInput = $('#submit-score');

        $.ajax({
            url: '/score',
            method: 'POST',
            contentType: 'application/json',
            //parse score to int to prevent it to covert to a string.
            data: JSON.stringify({ score: parseInt(scoreInput.val(), 10) }),
            success: function(response) {
                console.log(response);
                createWpm.innerHTML = response.wpm;
                // addToView(response);
                scoreInput.val(null);
            }
        });
    });

});













