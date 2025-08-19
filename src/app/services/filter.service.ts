import { Injectable } from '@angular/core';
import { SignalData, SignalFilters } from '../models/signal-data.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  applyFilters(signals: SignalData[], filters: SignalFilters): SignalData[] {
    return signals.filter(signal => {
      // Mode filter
      if (filters.modes.length > 0 && !filters.modes.includes(signal.mode)) {
        return false;
      }

      // Band filter
      if (filters.bands.length > 0 && !filters.bands.includes(signal.band)) {
        return false;
      }

      // Country filter
      if (filters.countries.length > 0 && !filters.countries.includes(signal.country)) {
        return false;
      }

      // Call sign filter
      if (filters.callSigns.length > 0 && !filters.callSigns.includes(signal.callSign)) {
        return false;
      }

      // Frequency range filter
      if (filters.frequencyRange.min !== null && signal.frequency < filters.frequencyRange.min) {
        return false;
      }
      if (filters.frequencyRange.max !== null && signal.frequency > filters.frequencyRange.max) {
        return false;
      }

      // Signal strength range filter
      if (filters.signalStrengthRange.min !== null && signal.signalStrength < filters.signalStrengthRange.min) {
        return false;
      }
      if (filters.signalStrengthRange.max !== null && signal.signalStrength > filters.signalStrengthRange.max) {
        return false;
      }

      // Date/time filter
      if (this.shouldFilterByDateTime(signal, filters.dateTimeFilter)) {
        return false;
      }

      return true;
    });
  }

  private shouldFilterByDateTime(signal: SignalData, dateTimeFilter: any): boolean {
    const signalTime = new Date(signal.timestamp);
    
    const startDateTime = this.combineDateTime(dateTimeFilter.startDate, dateTimeFilter.startTime);
    const endDateTime = this.combineDateTime(dateTimeFilter.endDate, dateTimeFilter.endTime);

    if (startDateTime && signalTime < startDateTime) {
      return true;
    }

    if (endDateTime && signalTime > endDateTime) {
      return true;
    }

    return false;
  }

  private combineDateTime(date: Date | null, time: string): Date | null {
    if (!date || !time) return null;
    
    const timeParts = time.split(':').map(Number);
    const hours = timeParts[0] || 0;
    const minutes = timeParts[1] || 0;
    const seconds = timeParts[2] || 0;
    
    const combined = new Date(date);
    combined.setHours(hours, minutes, seconds, 0);
    return combined;
  }

  getEmptyFilters(): SignalFilters {
    return {
      modes: [],
      bands: [],
      countries: [],
      callSigns: [],
      dateTimeFilter: {
        startDate: null,
        startTime: '',
        endDate: null,
        endTime: ''
      },
      frequencyRange: {
        min: null,
        max: null
      },
      signalStrengthRange: {
        min: null,
        max: null
      }
    };
  }
}
