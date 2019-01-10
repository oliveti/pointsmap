import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatsComponent} from './stats/stats.component';
import {MatProgressBarModule} from '@angular/material';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    ChartsModule
  ],
  declarations: [
    StatsComponent
  ],
  exports: [
    StatsComponent
  ]
})
export class StatsModule {
}
