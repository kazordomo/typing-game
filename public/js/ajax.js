let userInformation = getElementClass('user-information')[0];
let userName = getElementClass('user-name')[0];
let userScore = getElementId('user-score');
let topAllScore = getElementId('top-all-score');
let topTodayScore = getElementId('top-today-score');

const initOnSubmit = () =>
    getElementId('score-form').addEventListener('submit', onScoreSubmit);

let wpmChart = new UserChart(
    ["Your wpm", "Others wpm"], 
    [appColors.yellow, appColors.red], 
    [0, 0]
);
let wordsChart = new UserChart(
    ["Your acc in %", "Others acc in %"], 
    [appColors.green, appColors.red], 
    [0, 0]
);

const initTopList = (list, table, rowLength) => {
    for(let i = 0; i < rowLength; i++) {
        //create element inside the loop to get a unique element each loop
        let createTr = document.createElement('tr');
        table.appendChild(createTr);
        for(let j = 0; j < 4; j++) {
            createTr.appendChild(document.createElement('td'));
        }

        let td = createTr.getElementsByTagName('td');
        td[0].innerHTML = i + 1;
        (table == userScore) ? td[1].innerHTML = '' : td[1].innerHTML = '-';
        td[2].innerHTML = '-';
        td[3].innerHTML = '-';
    }

    updateTopList(list, table);
};

let updateTopList = (list, table) => {

    //TODO: IF table got 10 rows, update them. IF not, create tr.
    for (let i = 0; i < list.length; i++) {
        let row = table.getElementsByTagName('tr')[i + 1];
        let td = row.getElementsByTagName('td');

        td[0].innerHTML = i + 1;
        (table == userScore) ? td[1].innerHTML = '' : td[1].innerHTML = list[i].name;
        td[2].innerHTML = list[i].score;
        td[3].innerHTML = list[i].date;
    }
};

const initChart = (ctxt, type, data) => {
    new Chart(ctxt, {
        type: type,
        data: data,
        options: {
            legend: {
                display: false
            }
        }
    });
};

const initUserInformation = (response, create) => {
    if(create) {
        for(let i = 0; i < 5; i++) {
            userInformation.appendChild(document.createElement('div'));
        }
    }
    let div = userInformation.getElementsByTagName('div');
    div[0].innerHTML = response.userWpm + ' WORDS PER MINUTE IN AVARAGE';
    div[1].innerHTML = response.userGamesPlayed + ' GAMES PLAYED';
    div[2].innerHTML = response.userRightWords + ' TOTAL CORRECT WORDS';
    div[3].innerHTML = response.userWrongWords + ' TOTAL WRONG WORDS';
    div[4].innerHTML = response.perfectGames + ' PERFECT GAMES';

    wordsChart.data = [response.userAccuracy, response.totalAccuracy];
    wpmChart.data = [response.userWpm, response.wpm];

    let createWpmChart = initChart(context, 'pie', wordsChart.chartData());
    let createWordsChart = initChart(context2, 'pie', wpmChart.chartData());
};

const getScores = async () => {
    let response = await fetch('/score', { 
        headers: { 'Content-Type': 'application/json' }
    });
    let json = await response.json();
    initTopList(json.topAll, topAllScore, 10);
    initTopList(json.topToday, topTodayScore, 10);
    if(json.name) {
        initTopList(json.userTopFive, userScore, 5);
        userName.innerHTML = json.name.toUpperCase() + ', ' + '<i>' + json.userTitle + '</i>';
        initUserInformation(json, true);
    }
}

const onScoreSubmit = async event => {
    if(!openUserProfile)
        return;
    
    event.preventDefault();

    let scoreInput = getElementId('submit-score');
    let wrongInput = getElementId('submit-wrong');
    let scoreData = { 
        score: parseInt(scoreInput.value, 10), 
        wrong: parseInt(wrongInput.value, 10)
    }; 
    
    let response = await fetch('/score', { 
        method: 'post',
        body: JSON.stringify(scoreData),
        headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.json();

    updateTopList(json.topAll, topAllScore);
    updateTopList(json.topToday, topTodayScore);
    updateTopList(json.userTopFive, userScore);
    userName.innerHTML = json.name.toUpperCase() + ', ' + '<i>' + json.userTitle + '</i>';
    initUserInformation(json, false);
    scoreInput.value = null;
    wrongInput.value = null;
}

initOnSubmit();
getScores();
