import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SignalTableComponent } from './components/signal-table/signal-table';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar';
import { ColumnSelectorComponent } from './components/column-selector/column-selector';
import { SignalFilters, ColumnConfig } from './models/signal-data.interface';
import { SignalDataService } from './services/signal-data.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    SignalTableComponent,
    FilterSidebarComponent,
    ColumnSelectorComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild(SignalTableComponent) signalTable!: SignalTableComponent;
  
  title = 'Amateur Radio Signal Monitor';
  sidenavOpened = true;
  columnConfig: ColumnConfig[] = [];

  constructor(private signalDataService: SignalDataService) {}

  ngOnInit(): void {
    this.columnConfig = this.signalDataService.getDefaultColumnConfig();
  }

  onFiltersChanged(filters: SignalFilters): void {
    this.signalTable.applyFilters(filters);
  }

  onColumnsChanged(columns: ColumnConfig[]): void {
    this.columnConfig = [...columns];
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
