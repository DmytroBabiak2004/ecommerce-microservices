import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from '../../services/orders';
import { OrderResponse } from '../../models/models';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../../shared/shared-material.module';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'createdAt', 'totalAmount', 'status'];
  dataSource: MatTableDataSource<OrderResponse>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    constructor(private ordersService: OrdersService, private cdr: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<OrderResponse>([]);
  }

    ngOnInit(): void {
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Error fetching orders', err);
        this.isLoading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}