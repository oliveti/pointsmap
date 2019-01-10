import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from './user.model';
import * as _ from 'lodash';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userSubject = new BehaviorSubject<User>(null);

  constructor(private angularFireAuth: AngularFireAuth) {
    this.userSubject.next(JSON.parse(localStorage.getItem('user')));

    this.angularFireAuth.authState.subscribe(user => {
      if (_.isNil(user)) {
        this.logOut();
      }
    });
  }

  isLoggedIn(): boolean {
    return this.userSubject.getValue() !== null;
  }

  logIn(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logOut() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }
}
