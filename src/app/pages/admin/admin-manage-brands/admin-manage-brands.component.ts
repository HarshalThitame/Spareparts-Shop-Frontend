import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import {Brand} from "../../../model/Brand.model";
import {AdminBrandService} from "../../../service/AdminService/admin-brand.service";

@Component({
  selector: 'app-admin-manage-brands',
  templateUrl: './admin-manage-brands.component.html',
  styleUrls: ['./admin-manage-brands.component.css']
})
export class AdminManageBrandsComponent implements OnInit {
  brandForm!: FormGroup;
  brands: Brand[] = [];
  editingBrandId: any = null;

  constructor(
    private brandService: AdminBrandService,
    private fb: FormBuilder
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      brandModels: this.fb.array([]) // Initialize with an empty array
    });
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getAllBrands().subscribe(data => {
      this.brands = data;
    });
  }

  get brandModels(): FormArray {
    return this.brandForm.get('brandModels') as FormArray;
  }

  addBrandModel() {
    const brandModelGroup = this.fb.group({
      id: [null], // Initialize with null for new brand models
      name: ['', Validators.required]
    });
    this.brandModels.push(brandModelGroup);
  }

  removeBrandModel(index: number, model: any) {
    const modelId = model.value.id;
    this.brandModels.removeAt(index);
    this.deleteBrandModel(modelId);
  }

  editBrand(brand: Brand) {
    this.editingBrandId = brand.id;
    this.brandForm.patchValue({
      name: brand.name
    });

    this.brandModels.clear(); // Clear existing brand models
    brand.brandModels.forEach(model => {
      this.brandModels.push(this.fb.group({
        id: [model.id], // Set the brand model ID
        name: [model.name, Validators.required]
      }));
    });
  }

  deleteBrand(brandId: any) {
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
        this.brandService.deleteBrand(brandId).subscribe(() => {
          this.brands = this.brands.filter(brand => brand.id !== brandId);
          Swal.fire('Deleted!', 'Your brand has been deleted.', 'success');
        }, error => {
          Swal.fire('Error!', 'There was a problem deleting the brand.', 'error');
        });
      }
    });
  }

  onSubmit() {
    if (this.brandForm.valid) {
      const formValue = this.brandForm.value;

      const newBrand: Brand = {
        ...formValue,
        brandModels: formValue.brandModels.map((model: { id: any; name: any; }) => ({
          id: model.id,
          name: model.name
        }))
      };

      if (this.editingBrandId !== null) {
        this.brandService.updateBrand(this.editingBrandId, newBrand).subscribe(data => {
          this.loadBrands(); // Refresh the list after update
          this.resetForm();
        }, error => {
          console.log(error);
        });
      } else {
        this.brandService.addBrand(newBrand).subscribe(data => {
          this.brands.push(data);
          this.resetForm();
        });
      }
    }
  }

  resetForm() {
    this.brandForm.reset();
    this.brandModels.clear();
    this.editingBrandId = null;
  }

  deleteBrandModel(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This brand model will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (id != null) {
          this.brandService.deleteBrandModel(id).subscribe(() => {
            const index = this.brandModels.controls.findIndex(model => model.value.id === id);
            if (index !== -1) {
              this.brandModels.removeAt(index);
            }
            Swal.fire('Deleted!', 'Brand model has been deleted.', 'success');
          }, error => {
            Swal.fire('Error!', 'There was a problem deleting the brand model.', 'error');
          });
        }
      }
    });
  }
}
