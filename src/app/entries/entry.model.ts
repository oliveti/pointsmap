import {Address} from './address.model';

export class Entry {
  id: string;

  name: string;
  brewery: string;

  photo: string;

  createdDate: number;
  marker: string;

  address: Address;

  constructor() {
    this.address = new Address();
  }
}
