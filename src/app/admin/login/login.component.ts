import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {LoginService} from '../login.service';
import {User} from '../user.model';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'pm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  error: string;

  user: User;

  constructor(private formBuilder: FormBuilder,
              private loginService: LoginService,
              private angularFireAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: new FormControl(),
      password: new FormControl()
    });
  }

  async onSubmit() {
    try {
      this.error = null;

      const userCredentials = await this.angularFireAuth.auth.signInWithEmailAndPassword(
        this.loginForm.get('userName').value,
        this.loginForm.get('password').value
      );

      this.user = new User();
      this.user.email = userCredentials.user.email;

      this.loginService.logIn(this.user);
    } catch (error) {
      console.error(error);
      this.error = error;
    }
  }
}
