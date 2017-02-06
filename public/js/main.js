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
let words = sv_words;

let timer = null;
let startTimer = (duration, element) => {
    timer = duration;
    element.innerHTML = timer;
    let start = setInterval(() => {
        timer--;
        if(timer <= 0) {
            clearInterval(start);
            //resets
            element.innerHTML = "GAME!";
            typingArea.disabled = true;
            typingArea.value = 'Press R to restart';
            word1.style.color = "#27C42A";
            word2.style.color = "#DE1D1D";
            word1.innerHTML = correct + ' correct words!';
            word2.innerHTML = misses + (misses == 1 ? ' wrong word. ' : ' wrong words. ');
            word3.innerHTML = keystrokes + ' total keystrokes.';
            word4.innerHTML = '';
            word5.innerHTML = '';
        } else
            element.innerHTML = timer;
    }, 1000);
};

let getElement = (element) =>  {
    return document.getElementById(element);
};

//TODO implement language controller
let language = getElement('language');
let languageSelection = getElement('language-selection');
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

language.addEventListener("click", () => {
    languageSelection.style.display = languageSelection.style.display === 'none' ? 'block' : 'none';
});

let resetAll = () => {
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
    //needed to reset the timer
    timer = null;
    console.log("HEJ");
};

//reset stats and timer when refresh is clicked
refresh.addEventListener("click", resetAll);

//loop with words[i]. if word == typingArea + space-press, i++
//TODO: randomize and make it time-based
//TODO: REFACTOR!! FUNCTIONS / VARIABLES
//TODO: Reload button that resets everything. Should work if clock is set to null

word1.innerHTML = words[counter];
word2.innerHTML = words[counter + 1];
word3.innerHTML = words[counter + 2];
word4.innerHTML = words[counter + 3];
word5.innerHTML = words[counter + 4];

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

//reset game with "r"
document.onkeyup = (e) => {
    if(timer === null || timer === 0) {
        if(e.keyCode == 82) {
            resetAll();
        }
    }
};

typingArea.onkeydown = (e) => {

    //to prevent lagg, remove space when new word,
    //instead of removing characters on keyup
    typingArea.value=typingArea.value.replace(/\s+/g,'');

    if(timer > 0 || timer === null) {
        keystrokes++;

        if(timer === null) {
            startTimer(5, timeCounter);
        }

        if(e.keyCode === 8) {
            character--;
        } else {
            if(e.keyCode == 32){
                spellChecker();
            } else {
                character++;
            }
        }
    }
};

typingArea.onkeyup = (e) => {

    if(timer > 0 || timer == null) {
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