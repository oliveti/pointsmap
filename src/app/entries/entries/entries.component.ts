import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, merge, mergeMap, tap} from 'rxjs/operators';
import {DataSource} from '@angular/cdk/collections';
import {MatPaginator, MatSort} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Entry} from '../entry.model';
import {EntriesService} from '../entries.service';
import {LoginService} from '../../admin/login.service';

export {merge} from 'rxjs/operators';


@Component({
  selector: 'pm-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {

  displayedColumns: Array<string>;
  dataSource: EntriesDataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterControl: FormControl;

  entries: Observable<Array<Entry>>;

  constructor(private entriesService: EntriesService,
              public loginService: LoginService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.filterControl = new FormControl();

    this.sort.active = 'createdDate';
    this.sort.direction = 'desc';

    this.displayedColumns = ['name', 'brewery', 'country', 'createdDate'];
    if (this.loginService.isLoggedIn()) {
      this.displayedColumns.push('edit');
    }
    this.dataSource = new EntriesDataSource(this.entriesService, this.filterControl, this.sort, this.paginator);
  }


  openPhoto(entry: Entry) {
    window.open(entry.photo);
  }

  getEntryLink(entry: Entry) {
    return '/admin/edit-entry/' + entry.id;
  }
}

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class EntriesDataSource extends DataSource<EntryTableElement> {

  entriesCount: number;

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Array<EntryTableElement>> {

    const filterObservable = this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    );

    return this.entriesService.getEntries().pipe(
      merge(this.sort.sortChange),
      merge(this.paginator.page),
      merge(filterObservable),
      mergeMap(() => {
        return this.getSortedData();
      })
    );
  }

  getSortedData(): Observable<Array<EntryTableElement>> {

    const sortCol = this.sort.active;
    const sortDir = this.sort.direction;

    return this.entriesService.getOrderedEntries(sortCol, sortDir).pipe(
      map(values => {

        if (!this.filterControl.value || this.filterControl.value.length === 0) {
          return values;
        }
        return values.filter(value =>
          (value.name && value.name.toLowerCase().indexOf(this.filterControl.value.toLowerCase()) >= 0)
          || (value.address && value.address.address
          && value.address.address.toLowerCase().indexOf(this.filterControl.value.toLowerCase()) >= 0)
          || (value.brewery && value.brewery.toLowerCase().indexOf(this.filterControl.value.toLowerCase()) >= 0));
      }),
      tap(values => this.entriesCount = values.length),
      map(values => values.slice(
        this.paginator.pageIndex * this.paginator.pageSize,
        this.paginator.pageIndex * this.paginator.pageSize + this.paginator.pageSize)),
      map(values => {
        const entriesTableElements = new Array<EntryTableElement>();
        values.forEach(value => {

          const valueTableElement = new EntryTableElement();
          valueTableElement.entry = value;
          valueTableElement.country = this.entriesService.getCountry(value);

          entriesTableElements.push(valueTableElement);
        });

        return entriesTableElements;
      })
    );
  }

  getCountry(entry: Entry) {
    return this.entriesService.getCountry(entry);
  }

  disconnect() {
  }

  constructor(private entriesService: EntriesService,
              private filterControl: FormControl, private sort: MatSort, private paginator: MatPaginator) {
    super();
  }
}

export class EntryTableElement {
  entry: Entry;
  country: string;
}
