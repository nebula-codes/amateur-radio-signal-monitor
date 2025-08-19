import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ColumnConfig } from '../../models/signal-data.interface';

@Component({
  selector: 'app-column-selector',
  imports: [
    CommonModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './column-selector.html',
  styleUrl: './column-selector.css'
})
export class ColumnSelectorComponent {
  @Input() columns: ColumnConfig[] = [];
  @Output() columnsChange = new EventEmitter<ColumnConfig[]>();

  onColumnToggle(column: ColumnConfig): void {
    column.visible = !column.visible;
    this.columnsChange.emit([...this.columns]);
  }

  selectAll(): void {
    this.columns.forEach(col => col.visible = true);
    this.columnsChange.emit([...this.columns]);
  }

  selectNone(): void {
    this.columns.forEach(col => col.visible = false);
    this.columnsChange.emit([...this.columns]);
  }

  resetToDefault(): void {
    // Reset to commonly used columns
    const defaultVisible = ['id', 'callSign', 'frequency', 'mode', 'band', 'signalStrength', 'timestamp'];
    this.columns.forEach(col => {
      col.visible = defaultVisible.includes(col.key);
    });
    this.columnsChange.emit([...this.columns]);
  }
}
