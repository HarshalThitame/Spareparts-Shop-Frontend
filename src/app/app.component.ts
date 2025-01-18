import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {LoginService} from "./service/login.service";
import {User} from "./model/User.model";
import {UserSessionService} from "./service/user-session.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'SpearPartsShop';
  showFooter: boolean = true;
  user: User | any;

  constructor(private router: Router,
              private _loginService: LoginService,
              private _userSessionService:UserSessionService) {
    // Check the route when the component is initialized
    this.router.events.subscribe(() => {
      this.showFooter = !this.router.url.includes('/admin');
    });

    window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
  }
  ngOnInit() {
    if(this._loginService.isLoggedIn()){
      this._userSessionService.startSession();
    }
  }

  onBeforeUnload(event: BeforeUnloadEvent) {

    this._userSessionService.endSession();

    // Optionally, you can show a confirmation dialog
    event.preventDefault();
    event.returnValue = '';
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.onBeforeUnload.bind(this));
  }

}
