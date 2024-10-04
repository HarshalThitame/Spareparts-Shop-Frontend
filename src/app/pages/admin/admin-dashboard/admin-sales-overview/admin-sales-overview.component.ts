import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Chart, registerables} from "chart.js";
import {Order} from "../../../../model/Order.model";
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";

Chart.register(...registerables);

@Component({
  selector: 'app-admin-sales-overview',
  templateUrl: './admin-sales-overview.component.html',
  styleUrl: './admin-sales-overview.component.css'
})
export class AdminSalesOverviewComponent implements OnInit {
  orders: Order[] = [];
  salesChart: Chart | undefined;
  totalSales: number = 0;
  monthlyGrowth: number = 0;
  customMonths: number | undefined; // Declare a property for custom months
  selectedMonthSalesTotal = 0;
  selectedChartType: any = 'line';

  constructor(private _adminOrderService: AdminOrderService) {
  }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this._adminOrderService.getAllOrders().subscribe(
      (data: Order[]) => {
        console.log('Fetched Orders:', data);
        for (let i = 0; i < data.length; i++) {
          if (data[i].status === 'PAID') {
            this.orders.push(data[i])
          }
        }
        console.log(this.orders)
        this.calculateTotalSales(); // Calculate total sales after fetching orders
        this.filterOrders('3months'); // Set the initial filter to last 3 months
        this.updateSelectedMonthSalesTotal(); // Update selected month sales total

      },
      error => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  calculateTotalSales() {
    this.totalSales = this.orders.reduce((acc, order) => acc + order.totalAmount, 0);
  }

  calculateMonthlyGrowth() {
    const monthlyTotals = this.getMonthlyTotals(2); // Get totals for the last two months
    const lastMonthSales = monthlyTotals[1]; // Latest month sales
    const previousMonthSales = monthlyTotals[0]; // Previous month sales

    if (previousMonthSales === 0) {
      this.monthlyGrowth = lastMonthSales > 0 ? 100 : 0; // Handle division by zero
    } else {
      this.monthlyGrowth = ((lastMonthSales - previousMonthSales) / previousMonthSales) * 100; // Calculate growth percentage
    }
  }

  // Method to get the total sales amount for the specified months
  getMonthlySalesTotal(months: number): number {
    const now = new Date();
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months); // Calculate cutoff date

    return this.orders
      .filter(order => {
        if (order.createdAt) {
          const orderDate = new Date(order.createdAt);
          return orderDate >= cutoffDate && orderDate <= now; // Filter orders within range
        }
        return false;
      })
      .reduce((total, order) => total + order.totalAmount, 0); // Sum totalAmount of filtered orders
  }


  filterOrders(range: string | any) {
    if (typeof range === 'number' && range > 0) {
      // If a valid custom number is provided
      this.processOrders(range); // Process custom months
    } else {
      // Handle predefined ranges
      let monthlyTotals: number[] = [];
      let labels: string[] = [];

      switch (range) {
        case '1month':
          monthlyTotals = this.getMonthlyTotals(1);
          labels = this.getLastMonthsLabels(1);
          break;
        case '3months':
          monthlyTotals = this.getMonthlyTotals(3);
          labels = this.getLastMonthsLabels(3);
          break;
        case '6months':
          monthlyTotals = this.getMonthlyTotals(6);
          labels = this.getLastMonthsLabels(6);
          break;
        case '1year':
          monthlyTotals = this.getMonthlyTotals(12);
          labels = this.getLastMonthsLabels(12);
          break;
        case 'all':
          monthlyTotals = this.getTotalAmountForAllOrders();
          labels = this.orders.map(order => {
            if (order.createdAt) {
              return new Date(order.createdAt).toLocaleString('default', {month: 'long'});
            }
            return ''; // Handle undefined case
          });
          break;
      }

      this.createSalesChart(monthlyTotals, labels); // Pass monthly totals and labels to the chart
    }
    this.calculateMonthlyGrowth(); // Calculate monthly growth whenever orders are filtered
    this.updateSelectedMonthSalesTotal(); // Update selected month sales total
  }

  processOrders(months: number) {
    const monthlyTotals = this.getMonthlyTotals(months);
    const labels = this.getLastMonthsLabels(months);
    this.createSalesChart(monthlyTotals, labels);
    this.calculateMonthlyGrowth(); // Update monthly growth
    this.updateSelectedMonthSalesTotal(); // Update selected month sales total
  }

