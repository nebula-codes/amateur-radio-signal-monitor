import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil, catchError, finalize } from 'rxjs';

import { SignalData, SignalFilters } from '../../models/signal-data.interface';
import { SignalDataService } from '../../services/signal-data.service';
import { FilterService } from '../../services/filter.service';
import { SignalDetailModal } from '../signal-detail-modal/signal-detail-modal';

@Component({
  selector: 'app-thumbnail-browser',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './thumbnail-browser.html',
  styleUrl: './thumbnail-browser.css'
})
export class ThumbnailBrowserComponent implements OnInit, OnDestroy {
  @Input() filters: SignalFilters | null = null;

  signals: SignalData[] = [];
  filteredSignals: SignalData[] = [];
  paginatedSignals: SignalData[] = [];
  isLoading = false;
  pageSize = 30;
  currentPageIndex = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private signalDataService: SignalDataService,
    private filterService: FilterService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.filters) {
      this.filters = this.filterService.getEmptyFilters();
    }
    this.loadSignals();
  }

  onPageChange(event: PageEvent): void {
    console.log('THUMBNAIL BROWSER - Page change event:', event);
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedSignals();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSignals(): void {
    this.isLoading = true;
    
    this.signalDataService.getSignals()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading signals:', error);
          this.snackBar.open('Error loading signal data', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          throw error;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        this.signals = data;
        console.log('THUMBNAIL BROWSER - signals loaded:', data.length);
        if (this.filters) {
          this.applyFilters(this.filters);
        } else {
          // If no filters provided, show all signals
          this.filteredSignals = this.signals;
          console.log('THUMBNAIL BROWSER - no filters, showing all signals:', this.filteredSignals.length);
          // Use setTimeout to ensure paginator is initialized
          setTimeout(() => this.updatePaginatedSignals());
        }
      });
  }

  applyFilters(filters: SignalFilters): void {
    this.filters = filters;
    console.log('THUMBNAIL BROWSER - applying filters:', filters);
    this.filteredSignals = this.filterService.applyFilters(this.signals, filters);
    console.log('THUMBNAIL BROWSER - filtered signals count:', this.filteredSignals.length);
    
    // Reset pagination to first page when filters change
    this.currentPageIndex = 0;
    // Use setTimeout to ensure paginator is initialized
    setTimeout(() => this.updatePaginatedSignals());
  }

  updatePaginatedSignals(): void {
    const startIndex = this.currentPageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSignals = this.filteredSignals.slice(startIndex, endIndex);
    console.log('THUMBNAIL BROWSER - updatePaginatedSignals called');
    console.log('THUMBNAIL BROWSER - Paginated signals:', this.paginatedSignals.length, 'from', startIndex, 'to', endIndex);
    console.log('THUMBNAIL BROWSER - Total filtered signals:', this.filteredSignals.length);
    console.log('THUMBNAIL BROWSER - Current page index:', this.currentPageIndex, 'page size:', this.pageSize);
  }

  openSignalDetail(signal: SignalData): void {
    const dialogRef = this.dialog.open(SignalDetailModal, {
      data: signal,
      width: '70vw',
      height: '80vh',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      panelClass: 'signal-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Signal detail modal was closed');
    });
  }

  getSignalImageUrl(signal: SignalData): string {
    // Generate a placeholder image URL based on signal properties
    // In a real app, this would be the actual signal image URL
    const width = 300;
    const height = 200;
    const seed = signal.id;
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }

  formatFrequency(frequency: number): string {
    return frequency.toFixed(3) + ' MHz';
  }

  formatTimestamp(timestamp: Date): string {
    return new Date(timestamp).toLocaleString();
  }
}
