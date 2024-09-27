import { Component } from '@angular/core';
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  isDropdownOpen: { [key: string]: boolean } = {};

  toggleDropdown(dropdownId: string) {
    this.isDropdownOpen[dropdownId] = !this.isDropdownOpen[dropdownId];
    const dropdownMenu = document.getElementById(dropdownId);
    if (dropdownMenu) {
      dropdownMenu.style.display = this.isDropdownOpen[dropdownId] ? 'block' : 'none';
    }
  }

  constructor(private _loginServie:LoginService,
              private _router:Router) {
  }

  logout() {
    this._loginServie.logout();
    this._router.navigate(['/'])
  }
}
