import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../service/login.service";
import {Router} from "@angular/router";
import {User} from "../../model/User.model";
import {InitializerService} from "../../model/InitializerService/initializer.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserSessionService} from "../../service/user-session.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: User;
  isNavbarCollapsed = true;
  isOpen = false;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _snackBar:MatSnackBar,
              private _initializeService: InitializerService,
              private _userSessionService:UserSessionService) {
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
      }, error => {
        // this._loginService.logout();
        this._router.navigate(['/']);
      })
    }
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


  openCart() {
    if (this.user.userRole === 'CUSTOMER') {
      this._router.navigate(['/customer/cart']);
    } else if (this.user.userRole == 'RETAILER') {
      this._router.navigate(['/retailer/cart']);
    } else if (this.user.userRole == 'MECHANIC') {
      this._router.navigate(['/mechanic/cart']);
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen; // Toggle the dropdown state
  }

  closeDropdown() {
    this.isOpen = false; // Close the dropdown
  }
}
