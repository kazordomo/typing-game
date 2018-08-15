let words = en_words;
const typingArea = getElementId('typing-area');
const showScore = getElementClass('score');
const word = getElementClass('word');
const timeCounter = getElementId('time-counter');
const submitScore = getElementId('submit-score');
const submitWrong = getElementId('submit-wrong');
const submitButton = getElementId('submit-button');
const menuWrapper = getElementClass('menu')[0];
const userAndStats = getElementId('user-and-stats');
const leaderboard = getElementId('leaderboard');
const openUserProfile = getElementId('open-user-profile');
const openLeaderboard = getElementId('open-leaderboard');
const closeSection = getElementClass('close');

const gameStats = { 
    correct: 0, 
    wrong: 0, 
    keystrokes: 0,  
};

let counter = 0;
let character = 0;
let timer = 0;
let start = null;

const init = () => {
    words = shuffle(words);
    initEventListener();
    initMenu();
    initOnKeyEvent();
}

const openMenu = (element, section) => {
    element.addEventListener('click', () => {
        menuWrapper.style.marginRight = '-200px';
        section.style.marginLeft = '0%';
    });
};

const close = (element, section) => {
    element.addEventListener('click', () => {
        section.style.marginLeft = '-100%';
        menuWrapper.style.marginRight = '0px';
    });
};

const initWords = (arr, element) => {
    //TODO: .shift()
    Array.from(element).forEach((item, index) => 
        item.innerHTML = arr[counter + index]);
}

const shuffle = arr => {
    const newArr = arr;
    for (let i = arr.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
    }
    initWords(newArr, word);
    return newArr;
};

const multipleCss = (classGroup, style) => 
    Array.from(classGroup).forEach(item => item.style.display = style);

const startTimer = (duration, element) => {
    timer = duration;
    element.innerHTML = timer;
    start = setInterval(() => {
        timer--;
        if(timer === 0) {
            onGameOver(element);
        } else {
            if (timer <= 5)
                element.style.color = appColors.red;
            else if (timer <= 10)
                element.style.color = appColors.yellow;

            element.innerHTML = timer;
        }
    }, 1000);
};

const handleShowScore = () => {
    const { correct, wrong, keystrokes } = gameStats;

    showScore[0].innerHTML = correct + ' correct words!';
    showScore[1].innerHTML = wrong + (wrong == 1 ? ' wrong word. ' : ' wrong words. ');
    showScore[2].innerHTML = keystrokes + ' total keystrokes.';
    showScore[0].style.color = appColors.green;
    showScore[1].style.color = appColors.red;
}

const handleTypingArea = () => {
    typingArea.disabled = true;
    typingArea.value = 'Press ENTER to restart';
    typingArea.style.border = '3px solid transparent';
}

const handleSubmitButtonClick = () => {
    submitScore.value = gameStats.correct;
    submitWrong.value = gameStats.wrong;
    submitButton.click();
}

const onGameOver = element => {
    clearInterval(start);
    element.style.color = '#FFFFFF';
    if(gameStats.wrong === 0 && gameStats.correct)
        element.innerHTML = 'PERFECT GAME!';
    else
        element.innerHTML = '';

    multipleCss(showScore, 'block');
    multipleCss(word, 'none');
    handleTypingArea();
    handleShowScore();
    handleSubmitButtonClick();
}

const spellChecker = () => {
    if(typingArea.value == word[0].innerHTML)
        gameStats.correct++;
    else {
        gameStats.wrong++;
        typingArea.style.border = '3px solid ' + appColors.red;
    }
    
    counter++;
    character = 0;
    typingArea.value = '';
    initWords(words, word);
};

const resetAll = () => {
    clearInterval(start);
    
    character = 0;
    timer = 0;
    timeCounter.innerHTML = '';
    timeCounter.style.color = "#FFFFFF";

    shuffle(words);
    multipleCss(showScore, 'none');
    multipleCss(word, 'block');
    resetTypingArea();
    Object.keys(gameStats).forEach(prop => gameStats[prop] = 0);
};

const resetTypingArea = () => {
    typingArea.disabled = false;
    typingArea.value = '';
    typingArea.focus();
    typingArea.style.border = '3px solid transparent';
}

const onKeyPressDown = e => {
    typingArea.value=typingArea.value.replace(/\s+/g,'');

    if((e.keyCode >= 65 && e.keyCode <= 95) || e.keyCode == 8 || e.keyCode == 32) {
        gameStats.keystrokes++;
        if(timer === 0)
            startTimer(5, timeCounter);
        if(e.keyCode === 8) {
            character--;
            if(word[0].innerHTML.slice(0, character) == typingArea.value.slice(0, character))
                typingArea.style.border = '3px solid transparent';
        } else {
            if(e.keyCode === 32)
                spellChecker();
            else
                character++;
        }
    }
}

const onKeyPressUp = e => {
    if(timer <= 0)
        return;

    if(typingArea.value == '')
        character = 0;

    if(e.keyCode === 32)
        return;
        
    if (word[0].innerHTML.slice(0, character) != typingArea.value.slice(0, character)) {
        typingArea.style.border = '3px solid ' + appColors.red;
    }
    else if(word[0].innerHTML.slice(0, character) == typingArea.value.slice(0, character)){
        typingArea.style.border = '3px solid transparent';
    }
}

const initEventListener = () =>
    getElementId('refresh').addEventListener("click", resetAll);

const initMenu = () => {
    userAndStats.style.marginLeft = '-100%';
    leaderboard.style.marginLeft = '-100%';
    
    close(closeSection[0], userAndStats);
    close(closeSection[1], leaderboard);
    if(openUserProfile)
        openMenu(openUserProfile, userAndStats);
    openMenu(openLeaderboard, leaderboard);
}

const initOnKeyEvent = () => {
    document.onkeydown = (e) => {
        if (e.keyCode == 13) {
            resetAll();
            e.preventDefault();
        }
    };   
    typingArea.onkeydown = e => {
        onKeyPressDown(e);
    };
    typingArea.onkeyup = e => {
        onKeyPressUp(e);
    };
}

init();