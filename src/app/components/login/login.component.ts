import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../service/login.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup|any;
  isEmail: boolean = true; // To check if input is email or mobile number
  emailError: string = 'Please enter a valid email.';
  mobileError: string = 'Please enter a valid mobile number (10 digits).';
  user:any = {
    email:null,
    phone:null,
    password:null
  }
  returnUrl: string | any;


  constructor(private fb: FormBuilder,
              private _loginService: LoginService,
              private _router: Router,
              private _snackbar:MatSnackBar,
              private _route:ActivatedRoute) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]], // Initially no validators
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    // this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    this._loginService.getCurrentUser().subscribe((data:any)=>{
        console.log(data.userRole)
        if(data.userRole == "CUSTOMER"){
          this._router.navigate(['/']);
        }else  if(data.userRole == "ADMIN"){
          this._router.navigate(['admin']);
        } else if(data.userRole=="RETAILER"){
          this._router.navigate(['retailer'])
        }else if(data.userRole=="MECHANIC"){
          this._router.navigate(['mechanic'])
        }
        else{
          this._loginService.logout();
        }
      },
      error => {
        if (error.status === 500) {
          console.log('Logging off...');
        }
      })
  }

  // Function to update validation based on input
  onInputChange() {
    const input = this.loginForm.get('identifier')?.value;
    const isNumeric = /^\d+$/.test(input);

    if (isNumeric) {
      this.isEmail = false;
      // Set validators for mobile number
      this.loginForm.get('identifier')?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
    } else {
      this.isEmail = true;
      // Set validators for email
      this.loginForm.get('identifier')?.setValidators([Validators.required, Validators.email]);
    }

    this.loginForm.get('identifier')?.updateValueAndValidity(); // Update the validity after changing validators
  }

  // Method to handle form submission
  onSubmit(): void {

    const identifier = this.loginForm.get('identifier')?.value;
    const password = this.loginForm.get('password')?.value;

    if(this.isEmail){
      console.log("email")
      this.user.email = identifier;
    }else {
      console.log("Mobile")
      this.user.phone= identifier;
    }
    this.user.password = password

    console.log(this.user)

    if (this.loginForm.valid) {
      // console.log('Form Submitted', this.loginForm.value);
      this._loginService.generateToken(this.user).subscribe((data:any)=>{
        console.log(data)
        console.log(this.returnUrl)
        this._loginService.loginUser(data.token)
        this._loginService.getCurrentUser().subscribe(
          (user: any) => {
            this._loginService.setUser(user);
            if(this.returnUrl != '/')
            {
              console.log("_Inside sdfsdffaewefawe")
              this._router.navigateByUrl(this.returnUrl)
              return
            }
            if(user.userRole == "CUSTOMER"){
              this._router.navigate(['/']);
              window.location.reload();
            }else if (user.userRole=="ADMIN")
            {
              this._router.navigate(['admin']);
            }
            else if(user.userRole=="RETAILER"){
              this._router.navigate(['retailer'])
            }
            else if(user.userRole=="MECHANIC"){
              this._router.navigate(['mechanic'])
            }
            else{
              this._loginService.logout();
            }
          },
          error => {

            console.log(error);
          })

      },error => {
        console.log(error.status)
        if (error.status === 500) {
          this._snackbar.open('Bad Request - Invalid email address / Mobile.', 'Close', {
            duration: 3000,  // Time in milliseconds
            panelClass: ['error-snackbar'],  // Optional: custom CSS class
          });
        }else if(error.status === 404){
          this._snackbar.open('Bad Credentials - Invalid email address / mobile and password.', 'Close', {
            duration: 3000,  // Time in milliseconds
            panelClass: ['error-snackbar'],  // Optional: custom CSS class
          });
        }
        else if(error.status === 403){
          this._snackbar.open('You are not active or you are blocked by admin.', 'Close', {
            duration: 3000,  // Time in milliseconds
            panelClass: ['error-snackbar'],  // Optional: custom CSS class
          });
        }
        this.user.email=null;
        this.user.phone=null;
        this.user.password=null;
        this.loginForm.reset();

      })


    } else {
      console.log('Form is invalid');
    }
  }

}
