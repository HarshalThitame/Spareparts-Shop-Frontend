import { Component, OnInit } from '@angular/core';
import { CategoryService } from "../../../service/category.service";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';

 interface SubCategory {
  id?: number; // Optional, only set when editing
  name: string;
  description?: string;
}

 interface Category {
  id?: number; // Optional, only set when editing
  name: string;
  description?: string;
  categoryImage?: string;
  subCategories: SubCategory[];
}

@Component({
  selector: 'app-admin-manage-categories',
  templateUrl: './admin-manage-categories.component.html',
  styleUrls: ['./admin-manage-categories.component.css']
})
export class AdminManageCategoriesComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: Category[] = [];
  editingCategoryId: any = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryImage: [''],
      subcategories: this.fb.array([]) // Initialize with an empty array
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  get subcategories(): FormArray {
    return this.categoryForm.get('subcategories') as FormArray;
  }

  addSubCategory() {
    const subcategoryGroup = this.fb.group({
      id: [null], // Initialize with null for new subcategories
      name: ['', Validators.required],
      description: ['']
    });
    this.subcategories.push(subcategoryGroup);
  }

  removeSubCategory(index: number, sub: any) {
    const subcategoryId = sub.value.id;
    this.subcategories.removeAt(index);
    this.deleteSubCategory(subcategoryId)

  }

  editCategory(category: Category) {
    this.editingCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      categoryImage: category.categoryImage
    });

    this.subcategories.clear(); // Clear existing subcategories
    category.subCategories.forEach(sub => {
      this.subcategories.push(this.fb.group({
        id: [sub.id], // Set the subcategory ID
        name: [sub.name, Validators.required],
        description: [sub.description]
      }));
    });
  }

  deleteCategory(categoryId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(categoryId).subscribe(() => {
          this.categories = this.categories.filter(category => category.id !== categoryId);
          Swal.fire(
            'Deleted!',
            'Your category has been deleted.',
            'success'
          );
        }, error => {
          Swal.fire(
            'Error!',
            'There was a problem deleting the category.',
            'error'
          );
        });
      }
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;

      // Map the form value to the Category model
      const newCategory: Category = {
        ...formValue,
        subCategories: formValue.subcategories.map((sub: { id: any; name: any; description: any; }) => ({
          id: sub.id, // Include the subcategory ID if it exists
          name: sub.name,
          description: sub.description
        }))
      };

      if (this.editingCategoryId !== null) {
        // Update existing category
        this.categoryService.updateCategory(this.editingCategoryId, newCategory).subscribe(data => {
          console.log(data);
          this.loadCategories(); // Refresh the list after update
          this.resetForm();

        }, error => {
          console.log(error);
        });
      } else {
        // Add new category
        this.categoryService.addCategory(newCategory).subscribe(data => {
          this.categories.push(data);
          console.log(data)
          this.resetForm();
        });
      }

      // this.resetForm();
    }
  }

  resetForm() {
    this.categoryForm.reset();
    this.subcategories.clear();
    this.editingCategoryId = null;
  }

  scrollToCategory(id: any) {
    const element = document.getElementById(`subcategories-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  deleteSubCategory(id: any) {
    // Show confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "This subcategory will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove from form array
        // If there's an ID, make a request to delete it from the server
        if (id != null) {
          this.categoryService.deleteSubCategory(id).subscribe(() => {
            const index = this.subcategories.controls.findIndex(sub => sub.value.id === id);
            if (index !== -1) {
              this.subcategories.removeAt(index);
            }
            Swal.fire(
              'Deleted!',
              'Subcategory has been deleted.',
              'success'
            );
            window.location.reload();
          }, error => {
            console.error(error);
            Swal.fire(
              'Error!',
              'There was a problem deleting the subcategory.',
              'error'
            );
          });
        }
      }
    });
  }
}
