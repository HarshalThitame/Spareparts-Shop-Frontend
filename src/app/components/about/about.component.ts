import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User.model";
import {LoginService} from "../../service/login.service";
import {InitializerService} from "../../model/InitializerService/initializer.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit
{
  user:User;

  constructor(private _loginService:LoginService,
              private _initializerService:InitializerService) {
    this.user = _initializerService.initializeUser();

  }
    ngOnInit(): void {
  this.loadUser();
    }

  loadUser() {
      this._loginService.getCurrentUser().subscribe(data=>{
        this.user = data;
      })
    }
}
