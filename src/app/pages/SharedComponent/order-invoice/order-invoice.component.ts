import { Component, Input } from '@angular/core';
import {Order} from "../../../model/Order.model";

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
  styleUrl: './order-invoice.component.css'
})
export class OrderInvoiceComponent {
  @Input() order!: Order;

  // Calculate the subtotal for the order
  getOrderSubtotal(): number {
    return this.order.orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  }



  // Print the invoice
  printInvoice(): void {
    const printContents = document.getElementById('invoice')?.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents || '';
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  getDiscount(price: number, discountOnPurchase: number, quantity: number) {
    return ((price*discountOnPurchase)/100)*quantity;
  }

  getOrderGst() {

    return this.order.orderItems.reduce((sum,item)=>sum + item.taxAmount,0)
  }
}
