import {Injectable} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private loginTime: number | null = null;
  private totalTimeSpent: number = 0;
  user: any;

  constructor(private router: Router,
              private _loginService: LoginService) {
    // Listen for navigation events to track time spent on each page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.trackTime();
      });
  }

  startSession() {
    this.loginTime = Date.now();


  }

  endSession() {
    this.trackTime();
    console.log(this.totalTimeSpent)

      this._loginService.sendTimeSpend(this.totalTimeSpent).subscribe(()=>{},error => {
        console.log(error)
      });





    this.loginTime = null; // Reset for the next session
  }

  private trackTime() {
    if (this.loginTime) {
      const currentTime = Date.now();
      const spentTime = currentTime - this.loginTime;
      this.totalTimeSpent += spentTime;
      this.loginTime = currentTime; // Reset login time to current
    }
  }

  getTotalTimeSpent(): number {
    return this.totalTimeSpent; // Return total time spent in milliseconds
  }
}
