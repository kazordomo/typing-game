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

let getElement = (element) =>  {
    return document.getElementById(element);
};

let words = sv_words;
let refresh = getElement('refresh');
let word1 = getElement('word1');
let word2 = getElement('word2');
let word3 = getElement('word3');
let word4 = getElement('word4');
let word5 = getElement('word5');
let typingArea = document.getElementById('typing-area');
let timeCounter = getElement('time-counter');

let counter = 0;
let correct = 0;
let misses = 0;
let keystrokes = 0;
let character = 0;
let timer = 0;

word1.innerHTML = words[counter];
word2.innerHTML = words[counter + 1];
word3.innerHTML = words[counter + 2];
word4.innerHTML = words[counter + 3];
word5.innerHTML = words[counter + 4];

//TODO: randomize and make it time-based
//TODO: REFACTOR!! FUNCTIONS / VARIABLES

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
            word1.style.color = "#27C42A";
            word2.style.color = "#DE1D1D";
            word1.innerHTML = correct + ' correct words!';
            word2.innerHTML = misses + (misses == 1 ? ' wrong word. ' : ' wrong words. ');
            word3.innerHTML = keystrokes + ' total keystrokes.';
            word4.innerHTML = '';
            word5.innerHTML = '';
            console.log(timer);
        } else
            element.innerHTML = timer;
    }, 1000);
};

//check if the word that is typed is correct
let spellChecker = () => {
    if(typingArea.value == word1.innerHTML) {
        counter++;
        correct++;
    } else {
        misses++;
        counter++;
        typingArea.style.border = '3px solid #DE1D1D';
    }
    typingArea.value = '';
    character = 0;
    word1.innerHTML = words[counter];
    word2.innerHTML = words[counter + 1];
    word3.innerHTML = words[counter + 2];
    word4.innerHTML = words[counter + 3];
    word5.innerHTML = words[counter + 4];
};

let resetAll = () => {
    clearInterval(start);
    typingArea.disabled = false;
    typingArea.value = '';
    word1.style.color = "#FFFFFF";
    word2.style.color = "#FFFFFF";
    counter = 0;
    correct = 0;
    misses = 0;
    keystrokes = 0;
    character = 0;
    word1.innerHTML = words[counter];
    word2.innerHTML = words[counter + 1];
    word3.innerHTML = words[counter + 2];
    word4.innerHTML = words[counter + 3];
    word5.innerHTML = words[counter + 4];
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
            startTimer(5, timeCounter);
        }

        if(e.keyCode === 8) {
            character--;
        } else {
            if(e.keyCode === 32){
                spellChecker();
            } else {
                character++;
            }
        }
    }
};

typingArea.onkeyup = (e) => {

    if(timer > 0) {
        if(e.keyCode !== 32) {
            if (word1.innerHTML.charAt(character - 1) != typingArea.value.charAt(character - 1)) {
                typingArea.style.border = '3px solid #DE1D1D';
            }
            else {
                typingArea.style.border = '3px solid transparent';
            }
        }
    }

};