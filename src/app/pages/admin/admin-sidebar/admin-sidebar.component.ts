import {Component, HostListener} from '@angular/core';
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
  animations: [
    trigger('sidebarToggle', [
      state('open', style({
        width: '250px',
        opacity: 1,
        overflow: 'hidden',
      })),
      state('closed', style({
        width: '0',
        opacity: 0,
        overflow: 'hidden',
      })),
      transition('open <=> closed', [
        animate('300ms ease-in-out')
      ]),
    ]),
  ]
})
export class AdminSidebarComponent {
  isSidebarOpen = false;
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

    this.checkWindowSize()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkWindowSize()
  }

  checkWindowSize(){
    if(window.innerWidth > 1200)
    {
      this.isSidebarOpen  = true;
    }else if(window.innerWidth<768)
    {
      this.isSidebarOpen = false;
    }
  }


  logout() {
    this._loginServie.logout();
    this._router.navigate(['/'])

  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
