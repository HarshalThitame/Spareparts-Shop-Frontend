import { Pipe, PipeTransform } from '@angular/core';
import {OrderItem} from "../model/OrderItem.model";

@Pipe({
  name: 'filterByProductID',
  standalone: true
})
export class FilterByProductIDPipe implements PipeTransform {

  transform(orderItems: OrderItem[], productId: number): OrderItem[] {
    if (!orderItems || !productId) return orderItems;
    return orderItems.filter(item => item.product.id === productId);
  }

}
