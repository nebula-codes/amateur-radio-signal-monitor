import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil, catchError, finalize } from 'rxjs';
import { SignalData, SignalFilters } from '../../models/signal-data.interface';
import { SignalDataService } from '../../services/signal-data.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-signal-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './signal-table.html',
  styleUrl: './signal-table.css'
})
export class SignalTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'callSign',
    'frequency',
    'mode',
    'band',
    'signalStrength',
    'timestamp',
    'location',
    'country',
    'power',
    'notes'
  ];

  dataSource = new MatTableDataSource<SignalData>();
  allSignals: SignalData[] = [];
  isLoading = false;
  currentFilters: SignalFilters;

  private destroy$ = new Subject<void>();

  constructor(
    private signalDataService: SignalDataService,
    private filterService: FilterService,
    private snackBar: MatSnackBar
  ) {
    this.currentFilters = this.filterService.getEmptyFilters();
    
    // Initialize dataSource with empty data
    this.dataSource = new MatTableDataSource<SignalData>([]);
  }

  ngOnInit(): void {
    this.loadSignals();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    // Use setTimeout to ensure ViewChild is properly initialized
    setTimeout(() => {
      console.log('Setting up paginator and sort...');
      console.log('Paginator:', this.paginator);
      console.log('Sort:', this.sort);
      
      if (this.paginator && this.sort) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Set initial page size
        this.paginator.pageSize = 10;
        
        console.log('Paginator page size set to:', this.paginator.pageSize);
        console.log('Data source data length:', this.dataSource.data.length);
        
        // If we already have data, ensure paginator is applied
        if (this.allSignals.length > 0) {
          this.applyCurrentFilters();
        }
      } else {
        console.error('Paginator or Sort not available');
      }
    }, 100); // Increased timeout
  }

  loadSignals(): void {
    this.isLoading = true;
    
    this.signalDataService.getSignals()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading signals:', error);
          this.snackBar.open('Failed to load signal data', 'Close', { duration: 3000 });
          throw error;
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(signals => {
        console.log('Signals loaded:', signals.length);
        this.allSignals = signals;
        this.applyCurrentFilters();
        
        // Ensure paginator is properly connected after data load
        setTimeout(() => {
          if (this.paginator) {
            console.log('Reconnecting paginator after data load...');
            this.dataSource.paginator = this.paginator;
            this.paginator.pageSize = 10;
            this.paginator.firstPage();
            console.log('Paginator page size after data load:', this.paginator.pageSize);
            console.log('Current page:', this.paginator.pageIndex);
          }
        }, 50);
      });
  }

  applyFilters(filters: SignalFilters): void {
    this.currentFilters = filters;
    this.applyCurrentFilters();
  }

  private applyCurrentFilters(): void {
    const filteredSignals = this.filterService.applyFilters(this.allSignals, this.currentFilters);
    console.log('Applying filters - filtered signals count:', filteredSignals.length);
    this.dataSource.data = filteredSignals;
    
    // Reset paginator to first page when filters are applied
    if (this.paginator) {
      console.log('Resetting paginator to first page...');
      this.paginator.firstPage();
      console.log('Paginator connected:', !!this.dataSource.paginator);
      console.log('Page size:', this.paginator.pageSize);
    }
  }

  formatFrequency(frequency: number): string {
    return frequency.toFixed(3) + ' MHz';
  }

  formatSignalStrength(strength: number): string {
    return strength.toFixed(1) + ' dB';
  }

  formatPower(power: number): string {
    return power.toString() + ' W';
  }

  formatTimestamp(timestamp: Date): string {
    return new Date(timestamp).toLocaleString();
  }
}
