import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {LoginService} from "./service/login.service";
import {User} from "./model/User.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SpearPartsShop';
  showFooter: boolean = true;
  user: User | any;

  constructor(private router: Router,
              private _loginService: LoginService) {
    // Check the route when the component is initialized
    this.router.events.subscribe(() => {
      this.showFooter = !this.router.url.includes('/admin');
    });
  }


}
