import { Component, Input } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() title: string = 'Sin Titulo';
  @Input('labels') doughnutChartLabels: string[] = ['Label1', 'Label2', 'Label3'];
  @Input('data') data: number[] = [350, 450, 100];

  colors: string[] = ['#6857E6', '#009FEE', '#F02059'];

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: this.data, backgroundColor: this.colors }]
  };
  public doughnutChartType: ChartType = 'doughnut';

  ngOnChanges(): void {
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [{ data: this.data, backgroundColor: this.colors }]
    }
  }

}
