import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../service/login.service";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {User} from "../../model/User.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  signupForm: FormGroup|any;

  user:User = {
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    mobile: "",
    id: 0,
    userRole: 'CUSTOMER',
    isActive: false,
    createdAt: '',
    updatedAt: ''
  }

  duplicateEmailMobile:string='';

  constructor(private fb: FormBuilder,
              private _loginService: LoginService,
              private _router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userType: this.fb.group({
        type: ['Customer'], // Default selected value
      }),
      firstName: ['', [Validators.required, Validators.pattern("^[A-Za-z]{1,50}$")]], // Only letters, max 50 chars
      lastName: ['', [Validators.required, Validators.pattern("^[A-Za-z]{1,50}$")]], // Only letters, max 50 chars
      email: ['', [Validators.required, Validators.email]], // Valid email pattern
      phone: ['', [Validators.required, Validators.pattern("^[6789]\\d{9}$")]], // Indian 10-digit phone numbers starting with 6, 7, 8, or 9
      password: ['', [Validators.required, Validators.minLength(6)]], // Minimum 6 chars
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(form: FormGroup|any) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    console.log(this.signupForm.value.userType);

    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value);

      this.user.id = Date.now() * 2 + Date.now() * 2;
      this.user.email = this.signupForm.value.email;
      this.user.password = this.signupForm.value.confirmPassword;
      this.user.firstName = this.signupForm.value.firstName;
      this.user.lastName = this.signupForm.value.lastName;
      this.user.mobile = this.signupForm.value.phone;
      this.user.username = "";

      if (this.signupForm.value.userType === 'Customer') {
        this.user.userRole = "CUSTOMER";
        this.user.isActive = true;
      } else if (this.signupForm.value.userType === 'Retailer') {
        this.user.userRole = "RETAILER";
        this.user.isActive = false;
      } else if (this.signupForm.value.userType === 'Mechanic') {
        this.user.userRole = "MECHANIC";
        this.user.isActive = false;
      }

      this._loginService.createUser(this.user).subscribe(() => {
        Swal.fire({
          title: 'Account Created!',
          text: 'Your account has been successfully created. Welcome aboard!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this._router.navigate(['/login']);
        });
      }, error => {
        if (error.status === 409) {
          this.duplicateEmailMobile ='Email or mobile number already exists; please use a different one.'
          this._snackBar.open("Email or mobile number already exists; please use a different one.", "", { duration: 3000 });
          this.signupForm.get('email').reset();
          this.signupForm.get('phone').reset();
        }
        console.log(error);
      });

      console.log(this.user);
    } else {
      console.log('Form is invalid');
    }
  }


  // Method to get error messages
  getErrorMessage(field: string) {
    const control = this.signupForm.get(field);
    if (control && control.touched) {
      if (control.hasError('required')) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
      if (control.hasError('pattern')) {
        switch (field) {
          case 'firstName':
          case 'lastName':
            return 'Only letters are allowed in names.';
          case 'phone':
            return 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9.';
        }
      }
      if (control.hasError('email')) {
        return 'Invalid email format.';
      }
      if (field === 'password' && control.hasError('minlength')) {
        return 'Password must be at least 6 characters long.';
      }
      if (field === 'confirmPassword' && this.signupForm.hasError('mismatch')) {
        return 'Passwords do not match.';
      }
    }
    return '';
  }
  isRetailerOrMechanic(): boolean {
    return this.signupForm.get('userType')?.get('type')?.value === 'Retailer' ||
      this.signupForm.get('userType')?.get('type')?.value === 'Mechanic';
  }
}
