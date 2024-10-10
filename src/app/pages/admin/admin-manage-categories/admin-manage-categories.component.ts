import { Component, OnInit } from '@angular/core';
import { CategoryService } from "../../../service/category.service";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import NoImage from "../../../service/helper/noImage";
import {HttpBackend, HttpClient} from "@angular/common/http";
import {Offer} from "../../../model/Offer.model";
import baseURL from "../../../service/helper/helper";

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
  private selectedFile: File|any;
  private httpWithoutInterceptor: HttpClient;
  private uploadedImageUrl: any;


  constructor(
    private _categoryService: CategoryService,
    private _httpBackend: HttpBackend,
    private _fb: FormBuilder,
    private _http:HttpClient
  ) {
    this.httpWithoutInterceptor = new HttpClient(_httpBackend);
    this.categoryForm = this._fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryImage: [''],
      subcategories: this._fb.array([]) // Initialize with an empty array
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this._categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  get subcategories(): FormArray {
    return this.categoryForm.get('subcategories') as FormArray;
  }

  addSubCategory() {
    const subcategoryGroup = this._fb.group({
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
      this.subcategories.push(this._fb.group({
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
        this._categoryService.deleteCategory(categoryId).subscribe(() => {
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
        this._categoryService.updateCategory(this.editingCategoryId, newCategory).subscribe(data => {
          console.log(data);
          this.loadCategories(); // Refresh the list after update
          this.resetForm();

        }, error => {
          console.log(error);
        });
      } else {
        // Add new category
        this._categoryService.addCategory(newCategory).subscribe(data => {
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
          this._categoryService.deleteSubCategory(id).subscribe(() => {
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

  protected readonly NoImage = NoImage;

  changeCategoryImage(category: Category) {
    this.uploadImage("Category-Image",category)
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Get the selected file

    if (file) {
      // Check if the file size exceeds 5 MB
      const maxSizeInMB = 1;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        alert(`File size should be less than ${maxSizeInMB} MB.`);
        this.selectedFile = null; // Reset the selected file
      } else {
        this.selectedFile = file; // File is valid
      }
    }
  }


  uploadImage(folderName: string, category:Category) {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    // Step 1: Get the pre-signed URL from Spring Boot
    this._http.get<any>(`${baseURL}/auth/presigned-url/${folderName}`).subscribe(response => {
      const uploadUrl = response.url;
      const objectKey = response.key;  // Assuming backend returns the S3 key

      // Define the Content-Type
      const contentType = this.selectedFile?.type || 'application/octet-stream';

      // Step 2: Upload the image to S3 using the pre-signed URL
      this.httpWithoutInterceptor.put(uploadUrl, this.selectedFile, {
        headers: {
          'Content-Type': contentType
        },
        reportProgress: true,
        observe: 'events'
      }).subscribe(
        event => {
          if (event.type === 4) { // HttpEventType.Response
            console.log('Image successfully uploaded');



            // Step 3: Construct the image URL (replace with your actual bucket's URL)
            const bucketBaseUrl = 'https://harshal-ecom.s3.amazonaws.com/';
            this.uploadedImageUrl = `${bucketBaseUrl}${objectKey}`;
            console.log('Uploaded Image URL:', this.uploadedImageUrl);

            if (category.categoryImage != null) {
              this.deleteImage(category.categoryImage)
            }
            category.categoryImage = this.uploadedImageUrl;
            this._categoryService.updateCategoryImage(category).subscribe(() => {
            }, error => {
              console.log(error)
            })

            this.selectedFile = null;
            // Display image in the UI
          }
        },
        error => {
          console.error('Error uploading image:', error);
        }
      );
    });
  }

  deleteImage(oldImageUrl: any) {

    // Extract the key from the uploadedImageUrl
    // const key = this.uploadedImageUrl.split('/').pop(); // Extract the file name from the URL
    const key = oldImageUrl.split('https://harshal-ecom.s3.amazonaws.com/').pop(); // Extract the file name from the URL
    console.log(key)
    if (key) {
      this._http.delete(`${baseURL}/auth/delete-file?key=${key}`, {responseType: 'text'})
        .subscribe(
          response => {
            console.log('Response:', response); // This will now log the plain text "File deleted successfully"
            this.uploadedImageUrl = null; // Clear the URL after deletion
          },
          error => {
            console.error('Error deleting image:', error);
          }
        );
    } else {
      console.error('Unable to extract key from URL');
    }
  }

}
