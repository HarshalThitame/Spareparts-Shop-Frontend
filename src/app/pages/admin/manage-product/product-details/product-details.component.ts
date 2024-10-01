import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../../model/User.model";
import {Product} from "../../../../model/Product.model";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {AdminProductService} from "../../../../service/AdminService/admin-product.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";
import {Order} from "../../../../model/Order.model";
import {OrderStatus} from "../../../../model/OrderStatus.model";
import {MatTableDataSource} from "@angular/material/table";
import {FileUploadService} from "../../../../service/AWSService/file-upload.service";
import {HttpBackend, HttpClient} from "@angular/common/http";
import NoImage from "../../../../service/helper/noImage";
import {Image} from "../../../../model/Image.model";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  id: any;
  user: User;
  product: Product;
  selectedFile: File | null = null;
  selectedImageUrl: any;
  productMetrics = {
    totalSales: 0,
    totalPaidOrders: 0,
    totalRevenue: 0,
    orderStatusCounts: {} as Record<string, number>, // To hold counts for each order status
    totalDiscountGiven: 0,
    totalGSTCollected: 0
  };

  uploadedImageUrl: string | null = null; // Store the uploaded image URL
  orderStatusKeys = Object.values(OrderStatus); // Get an array of order status keys
  productOrders: Order[] = [];
  displayedColumns: string[] = ['id', 'status', 'totalPrice', 'quantity', 'orderDate', 'details'];
  dataSource = new MatTableDataSource<Order>(); // Use MatTableDataSource for the orders
  private httpWithoutInterceptor: HttpClient;


  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminProductService: AdminProductService,
              private _adminOrderService: AdminOrderService,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar,
              private _adminFileUploadService: FileUploadService,
              private _initializerService: InitializerService,
              private _http: HttpClient,
              private httpBackend: HttpBackend) {
    this.user = _initializerService.initializeUser();
    this.product = this._initializerService.initializeProduct()
    this.httpWithoutInterceptor = new HttpClient(httpBackend);

  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');

    this.loadUser();
    this.loadProduct(this.id)
  }


  loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
    })
  }

  loadProduct(id: any) {
    this._adminProductService.getProductDetails(id).subscribe(data => {
      this.product = data;
      this.selectedImageUrl = this.product.mainImage;
      this.loadOrders()
      console.log(this.product)
    })
  }

  loadOrders() {
    this._adminOrderService.getAllOrders().subscribe(orders => {
      this.productMetrics = this.calculateProductMetrics(this.product, orders);
      this.productOrders = this.getProductOrders(orders); // Populate the productOrders array
      this.dataSource.data = this.productOrders; // Set the data source for the table

    });
  }

  getProductOrders(orders: Order[]): Order[] {
    return orders.filter(order =>
      order.orderItems.some(item => item.product.id === this.product.id)
    );
  }

  getTotalPrice(order: Order): number {
    return order.orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
  }

  // Method to get the total quantity of the product in the order
  getProductQuantity(order: Order): number {
    return order.orderItems
      .filter(item => item.product.id === this.product.id)
      .reduce((acc, item) => acc + item.quantity, 0);
  }


  calculateProductMetrics(product: Product, orders: Order[]): any {
    let totalSales = 0;
    let totalPaidOrders = 0;
    let totalRevenue = 0;
    let totalDiscountGiven = 0;
    let totalGSTCollected = 0;

    // Initialize counts for each order status
    const orderStatusCounts = {
      PENDING: 0,
      CONFIRMED: 0,
      UNPAID: 0,
      PAID: 0,
      CANCELLED: 0,
      REJECTED: 0,
      RETURNED: 0
    };

    orders.forEach(order => {
      let hasProduct = false;

      order.orderItems.forEach(item => {
        if (item.product.id === product.id) {
          totalSales += item.quantity;
          totalRevenue += item.totalPrice;
          totalDiscountGiven += item.discountAmount;
          totalGSTCollected += item.taxAmount ? item.taxAmount : 0;
          hasProduct = true;
        }
      });

      // If the order has the product, count the order status
      if (hasProduct) {
        orderStatusCounts[order.status]++;
        if (order.status === 'PAID') {
          totalPaidOrders++;
        } else if (order.status === OrderStatus.PENDING) {
          orderStatusCounts["PENDING"]++;
        } else if (order.status === OrderStatus.CONFIRMED) {
          orderStatusCounts["CONFIRMED"]++;
        } else if (order.status === OrderStatus.UNPAID) {
          orderStatusCounts["UNPAID"]++;
        } else if (order.status === OrderStatus.CANCELLED) {
          orderStatusCounts["CANCELLED"]++;
        } else if (order.status === OrderStatus.RETURNED) {
          orderStatusCounts["RETURNED"]++;
        } else if (order.status === OrderStatus.REJECTED) {
          orderStatusCounts["REJECTED"]++;
        }
      }
    });

    return {
      totalSales,
      totalPaidOrders,
      totalRevenue,
      totalDiscountGiven,
      totalGSTCollected,
      orderStatusCounts // Return the counts of each status
    };
  }


  calculateDiscountedPrice(mrp: number, discount: number): number {
    return mrp - (mrp * discount / 100);
  }

  applyDiscount() {
    if (this.product.discountOnPurchase >= 0 && this.product.discountOnPurchase <= 100 ||
      this.product.discountToRetailer >= 0 && this.product.discountToRetailer <= 100 ||
      this.product.discountToMechanics >= 0 && this.product.discountToMechanics <= 100) {
      this._adminProductService.addOrUpdateProduct(this.product).subscribe(() => {
          this._snackBar.open(`Discount Applied`, "", {duration: 3000})
        },
        error => {
          this._snackBar.open("Error while applying discount.", "", {duration: 3000})
        })
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return '#FF9800'; // Orange
      case 'CONFIRMED':
        return '#2196F3'; // Blue
      case 'UNPAID':
        return '#F44336'; // Red
      case 'PAID':
        return '#4CAF50'; // Green
      case 'CANCELLED':
        return '#9E9E9E'; // Grey
      case 'REJECTED':
        return '#F44336'; // Red
      case 'RETURNED':
        return '#FFEB3B'; // Yellow
      default:
        return '#FFFFFF'; // Default color
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      const fileName = this.selectedFile.name;

      // Get the pre-signed URL from Spring Boot backend
      this._http.get(`/api/admin/presigned-url/upload/${fileName}`, {responseType: 'text'})
        .subscribe((presignedUrl: string) => {
          // Upload the file directly to S3 using the pre-signed URL
          this._http.put(presignedUrl, this.selectedFile).subscribe(
            () => {
              console.log('File uploaded successfully!');
            },
            error => {
              console.error('File upload failed:', error);
            }
          );
        });
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }

  uploadMainImage() {
    this.uploadImage('Main-Image')
  }

  uploadCoverImage(){
    this.uploadImage('Cover-Images')
  }

  uploadImage(folderName: string) {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    // Step 1: Get the pre-signed URL from Spring Boot
    this._http.get<any>(`http://localhost:8080/api/auth/presigned-url/${folderName}`).subscribe(response => {
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

            if (folderName === 'Main-image') {
              if (this.product.mainImage != null) {
                this.deleteImage(this.product.mainImage)
              }
              this.product.mainImage = this.uploadedImageUrl;
              this._adminProductService.addOrUpdateProduct(this.product).subscribe(() => {
              }, error => {
                console.log(error)
              })
            }else if(folderName==='Cover-Images'){
              const image:any= {
                url: this.uploadedImageUrl,
                productId: this.product.id,
              }
              this._adminProductService.addProductCoverImages(image).subscribe(() => {
              }, error => {
                console.log(error)
              })
            }

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
      this._http.delete(`http://localhost:8080/api/auth/delete-file?key=${key}`, {responseType: 'text'})
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

  onImageHover(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }


}
