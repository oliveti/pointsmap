import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {Entry} from '../../entries/entry.model';
import {EntriesService} from '../../entries/entries.service';

@Component({
  selector: 'pm-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  entries: Array<Entry>;
  countries: Array<string>;
  countbyYears: Array<CountByYear>;
  countByYearsGraphData: CountByYearsGraphData;

  colors = [{ // dark grey
    backgroundColor: '#c8e6c9',
    borderColor: '#c8e6c9',
    pointBackgroundColor: 'rgba(77,83,96,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  }];

  constructor(private entriesService: EntriesService) {
  }

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.entriesService.getEntries().subscribe(values => {
      this.entries = values;

      this.extractCountries();
      this.extractCountByYear();
    });
  }

  extractCountries() {
    this.countries = new Array<string>();

    _.forEach(this.entries, entry => {
      if (entry.address.address) {
        const country = this.entriesService.getCountry(entry);

        if (_.indexOf(this.countries, country) < 0) {
          this.countries.push(country);
        }
      }
    });
  }

  extractCountByYear() {
    this.countbyYears = new Array<CountByYear>();

    _.forEach(this.entries, entry => {
      const year = _.isDate(entry.createdDate) ?
        entry.createdDate.getFullYear() : new Date(entry.createdDate).getFullYear();

      if (_.find(this.countbyYears, {'year': year}) === undefined) {
        const countByYear = new CountByYear();
        countByYear.year = year;
        countByYear.count = 1;

        this.countbyYears.push(countByYear);
      } else {
        _.find(this.countbyYears, {'year': year}).count += 1;
      }

    });

    _.orderBy(this.countbyYears, 'year');

    this.countByYearsGraphData = new CountByYearsGraphData();
    _.forEach(this.countbyYears, countbyYear => {
      this.countByYearsGraphData.years.push(countbyYear.year + ' (' + countbyYear.count + ')');
      this.countByYearsGraphData.counts[0].data.push(countbyYear.count);
    });
  }
}

class CountByYear {
  year: number;
  count: number;
}

class CountByYearsGraphData {
  years: Array<string>;
  counts: any;

  constructor() {
    this.years = new Array<string>();
    this.counts = [
      {
        data: new Array<number>(),
        label: 'Bières'
      }
    ];
  }
}
