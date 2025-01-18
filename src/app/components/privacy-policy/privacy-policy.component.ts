import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User.model";
import {LoginService} from "../../service/login.service";
import {InitializerService} from "../../model/InitializerService/initializer.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent implements OnInit{
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
