import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {InfoWindow} from '@agm/core/services/google-maps-types';
import {EntriesService} from '../entries/entries.service';
import {Entry} from '../entries/entry.model';

@Component({
  selector: 'pm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  zoom = 2;

  entries: Observable<Array<Entry>>;

  constructor(private entriesService: EntriesService) {
  }

  ngOnInit(): void {
    this.entries = this.entriesService.getEntriesForMap();
  }

  closeInfoWindow(infoWindow: InfoWindow) {
    if (!infoWindow) {
      return;
    }

    try {
      infoWindow.close();
    } catch (error) {
      console.log(error);
    }
  }
}