  updateSelectedMonthSalesTotal() {
    const selectedMonthIndex = this.customMonths || 3; // Default to 3 if undefined
    this.selectedMonthSalesTotal = this.getMonthlyTotals(selectedMonthIndex)[0] || 0; // Get total for the most recent selected month
  }

  getMonthlyTotals(months: number): number[] {
    const totals: number[] = new Array(months).fill(0);
    const now = new Date();

    for (const order of this.orders) {
      if (order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const monthDiff = (now.getFullYear() - orderDate.getFullYear()) * 12 + (now.getMonth() - orderDate.getMonth());

        if (monthDiff >= 0 && monthDiff < months) {
          totals[months - 1 - monthDiff] += order.totalAmount; // Reverse indexing to have latest month first
        }
      }
    }

    return totals; // Return totals as is
  }


  getTotalAmountForAllOrders(): number[] {
    const total = this.orders.reduce((acc, order) => acc + order.totalAmount, 0);
    return [total]; // Returning an array for consistency
  }

  getLastMonthsLabels(months: number): string[] {
    const labels: string[] = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      labels.push(date.toLocaleString('default', {month: 'short', year: '2-digit'}));
    }

    return labels;
  }

  createSalesChart(data: number[] = [], labels: string[] = []) {
    const canvasElement = document.getElementById('salesChart') as HTMLCanvasElement;
    const ctx = canvasElement?.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas 2D context');
      return; // Exit if context is not available
    }

    if (this.salesChart) {
      this.salesChart.destroy(); // Destroy the previous chart instance
    }

    this.salesChart = new Chart(ctx, {
      type: this.selectedChartType,
      data: {
        labels: labels.length > 0 ? labels : [],
        datasets: [{
          label: 'Sales Amount',
          data: data,
          backgroundColor: this.colors,
          borderColor: this.colors.map(color => color.replace(/0\.6/, '1')), // Replace alpha to 1 for border
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: this.getResponsiveFontSize() // Set responsive size for Y-axis
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: this.getResponsiveFontSize() // Set responsive size for X-axis
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: this.getResponsiveFontSize() // Set responsive size for legend
              }
            }
          }
        }
      }
    });
  }

  getResponsiveFontSize(): number {
    if (window.innerWidth < 576) {
      return 8; // Font size for mobile
    } else if (window.innerWidth < 768) {
      return 10; // Font size for tablets
    } else {
      return 12; // Font size for desktops
    }
  }

  onChartTypeChange(value: any) {
    this.selectedChartType = value;
    this.filterOrders(3)
  }

  colors: string[] = [
    'rgba(255, 99, 132, 0.6)', // Red
    'rgba(54, 162, 235, 0.6)', // Blue
    'rgba(255, 206, 86, 0.6)', // Yellow
    'rgba(75, 192, 192, 0.6)', // Green
    'rgba(153, 102, 255, 0.6)', // Purple
    'rgba(255, 159, 64, 0.6)', // Orange
    'rgba(199, 199, 199, 0.6)', // Grey
    'rgba(239, 255, 0, 0.6)',   // Bright Yellow
    'rgba(0, 255, 0, 0.6)',     // Bright Green
    'rgba(0, 0, 255, 0.6)',     // Bright Blue
    'rgba(255, 0, 255, 0.6)',   // Magenta
    'rgba(255, 128, 0, 0.6)',   // Orange-Red
    'rgba(128, 0, 255, 0.6)',   // Violet
    'rgba(0, 128, 128, 0.6)',   // Teal
    'rgba(128, 128, 0, 0.6)',    // Olive
    'rgba(0, 128, 0, 0.6)',      // Dark Green
    'rgba(128, 0, 0, 0.6)',      // Maroon
    'rgba(255, 192, 203, 0.6)',  // Pink
    'rgba(192, 192, 192, 0.6)',  // Silver
    'rgba(240, 230, 140, 0.6)',  // Khaki
    'rgba(135, 206, 250, 0.6)',  // Light Sky Blue
    'rgba(255, 215, 0, 0.6)',    // Gold
    'rgba(219, 112, 147, 0.6)',  // Pale Violet Red
    'rgba(0, 206, 209, 0.6)',    // Dark Turquoise
    'rgba(173, 216, 230, 0.6)',  // Light Blue
    'rgba(255, 165, 0, 0.6)'     // Orange
  ];

}
