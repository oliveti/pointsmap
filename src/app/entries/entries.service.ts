import {Injectable} from '@angular/core';
import {Entry} from './entry.model';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import {map} from 'rxjs/operators';
import {EntryWithKey} from './entryWithKey.model';
import {SortDirection} from '@angular/material';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {

  static basePath = 'entries';

  constructor(private angularFireDatabase: AngularFireDatabase) {
  }

  getEntry(entryId: string): Observable<Entry> {
    return this.angularFireDatabase.object<Entry>('entries/' + entryId).valueChanges();
  }

  getEntries(): Observable<Array<Entry>> {
    return this.angularFireDatabase.list<Entry>('entries').valueChanges();
  }

  getEntriesWithKeys(): Observable<Array<EntryWithKey>> {
    return this.angularFireDatabase.list<Entry>('entries').snapshotChanges().pipe(
      map(changes => {
        const entriesWithKeys = new Array<EntryWithKey>();

        changes.map(change => {
            const entryWithKey = new EntryWithKey();
            entryWithKey.firebaseKey = change.payload.key;
            entryWithKey.entry = change.payload.val();

            entriesWithKeys.push(entryWithKey);
          }
        );

        return entriesWithKeys;
      })
    );
  }

  getEntriesForMap(): Observable<Array<Entry>> {
    return this.getEntries().pipe(
      map(entries => {
        this.scatterEntries(entries);
        return entries;
      })
    );
  }

  getOrderedEntries(orderByCol: string, orderByDir: SortDirection): Observable<Array<Entry>> {
    return this.angularFireDatabase.list<Entry>('entries',
      ref => ref.orderByChild(orderByCol)).valueChanges()
      .pipe(
        map(entries => orderByDir === 'asc' ? entries : _.reverse(entries))
      );
  }


  saveEntry(entry: Entry) {
    const entries = this.angularFireDatabase.list('entries');
    return entries.set(entry.id, entry);
  }

  deleteEntry(entry: Entry) {
    return this.angularFireDatabase.list('entries').remove(entry.id);
  }

  createEntry(): Entry {
    const entry = new Entry();
    entry.id = this.angularFireDatabase.createPushId();

    return entry;
  }

  getCountry(entry: Entry): string {
    if (entry.address.address) {
      return entry.address.address.substring(entry.address.address.lastIndexOf(',') + 1).trim();
    }
  }

  scatterEntries(loclist: Array<Entry>) {
    // Find out which entry should be moved.
    const uniq = _.uniqWith(loclist, (entry1, entry2) => {
      return entry1.address.longitude === entry2.address.longitude && entry1.address.latitude === entry2.address.latitude;
    });

    const diff = _.difference(loclist, uniq);

    // Scatter these entries
    const lng_radius = 0.0003,         // degrees of longitude separation
      lat_to_lng = 111.23 / 71.7,  // lat to long proportion in Warsaw
      loclen = diff.length,
      step = 2 * Math.PI / loclen,
      lat_radius = lng_radius / lat_to_lng;

    let angle = 0.5;
    let i, loc;

    for (i = 0; i < loclen; ++i) {
      loc = diff[i];
      loc.address.longitude = loc.address.longitude + (Math.cos(angle) * lng_radius);
      loc.address.latitude = loc.address.latitude + (Math.sin(angle) * lat_radius);
      angle += step;
    }
  }
}
