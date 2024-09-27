import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../service/login.service";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  signupForm: FormGroup|any;

  user:any = {
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phone:"",
    dateOfBirth:"",
    gender:""
  }

  constructor(private fb: FormBuilder,
              private _loginService: LoginService,
              private _router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern("^[A-Za-z]{1,50}$")]], // Only letters, max 50 chars
      lastName: ['', [Validators.required, Validators.pattern("^[A-Za-z]{1,50}$")]], // Only letters, max 50 chars
      email: ['', [Validators.required, Validators.email]], // Valid email pattern
      phone: ['', [Validators.required, Validators.pattern("^[6789]\\d{9}$")]], // Indian 10-digit phone numbers starting with 6, 7, 8, or 9
      dateOfBirth: ['', [Validators.required, this.dateOfBirthValidator]], // Custom DOB validator
      gender: ['', [Validators.required]], // Assuming you have predefined gender options
      password: ['', [Validators.required, Validators.minLength(6)]], // Minimum 6 chars
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }
  dateOfBirthValidator(control: { value: string | number | Date; }) {
    const dob = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      return { invalidDate: true };
    }
    return age >= 8 ? null : { ageInvalid: true }; // Ensure the user is at least 8
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(form: FormGroup|any) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value);

      this.user.email = this.signupForm.value.email;
      this.user.password = this.signupForm.value.confirmPassword;
      this.user.firstName = this.signupForm.value.firstName;
      this.user.lastName = this.signupForm.value.lastName;
      this.user.phone = this.signupForm.value.phone;
      this.user.dateOfBirth = this.signupForm.value.dateOfBirth;
      this.user.username = "";
      this.user.gender = this.signupForm.value.gender;

      this._loginService.createUser(this.user).subscribe(()=>{
        this._snackBar.open("Your account has been successfully created. Welcome aboard!","",{duration:3000});
        this._router.navigate(['/login']);
      },error => {
        if(error.status === 409)
        {
          this._snackBar.open("Email or mobile number already exists; please use a different one.","",{duration:3000});
          this.signupForm.get('email').reset();
          this.signupForm.get('phone').reset();
        }
        console.log(error);
      })


      console.log(this.user)
      // Handle form submission logic here
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
      if (field === 'dateOfBirth' && control.hasError('ageInvalid')) {
        return 'You must be at least 8 years old.';
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
}
