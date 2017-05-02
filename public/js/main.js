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
let submitWrong = getElementId('submit-wrong');
let submitButton = getElementId('submit-button');
let userAndStats = getElementId('user-and-stats');
let leaderboard = getElementId('leaderboard');
let openUserProfile = getElementId('open-user-profile');
let openLeaderboard = getElementId('open-leaderboard');
let leaderBoardSlider = getElementClass('leaderboard-slider')[0];
let toggleLeaderBoard = getElementClass('toggle-leaderboard');

let yellowColor = '#EFDC05';
let redColor = '#E53A40';
// let blueColor = '#30A9DE';
let greenColor = '#0DD442';

let counter = 0;
let correct = 0;
let wrong = 0;
let keystrokes = 0;
let character = 0;
let timer = 0;
let start = null;

/* CHART SECTION
------------------------------------------------------------*/
let context = getElementId('words-chart').getContext('2d');
let context2 = getElementId('wpm-chart').getContext('2d');

//CREATE A CLASS TO INIT THE CHARTS

let chartDataWords = {
    labels: [
        'Correct words',
        'Wrong words'
    ],
    datasets: [
        {
            data: [0, 0],
            backgroundColor: [
                greenColor,
                redColor,
            ],
            borderColor: [
                "#fff",
                "#fff"
            ],
        }]
};

let chartDataWpm = {
    labels: [
        'Your wpm',
        'Players wpm'
    ],
    datasets: [
        {
            data: [0, 0],
            backgroundColor: [
                yellowColor,
                redColor,
            ],
            borderColor: [
                "#fff",
                "#fff"
            ],
        }]
};
/* END OF CHART SECTION
------------------------------------------------------------- */

/*  MENU SECTION
------------------------------------------------------------*/
//onLoad?
userAndStats.style.marginLeft = '-100%';
leaderboard.style.marginLeft = '-100%';
let openMenu = (element, section) => {
    let elementClass = element.className;
    element.addEventListener('click', function() {
        if(section.style.marginLeft != '-100%') {
            element.className = elementClass;
            section.style.marginLeft = '-100%';
        } else {
            element.className = 'fa fa-times';
            section.style.marginLeft = '0%';
        }
    });
};

openMenu(openUserProfile, userAndStats);
openMenu(openLeaderboard, leaderboard);

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

let multipleCss = (classGroup, style) => {
    for(let i = 0; i < classGroup.length; i++) {
        classGroup[i].style.display = style;
    }
};

words = shuffle(words);

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
            showScore[1].innerHTML = wrong + (wrong == 1 ? ' wrong word. ' : ' wrong words. ');
            showScore[2].innerHTML = keystrokes + ' total keystrokes.';
            showScore[0].style.color = greenColor;
            showScore[1].style.color = redColor;
            typingArea.style.border = '3px solid transparent';
            submitScore.value = correct;
            submitWrong.value = wrong;
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
        counter++;
        wrong++;
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
    wrong = 0;
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
                    startTimer(10, timeCounter);
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
    let userInformation = getElementClass('user-information')[0];
    let userChart = getElementClass('user-chart')[0];
    let userName = getElementClass('user-name')[0];
    let userScore = getElementId('user-score');
    let topAllScore = getElementId('top-all-score');
    let topTodayScore = getElementId('top-today-score');

    let initTopList = (list, table) => {
        for(let i = 0; i < list.length; i++) {
            //create element inside the loop to get a unique element each loop
            let createTr = document.createElement('tr');
            table.appendChild(createTr);
            //TODO: remove hardcoded property-length
            for(let j = 0; j < 4; j++) {
                createTr.appendChild(document.createElement('td'));
            }

            let td = createTr.getElementsByTagName('td');

            td[0].innerHTML = (i + 1) + ': ';
            td[1].innerHTML = list[i].name;
            td[2].innerHTML = list[i].score;
            td[3].innerHTML = list[i].date;
        }
    };

    let updateTopList = (list, table) => {
        for(let i = 0; i < list.length; i++) {
            //i + 1 to avoid tr with th
            let row = table.getElementsByTagName('tr')[i + 1];
            //throws an undefined error. length - 1 wrong?
            let td = row.getElementsByTagName('td');

            td[0].innerHTML = (i + 1) + ': ';
            td[1].innerHTML = list[i].name;
            td[2].innerHTML = list[i].score;
            td[3].innerHTML = list[i].date;
        }
    };

    let initUserInformation = (response, create) => {
        if(create) {
            for(let i = 0; i < 4; i++) {
                userInformation.appendChild(document.createElement('div'));
            }
        }
        let div = userInformation.getElementsByTagName('div');
        div[0].innerHTML = response.userWpm + ' AVERAGE WPM';
        div[1].innerHTML = response.userGamesPlayed + ' GAMES PLAYED';
        div[2].innerHTML = response.userRightWords + ' TOTAL CORRECT WORDS';
        div[3].innerHTML = response.userWrongWords + ' TOTAL WRONG WORDS';

        chartDataWords.datasets[0].data[0] = response.userRightWords;
        chartDataWords.datasets[0].data[1] = response.userWrongWords;
        chartDataWpm.datasets[0].data[0] = response.userWpm;
        chartDataWpm.datasets[0].data[1] = response.wpm;

        let wordsChart = new Chart(context,{
            type: 'pie',
            data: chartDataWords,
            options: {
                legend: {
                    display: false
                }
            }
        });

        let wpmChart = new Chart(context2,{
            type: 'pie',
            data: chartDataWpm,
            options: {
                legend: {
                    display: false
                }
            }
        });
    };

    $.ajax({
        url: '/score',
        contentType: 'application/json',
        success: function(response) {
            initTopList(response.topAll, topAllScore);
            initTopList(response.topToday, topTodayScore);
            initTopList(response.userTopFive, userScore);
            userName.innerHTML = response.name.toUpperCase() + ', ' + '<i>' + response.userTitle + '</i>';
            initUserInformation(response, true);
        }
    });

    $('#score-form').on('submit', function(event) {
        event.preventDefault();

        let scoreInput = $('#submit-score');
        let wrongInput = $('#submit-wrong');

        $.ajax({
            url: '/score',
            method: 'POST',
            contentType: 'application/json',
            //parse score to int to prevent it to covert to a string.
            data: JSON.stringify({ score: parseInt(scoreInput.val(), 10), wrong: parseInt(wrongInput.val(), 10)}),
            success: function(response) {
                updateTopList(response.topAll, topAllScore);
                updateTopList(response.topToday, topTodayScore);
                updateTopList(response.userTopFive, userScore);
                userName.innerHTML = response.name.toUpperCase() + ', ' + '<i>' + response.userTitle + '</i>';
                initUserInformation(response, false);
                scoreInput.val(null);
                wrongInput.val(null);
            }
        });
    });

});













