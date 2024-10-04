import {Component, OnInit} from '@angular/core';
import {User} from "../../../model/User.model";
import {LoginService} from "../../../service/login.service";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user:User;
  profileForm: FormGroup|any;


  constructor(private _loginService:LoginService,
              private _initializerService:InitializerService,
              private _fb:FormBuilder,
              private _snackBar:MatSnackBar) {
    this.user = _initializerService.initializeUser();
    this.profileForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
  }
    ngOnInit(): void {
    this.loadUser()
    }

  loadUser() {
        this._loginService.getCurrentUser().subscribe(data=>{
          this.user = data;
          this.profileForm.patchValue(this.user);
        })
    }


  onSubmit() {
    this.user.firstName = this.profileForm.value.firstName;
    this.user.lastName = this.profileForm.value.lastName;
    this.user.address = this.profileForm.value.address;
    this.user.city = this.profileForm.value.city;
    this.user.state = this.profileForm.value.state;
    this.user.postalCode = this.profileForm.value.postalCode;

  this._loginService.updateUser(this.user).subscribe(data=>{
this._snackBar.open("Profile Updated...","",{duration:3000})
  })
  }
}
