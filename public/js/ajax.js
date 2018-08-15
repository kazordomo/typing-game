$(document).ready(function() {
    let userInformation = getElementClass('user-information')[0];
    let userName = getElementClass('user-name')[0];
    let userScore = getElementId('user-score');
    let topAllScore = getElementId('top-all-score');
    let topTodayScore = getElementId('top-today-score');

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

    let initTopList = (list, table, rowLength) => {
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

    let initChart = (ctxt, type, data) => {
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

    let initUserInformation = (response, create) => {
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

    $.ajax({
        url: '/score',
        contentType: 'application/json',
        success: function(response) {
            initTopList(response.topAll, topAllScore, 10);
            initTopList(response.topToday, topTodayScore, 10);
            if(response.name) {
                initTopList(response.userTopFive, userScore, 5);
                userName.innerHTML = response.name.toUpperCase() + ', ' + '<i>' + response.userTitle + '</i>';
                initUserInformation(response, true);
            }
        }
    });

    $('#score-form').on('submit', function(event) {
        if(openUserProfile) {
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
        } else {
            return false;
        }
    });
});
