import { Component, Input, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};
export type RadialChartOptions = {
  series: number[];
  chart: ApexChart;
  labels: string[];
  plotOptions?: any;
  title: ApexTitleSubtitle;

};
export type DonutChartOptions = {
  series: number[];
  chart: ApexChart;
  labels?: string[];
  plotOptions?: any;
  dataLabels?: any;
  fill?: any;
  legend?: any;
  title?: ApexTitleSubtitle;
  responsive?: any;
};

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels?: any;
  stroke?: any;
  xaxis?: ApexXAxis;
  tooltip?: any;
  title?: ApexTitleSubtitle;
};


@Component({
  selector: 'app-employee-chart',
  imports: [
    ChartComponent
  ],
  templateUrl: './employee-chart.html',
  styleUrl: './employee-chart.css'
})
export class EmployeeChart {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public radialChartOptions: Partial<RadialChartOptions>;
  public donutChartOptions: Partial<DonutChartOptions>;
  public areaChartOptions: Partial<AreaChartOptions>;


  constructor() {
    // Bar chart
    this.chartOptions = {
      series: [
        {
          name: 'My-series',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: 'bar'
      },
      title: {
        text: 'Employee Overview'
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      }
    };
    // Radial chart
    this.radialChartOptions = {
      series: [44, 55, 67, 83],
      chart: {
        height: 350,
        type: 'radialBar'
      },
      labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px'
            },
            value: {
              fontSize: '16px'
            },
            title: {
              text: 'Employee Distribution by Department'
            },
            total: {
              show: true,
              label: 'Total Employees',
              formatter: function() {
                return 249;
              }
            }
          }
        }
      }
    };

    //Pie chat
    this.donutChartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 380,
        type: 'donut'
      },
      labels: ['HR', 'Engineering', 'Marketing', 'Sales', 'Other'],
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'gradient'
      },
      legend: {
        formatter: function(val: string, opts: any) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
        }
      },
      title: {
        text: 'Employee Distribution by Department'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    //   Area chart
    this.areaChartOptions = {
      series: [
        {
          name: 'HR Activity',
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: 'Employee Logins',
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 350,
        type: 'area'
      },
      title: {
        text: 'Employee Activity Over Time',
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#6B46C1' // Tailwind purple-700
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z'
        ]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }
    };

  }
}
