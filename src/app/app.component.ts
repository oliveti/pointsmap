import {Component} from '@angular/core';
import {LoginService} from './admin/login.service';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';


  constructor(public loginService: LoginService) {
  }
}
