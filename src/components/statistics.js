import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {getformattedDuration, makeFirstLetterUppercase} from '../utils';

import AbstractComponent from './abstract-component';


class Statistics extends AbstractComponent {
  constructor() {
    super();
    this._stats = null;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
  }

  getTemplate() {
    return `
    <section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`;
  }

  setStats(stats) {
    this._stats = stats;
    this._initCharts();
  }

  _initCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);
    // moneyCtx.height = 200;

    [this._moneyChart, this._transportChart, this._timeChart].forEach((chart) => {

      if (chart) {
        chart.destroy();
        chart = null;
      }
    });

    this._moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(this._stats.money),
        datasets: [{
          label: `Trip spendings`,
          data: Object.values(this._stats.money),
          backgroundColor: [],
        }]
      },
      options: {
        layout: {
          padding: {
            left: 50,
            right: 0,
            top: 0,
            bottom: 40
          },
        },
        tooltips: {
          callbacks: {
            title() {
            },
            label(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || ``;
              if (label) {
                label = `${label} for ${tooltipItem.yLabel}: `;
              }
              label += `${tooltipItem.xLabel} €`;
              return label;
            }
          }
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            minBarLength: 70,
            ticks: {
              beginAtZero: true,
              display: false
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            barPercentage: 1,
            barThickness: 30,
            ticks: {
              beginAtZero: true,
              fontColor: `#000`,
              fontSize: 16,
              fontWeight: 700,
              padding: 20
            },
            gridLines: {
              tickMarkLength: 0,
              drawTicks: false,
              offsetGridLines: true,
              display: false
            }
          }]
        },
        plugins: {
          datalabels: {
            color: `black`,
            labels: {
              title: {
                font: {
                  weight: `bold`
                }
              },
            },
            align: `left`,
            anchor: `end`,
            formatter: (value) => {
              return `€ ${value}`;
            }
          },
        },
        title: {
          display: true,
          position: `left`,
          text: `MONEY`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          display: false,
        }
      }
    });

    this._transportChart = new Chart(transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(this._stats.transport),
        datasets: [{
          label: `Used in trip`,
          data: Object.values(this._stats.transport),
          backgroundColor: [],
        }]
      },
      options: {
        layout: {
          padding: {
            left: 50,
            right: 0,
            top: 0,
            bottom: 40
          },
        },
        tooltips: {
          callbacks: {
            title() {
            },
            label(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || ``;
              if (label) {
                label = `${makeFirstLetterUppercase(tooltipItem.yLabel)} ${label.toLowerCase()} `;
              }
              label += `${tooltipItem.xLabel} time(s)`;
              return label;
            }
          }
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            minBarLength: 70,
            ticks: {
              beginAtZero: true,
              display: false
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            barPercentage: 1,
            barThickness: 30,
            ticks: {
              beginAtZero: true,
              fontColor: `#000`,
              fontSize: 16,
              fontWeight: 700,
              padding: 20
            },
            gridLines: {
              tickMarkLength: 0,
              drawTicks: false,
              offsetGridLines: true,
              display: false
            }
          }]
        },
        plugins: {
          datalabels: {
            color: `black`,
            labels: {
              title: {
                font: {
                  weight: `bold`
                }
              },
            },
            align: `left`,
            anchor: `end`,
            formatter: (value) => {
              return `${value}×`;
            }
          },
        },
        title: {
          display: true,
          position: `left`,
          text: `TRANSPORT`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          display: false,
        }
      }
    });

    this._timeChart = new Chart(timeCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(this._stats.time),
        datasets: [{
          label: `Spent time`,
          data: Object.values(this._stats.time),
          backgroundColor: [],
        }]
      },
      options: {
        layout: {
          padding: {
            left: 50,
            right: 0,
            top: 0,
            bottom: 40
          },
        },
        tooltips: {
          callbacks: {
            title() {
            },
            label(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || ``;
              if (label) {
                label += ` at ${tooltipItem.yLabel}: `;
              }
              label += getformattedDuration(tooltipItem.xLabel);
              return label;
            }
          }
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            minBarLength: 70,
            ticks: {
              beginAtZero: true,
              display: false
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            barPercentage: 1,
            barThickness: 30,
            ticks: {
              beginAtZero: true,
              fontColor: `#000`,
              fontSize: 16,
              fontWeight: 700,
              padding: 20
            },
            gridLines: {
              tickMarkLength: 0,
              drawTicks: false,
              offsetGridLines: true,
              display: false
            }
          }]
        },
        plugins: {
          datalabels: {
            color: `black`,
            labels: {
              title: {
                font: {
                  weight: `bold`
                }
              },
            },
            align: `left`,
            anchor: `end`,
            formatter: (value) => {
              return getformattedDuration(value);
            }
          },
        },
        title: {
          display: true,
          position: `left`,
          text: `TIME SPENT`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          display: false,
        }
      }
    });
  }
}

export default Statistics;
