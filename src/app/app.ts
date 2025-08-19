import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SignalTableComponent } from './components/signal-table/signal-table';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar';
import { SignalFilters } from './models/signal-data.interface';

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
    FilterSidebarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild(SignalTableComponent) signalTable!: SignalTableComponent;
  
  title = 'Amateur Radio Signal Monitor';
  sidenavOpened = true;

  onFiltersChanged(filters: SignalFilters): void {
    this.signalTable.applyFilters(filters);
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
