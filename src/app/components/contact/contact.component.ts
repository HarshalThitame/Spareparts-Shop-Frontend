import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User.model";
import {LoginService} from "../../service/login.service";
import {InitializerService} from "../../model/InitializerService/initializer.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit
{
  user:User;
  contactForm: FormGroup|any;

  constructor(private _loginService:LoginService,
              private _initializerService:InitializerService,
              private _fb:FormBuilder) {
    this.user = _initializerService.initializeUser();

    this.contactForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['', Validators.required]
    });

  }
  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this._loginService.getCurrentUser().subscribe(data=>{
      this.user = data;
    })
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      // Handle form submission logic, e.g., send the form data to a backend service
      console.log(this.contactForm.value);
      // Display success notification
    }
  }
}
