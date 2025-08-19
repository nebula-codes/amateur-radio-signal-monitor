import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SignalFilters } from '../../models/signal-data.interface';
import { SignalDataService } from '../../services/signal-data.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter-sidebar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.css'
})
export class FilterSidebarComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<SignalFilters>();

  filterForm!: FormGroup;
  
  availableModes: string[] = [];
  availableBands: string[] = [];
  availableCountries: string[] = [];
  availableCallSigns: string[] = [];

  constructor(
    private signalDataService: SignalDataService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadFilterOptions();
  }

  private initializeForm(): void {
    // Enhanced regex pattern for 24-hour time format
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    
    this.filterForm = new FormGroup({
      modes: new FormControl([]),
      bands: new FormControl([]),
      countries: new FormControl([]),
      callSigns: new FormControl([]),
      startDate: new FormControl(null),
      startTime: new FormControl('', [Validators.pattern(timePattern)]),
      endDate: new FormControl(null),
      endTime: new FormControl('', [Validators.pattern(timePattern)]),
      frequencyMin: new FormControl(null),
      frequencyMax: new FormControl(null),
      signalStrengthMin: new FormControl(null),
      signalStrengthMax: new FormControl(null)
    });
  }

  private loadFilterOptions(): void {
    const uniqueValues = this.signalDataService.getUniqueValues();
    this.availableModes = uniqueValues.modes;
    this.availableBands = uniqueValues.bands;
    this.availableCountries = uniqueValues.countries;
    this.availableCallSigns = uniqueValues.callSigns;
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    
    const filters: SignalFilters = {
      modes: formValue.modes || [],
      bands: formValue.bands || [],
      countries: formValue.countries || [],
      callSigns: formValue.callSigns || [],
      dateTimeFilter: {
        startDate: formValue.startDate,
        startTime: formValue.startTime || '',
        endDate: formValue.endDate,
        endTime: formValue.endTime || ''
      },
      frequencyRange: {
        min: formValue.frequencyMin,
        max: formValue.frequencyMax
      },
      signalStrengthRange: {
        min: formValue.signalStrengthMin,
        max: formValue.signalStrengthMax
      }
    };

    this.filtersChanged.emit(filters);
  }

  clearFilters(): void {
    this.filterForm.reset();
    const emptyFilters = this.filterService.getEmptyFilters();
    this.filtersChanged.emit(emptyFilters);
  }

  removeSelectedItem(controlName: string, item: string): void {
    const control = this.filterForm.get(controlName);
    if (control) {
      const currentValue = control.value || [];
      const newValue = currentValue.filter((value: string) => value !== item);
      control.setValue(newValue);
    }
  }

  // Helper method to format time input as user types
  onTimeInput(event: any, controlName: string): void {
    let value = event.target.value.replace(/[^\d]/g, ''); // Remove non-digits
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + ':' + value.substring(2);
    }
    if (value.length >= 6) {
      value = value.substring(0, 5) + ':' + value.substring(5, 7);
    }
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    const control = this.filterForm.get(controlName);
    if (control) {
      control.setValue(value);
    }
  }

  // Validate time format on blur
  onTimeBlur(controlName: string): void {
    const control = this.filterForm.get(controlName);
    if (control && control.value) {
      const value = control.value;
      const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
      
      if (!timePattern.test(value)) {
        control.setErrors({ pattern: true });
      } else {
        // Normalize the time format (add leading zeros if needed)
        const parts = value.split(':');
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        const seconds = parts[2] ? parts[2].padStart(2, '0') : '00';
        
        const normalizedTime = `${hours}:${minutes}:${seconds}`;
        control.setValue(normalizedTime);
      }
    }
  }
}
