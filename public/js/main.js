//TODO fetch different languages from db and have them be able too choose from language-selection
let sv_words = [
    "hej",
    "jag",
    "heter",
    "åker",
    "kanske",
    "påskägg",
    "lök",
    "svamp",
    "fot",
    "park",
    "bänk",
    "soffa",
    "vetenskap","hej",
    "jag",
    "heter",
    "åker",
    "kanske",
    "påskägg",
    "lök",
    "svamp",
    "fot",
    "park",
    "bänk",
    "soffa",
    "vetenskap","hej",
    "jag",
    "heter",
    "åker",
    "kanske",
    "påskägg",
    "lök",
    "svamp",
    "fot",
    "park",
    "bänk",
    "soffa",
    "vetenskap","hej",
    "jag",
    "heter",
    "åker",
    "kanske",
    "påskägg",
    "lök",
    "svamp",
    "fot",
    "park",
    "bänk",
    "soffa",
    "vetenskap","hej",
    "jag",
    "heter",
    "åker",
    "kanske",
    "påskägg",
    "lök",
    "svamp",
    "fot",
    "park",
    "bänk",
    "soffa",
    "vetenskap","hej",
    "jag",
    "heter",
    "åker",
    "kanske",
    "påskägg",
    "lök",
    "svamp",
    "fot",
    "park",
    "bänk",
    "soffa",
    "vetenskap","hej",
    "jag",
    "heter",
    "åker",
    "kanske",
    "påskägg",
    "lök",
    "svamp",
    "fot",
    "park",
    "bänk",
    "soffa",
    "vetenskap","hej",
    "jag",
    "heter",
    "åker",
    "kanske",
    "påskägg",
    "lök",
    "svamp",
    "fot",
    "park",
    "bänk",
    "soffa",
    "vetenskap","hej",
    "jag",
    "heter",
    "åker",
    "kanske",
    "påskägg",
    "lök",
    "svamp",
    "fot",
    "park",
    "bänk",
    "soffa",
    "vetenskap"
];
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
    "food"
];

let getElementId = (element) =>  {
    return document.getElementById(element);
};
let getElementClass = (elements) => {
    return document.getElementsByClassName(elements);
};

let words = sv_words;
let refresh = getElementId('refresh');
let typingArea = getElementId('typing-area');
let showScore = getElementClass('score');
let word = getElementClass('word');
let timeCounter = getElementId('time-counter');

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

//TODO: randomize words
//TODO: REFACTOR!! FUNCTIONS / VARIABLES

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

//reset game with "r"
document.onkeyup = (e) => {
    //TODO: make click disabled right after end of round, to prevent missclick
    if(timer === 0 || timer === null) {
        if(e.keyCode == 13) {
            resetAll();
        }
    }
};

typingArea.onkeydown = (e) => {
    //to prevent lagg, remove space when new word,
    //instead of removing characters on keyup
    typingArea.value=typingArea.value.replace(/\s+/g,'');

    if(timer > 0 || timer === 0 || timer === null) {
        keystrokes++;

        if(timer === 0) {
            startTimer(15, timeCounter);
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
};

let errorChar;
typingArea.onkeyup = (e) => {

    if(timer > 0) {
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