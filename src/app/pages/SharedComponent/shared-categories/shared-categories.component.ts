import {Component, OnInit} from '@angular/core';
import {Category} from "../../../model/Category.model";
import {CategoryService} from "../../../service/category.service";
import NoImage from "../../../service/helper/noImage";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-shared-categories',
  templateUrl: './shared-categories.component.html',
  styleUrl: './shared-categories.component.css',
  animations: [
    trigger('bounceDrop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px) scale(0.8)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
        animate('0.2s ease-out', style({ transform: 'translateY(-10px)' })),
        animate('0.2s ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class SharedCategoriesComponent implements OnInit {
  categories: Category[] = [];
  visibleCategoriesCount: number = 6; // Initially show only 4 categories
  bounceState: string = '';

  constructor(private _categoryService: CategoryService) {}

  ngOnInit(): void {
    this.bounceState = 'in';
    this.loadCategories();
  }

  loadCategories() {
    // Fetch available categories and subcategories
    this._categoryService.getCategoriesByGeneral().subscribe((data) => {
      this.categories = data;
      console.log(data);
    });
  }

  // Get visible categories based on count
  getVisibleCategories() {
    return this.categories.slice(0, this.visibleCategoriesCount);
  }

  // Load more categories when button is clicked
  loadMoreCategories() {
    this.visibleCategoriesCount = this.categories.length; // Show all categories
  }

  protected readonly NoImage = NoImage;
}
