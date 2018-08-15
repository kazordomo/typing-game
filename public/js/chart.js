const context = getElementId('words-chart').getContext('2d');
const context2 = getElementId('wpm-chart').getContext('2d');

class UserChart {
    constructor(labels, brColor, data) {
        this.labels = labels;
        this.brColor = brColor;
        this.data = data;
    }

    get chartData() {
        return this.initChart;
    }

    initChart() {
        let chartData = {
            labels: this.labels,
            datasets: [
                {
                    data: this.data,
                    backgroundColor: this.brColor,
                    borderColor: [
                        "#FFFFFF",
                        "#FFFFFF"
                    ]
                }
            ]
        };
        return chartData;
    }
}
