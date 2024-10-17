import {Component, OnInit} from '@angular/core';
import {User} from "../../../model/User.model";
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import {AdminOrderService} from "../../../service/AdminService/admin-order.service";
import {UserSessionService} from "../../../service/user-session.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements OnInit{

  isLoggedIn = false;
  user: User;
  isNavbarCollapsed = true;
  newOrderCount: number | 0 | undefined;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminOrderService: AdminOrderService,
              private _snackBar:MatSnackBar,
              private _userSessionService:UserSessionService,
              private _initializeService: InitializerService) {
    this.user = _initializeService.initializeUser();
  }

  ngOnInit(): void {
    this.isLoggedIn = this._loginService.isLoggedIn();

    if (!this.isLoggedIn) {
      this._loginService.logout();
      // this._router.navigate(['/']);
    } else {
      this._loginService.getCurrentUser().subscribe(data => {
        this.user = data;
        this.loadNewOrderCount()
        if(this.user.userRole !== "ADMIN"){
          this._loginService.logout();

        }
      }, error => {
        this._loginService.logout();
        this._router.navigate(['/']);
      })
    }
  }

  loadNewOrderCount() {
       this._adminOrderService.getNewOrderCount().subscribe(data=>{
         this.newOrderCount = data;
         console.log(this.newOrderCount)
       })
    }

  async logout() {
    // Wait for the endSession method to complete
    await this._userSessionService.endSession();

    // Proceed with the logout
    this._loginService.logout();

    // Reload the window
    window.location.reload();

    // Show the snack bar message
    this._snackBar.open('Successfully logged out!', '', { duration: 3000, verticalPosition: 'top' });
  }


}
