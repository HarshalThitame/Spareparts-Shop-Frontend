import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../../../model/Order.model";
import { OrderStatus } from '../../../../model/OrderStatus.model';
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";
import {Chart, ChartData, ChartOptions} from "chart.js";



@Component({
  selector: 'app-admin-order-management',
  templateUrl: './admin-order-management.component.html',
  styleUrl: './admin-order-management.component.css'
})
export class AdminOrderManagementComponent implements OnInit, AfterViewInit {
  orders: Order[] = [];
  orderStatuses = Object.values(OrderStatus);
  orderCounts = {
    [OrderStatus.PENDING]: 0,
    [OrderStatus.CONFIRMED]: 0,
    [OrderStatus.UNPAID]: 0,
    [OrderStatus.PAID]: 0,
    [OrderStatus.CANCELLED]: 0,
    [OrderStatus.REJECTED]: 0,
    [OrderStatus.RETURNED]: 0,
  };

  chart: Chart | any;

  @ViewChild('ordersChart', {static: false}) chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private _adminOrderService: AdminOrderService) {
  }

  ngOnInit(): void {
    this.getAllOrders();
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  getAllOrders() {
    this._adminOrderService.getAllOrders().subscribe(data => {
      this.orders = data;
      this.calculateOrderCounts();
      this.updateChart();
    });
  }

  calculateOrderCounts() {
    this.orders.forEach(order => {
      this.orderCounts[order.status] = (this.orderCounts[order.status] || 0) + 1;
    });
  }

  initializeChart() {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: Object.keys(this.orderCounts),
        datasets: [{
          data: Object.values(this.orderCounts),
          backgroundColor: [
            '#FFB74D', // Blue
            '#81C784', // Red
            '#EF5350', // Yellow
            '#64B5F6', // Teal
            '#E0E0E0', // Purple
            '#F48FB1', // Orange
            '#FFE082'  // Light Orange
          ],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.labels = Object.keys(this.orderCounts);
      this.chart.data.datasets[0].data = Object.values(this.orderCounts);
      this.chart.update();
    }
  }

  getStatusColor(status: any): string {
    switch (status) {
      case OrderStatus.PENDING:
        return '#FFB74D'; // Light Orange
      case OrderStatus.CONFIRMED:
        return '#81C784'; // Light Green
      case OrderStatus.UNPAID:
        return '#EF5350'; // Light Red
      case OrderStatus.PAID:
        return '#64B5F6'; // Light Blue
      case OrderStatus.CANCELLED:
        return '#E0E0E0'; // Light Grey
      case OrderStatus.REJECTED:
        return '#F48FB1'; // Light Pink
      case OrderStatus.RETURNED:
        return '#FFE082'; // Light Amber
      default:
        return '#FFFFFF'; // Default color
    }
  }


}
