import { Injectable } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/utils/src';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

export interface IChartProps {
  data?: any;
  labels?: any;
  options?: any;
  colors?: any;
  type?: any;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any',
})
export class DashboardChartsData {
  users: number[] = [];
  constructor(private http: ApiService) {
    this.initMainChart();
  }

  public mainChart: IChartProps = {};

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart(period: string = 'Month') {
    console.log('hi');
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info'), 10) ?? '#20a8d8';
    const brandDanger = getStyle('--cui-danger') || '#f86c6b';

    // mainChart
    // mainChart
    this.mainChart['elements'] = period === 'Month' ? 12 : 27;
    this.mainChart['Data1'] = [];
    this.mainChart['Data2'] = [];
    this.mainChart['Data3'] = [];

    // generate random values for mainChart
    for (let i = 1; i <= this.mainChart['elements']; i++) {
      this.http.get(environment.base + '/site/get-all-users?month=' + i + '&year=2022').subscribe((res: any) => {
        if (res.status === 'ok') {
          let arr = [];
          arr = res.users;
          this.mainChart['Data1'].push(arr.length * 10);
        } else {
          this.mainChart['Data1'].push(0);
        }
      });
      this.http.get(environment.base + '/order/get-all?month=' + i + '&year=2022').subscribe((res: any) => {
        if (res.status === 'ok') {
          let arr = [];
          arr = res.orders;
          this.mainChart['Data2'].push(arr.length * 10);
        } else {
          this.mainChart['Data2'].push(0);
        }
      });
      // this.mainChart['Data3'].push(65);
    }

    let labels: string[] = [];
    if (period === 'Month') {
      labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
    } else {
      /* tslint:disable:max-line-length */
      const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      labels = week.concat(week, week, week);
    }

    const colors = [
      {
        // brandInfo
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true,
      },
      {
        // brandSuccess
        backgroundColor: 'transparent',
        borderColor: brandSuccess || '#4dbd74',
        pointHoverBackgroundColor: '#fff',
      },
      {
        // brandDanger
        backgroundColor: 'transparent',
        borderColor: brandDanger || '#f86c6b',
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5],
      },
    ];

    const datasets = [
      {
        data: this.mainChart['Data1'],
        label: 'Users',
        ...colors[0],
      },
      {
        data: this.mainChart['Data2'],
        label: 'Orders',
        ...colors[1],
      },
      // {
      //   data: this.mainChart['Data3'],
      //   label: 'BEP',
      //   ...colors[2],
      // },
    ];

    const plugins = {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          labelColor: function (context: any) {
            return {
              backgroundColor: context.dataset.borderColor,
            };
          },
        },
      },
    };

    const options = {
      maintainAspectRatio: false,
      plugins,
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
          },
        },
        y: {
          beginAtZero: true,
          max: 250,
          ticks: {
            maxTicksLimit: 5,
            stepSize: Math.ceil(250 / 5),
          },
        },
      },
      elements: {
        line: {
          tension: 0.4,
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        },
      },
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels,
    };
  }
}
