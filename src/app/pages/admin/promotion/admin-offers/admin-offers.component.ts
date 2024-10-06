import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {OfferService} from "../../../../service/AdminService/offer.service";
import {AdminProductService} from "../../../../service/AdminService/admin-product.service";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {User} from "../../../../model/User.model";
import {Product} from "../../../../model/Product.model";
import {Offer} from "../../../../model/Offer.model";
import {MatOptionSelectionChange} from "@angular/material/core";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import NoImage from "../../../../service/helper/noImage";
import {HttpBackend, HttpClient} from "@angular/common/http";
import Swal from "sweetalert2";
import baseURL from "../../../../service/helper/helper";

@Component({
  selector: 'app-admin-offers',
  templateUrl: './admin-offers.component.html',
  styleUrl: './admin-offers.component.css'
})
export class AdminOffersComponent implements OnInit {
user:User;
products:Product[]=[]
offerForm: FormGroup|any;  // Form group for managing the offer form
  selectedProducts:Product[] = [];
  searchControl: FormControl;
  filteredProducts: Product[] = [];
  productsForm = new FormControl([]);
  activatedOffers: Offer[] = [];
  offer:Offer;
  displayedColumns: string[] = ['title', 'discount', 'description', 'startDate', 'endDate', 'products', 'imageUrl', 'actions'];
  dataSource = new MatTableDataSource<Offer>(this.activatedOffers);  // Bind this to your offers
  private httpWithoutInterceptor: HttpClient;
  uploadedImageUrl: string | null = null; // Store the uploaded image URL

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  private selectedFile: File|any;



  constructor(private _fb: FormBuilder,
              private _offerService: OfferService,
              private _adminProductService:AdminProductService,
              private _http:HttpClient,
              private httpBackend: HttpBackend,
              private _initializerService:InitializerService) {
    this.user = _initializerService.initializeUser()
    this.offer = _initializerService.initializeOffer()
    this.httpWithoutInterceptor = new HttpClient(httpBackend);


    this.searchControl = new FormControl(''); // Create a FormControl for search input
    this.offerForm = this._fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      discount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      imageUrl: ['', Validators.required],
      products: [[], this.atLeastOneProductSelected()]

    });

    this.searchControl = new FormControl(''); // Create a FormControl for search input

  }

  filtered(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchValue)
    );
  }
  atLeastOneProductSelected(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = control.value && control.value.length > 0;
      return valid ? null : { atLeastOneRequired: true };
    };
  }


  ngOnInit(): void {
    this.loadProducts();
    this.loadActivatedOffer()

    // Listen for search input changes and filter products
    this.searchControl.valueChanges.subscribe((searchQuery) => {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  loadActivatedOffer() {
    this._offerService.getActiveOffers().subscribe(data => {
      console.log(data);  // Log the received offers
      this.activatedOffers = data;
      this.dataSource.data = this.activatedOffers;  // Assign data to the table's dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      console.error('Error fetching offers:', error);
    });
  }




  private loadProducts() {
    this._adminProductService.getAllProductDetails().subscribe(data => {
      this.products = data;
      this.filteredProducts = this.products;
    })
  }

  onChangeProduct(event: any): void {
    const product = event.source.value;
    const productsControl = this.offerForm.get('products');

    if (event.isUserInput) {
      if (event.source.selected) {
        this.selectedProducts.push(product);
      } else {
        const index = this.selectedProducts.indexOf(product);
        if (index >= 0) {
          this.selectedProducts.splice(index, 1);
        }
      }
      productsControl.setValue(this.selectedProducts);
    }
  }
  /**
   * Submits the offer to the backend via the offer service.
   */
  onSubmit(): void {
    if (this.offerForm.valid && this.selectedProducts != null) {

      const offer:Offer = {
        title: this.offerForm.value.title,
        description: this.offerForm.value.description,
        discount: this.offerForm.value.discount,
        startDate: this.offerForm.value.startDate,
        endDate: this.offerForm.value.endDate,
        imageUrl: this.offerForm.value.imageUrl,
        products: this.selectedProducts
      }
      console.log(offer)

      this._offerService.createOffer(offer).subscribe({
        next: (response) => {
          console.log('Offer created successfully!', response);
          console.log(response)
          this.offerForm.reset();
          this.ngOnInit()
        },
        error: (error) => {
          console.error('Error creating offer', error);
        }
      });
    }
  }


  editOffer(offer:any) {

  }

  deleteOffer(offer:any) {
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
          this._offerService.deleteOffer(offer.id).subscribe(() => {
            Swal.fire('Deleted!', 'Offer has been deleted.', 'success');
            this.ngOnInit()
          }, error => {
            console.log(error)
            Swal.fire('Error!', 'There was a problem deleting the offer.', 'error');
          });

      }
    });

  }


  uploadImage(folderName: string, offer:Offer) {
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

              if (offer.imageUrl != null) {
                this.deleteImage(offer.imageUrl)
              }
              offer.imageUrl = this.uploadedImageUrl;
              this._offerService.updateOffer(offer).subscribe(() => {
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

  protected readonly NoImage = NoImage;


  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }

}
