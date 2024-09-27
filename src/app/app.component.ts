import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SpearPartsShop';
  showFooter: boolean = true;

  constructor(private router: Router) {
    // Check the route when the component is initialized
    this.router.events.subscribe(() => {
      this.showFooter = !this.router.url.includes('/admin');
    });
  }
}
