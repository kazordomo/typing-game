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
let topAllTitle = getElementClass('top-all-title')[0];
let topTodayTitle = getElementClass('top-today-title')[0];
let leaderBoardSlider = getElementClass('leaderboard-slider')[0];

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
//onLoad?
userAndStats.style.marginLeft = '-100%';
leaderBoardSlider.style.marginLeft = '0%';
let openMenu = (element) => {
    let elementClass = element.className;
    element.addEventListener('click', function() {
        if(userAndStats.style.marginLeft != '-100%') {
            element.className = elementClass;
            userAndStats.style.marginLeft = '-100%';
        } else {
            element.className = 'fa fa-times';
            userAndStats.style.marginLeft = '0%';
        }
    });
}

topAllTitle.addEventListener('click', function() {
    leaderBoardSlider.style.marginLeft = '0%';
    topTodayTitle.classList.remove('active');
    topAllTitle.classList.add('active');
});
topTodayTitle.addEventListener('click', function() {
    leaderBoardSlider.style.marginLeft = '-100%';
    topAllTitle.classList.remove('active');
    topTodayTitle.classList.add('active');
});


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
$(document).ready(function() {

    let topToday = getElementClass('topToday')[0];
    let topAll = getElementClass('topAll')[0];
    let information = getElementClass('information')[0];
    let topFive = getElementClass('topFive-table')[0];
    let userName = getElementClass('user-name')[0];
    let createWpm = document.createElement("div");
    let createGamesPlayed = document.createElement("div");
    let createSkillLevel = document.createElement("div");
    let userScore = getElementId('userScore');
    let leaderboardScore = getElementId('leaderboardScore');
    let topTodayScore = getElementId('top-today-score');

    let initTopList = (list, table) => {
        // leaderboardScore.appendChild(createTr);
        for(let i = 0; i < list.length; i++) {
            //create element inside the loop to get a unique element each loop
            let createTr = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let td4 = document.createElement('td');

            table.appendChild(createTr);
            createTr.appendChild(td1);
            createTr.appendChild(td2);
            createTr.appendChild(td3);
            createTr.appendChild(td4);

            td1.innerHTML = (i + 1) + ': ';
            td2.innerHTML = list[i].name;
            td3.innerHTML = list[i].score;
            td4.innerHTML = list[i].date;
        }
    };

    $.ajax({
        url: '/score',
        contentType: 'application/json',
        success: function(response) {
            // addToView(response);
            initTopList(response.topAll, leaderboardScore);
            initTopList(response.topToday, topTodayScore);
            initTopList(response.userTopFive, userScore);
            // initTopList(response.topToday, topToday);
            information.appendChild(createWpm);
            information.appendChild(createGamesPlayed);
            information.appendChild(createSkillLevel);
            userName.innerHTML = response.name.toUpperCase() + ', ' + '<i>' + response.userTitle + '</i>';
            // createWpm.style.position = 'relative';
            createWpm.innerHTML = response.userWpm + ' AVERAGE WPM' + '<span class="wpm-info"><i class="fa fa-info-circle" aria-hidden="true"></i><span class="wpm-info-text">' + response.wpm + ' wpm is the average among all players' + '</span></span>';
            createGamesPlayed.innerHTML = response.userGamesPlayed + ' GAMES PLAYED';
            createSkillLevel.innerHTML = 'GOOD AS F**K';
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
                createWpm.innerHTML = response.userWpm;
                // addToView(response);
                scoreInput.val(null);
            }
        });
    });

});













