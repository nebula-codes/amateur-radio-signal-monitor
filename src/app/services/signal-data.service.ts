import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { SignalData } from '../models/signal-data.interface';

@Injectable({
  providedIn: 'root'
})
export class SignalDataService {
  private readonly callSigns = [
    'W1ABC', 'K2DEF', 'VE3GHI', 'JA1JKL', 'G0MNO', 'DL1PQR', 'VK2STU', 'W0VWX',
    'K5YZA', 'VE7BCD', 'JA7EFG', 'G3HIJ', 'DL9KLM', 'VK4NOP', 'W2QRS', 'K8TUV',
    'VE9WXY', 'JA3ZAB', 'G8CDE', 'DL4FGH', 'VK7IJK', 'W4LMN', 'K0OPQ', 'VE1RST'
  ];

  private readonly modes = [
    'SSB', 'CW', 'FM', 'AM', 'FT8', 'FT4', 'PSK31', 'RTTY', 'JT65', 'MFSK',
    'OLIVIA', 'CONTESTIA', 'HELL', 'THOR', 'PACKET', 'APRS'
  ];

  private readonly bands = [
    '160m', '80m', '40m', '30m', '20m', '17m', '15m', '12m', '10m', '6m', '2m', '70cm'
  ];

  private readonly countries = [
    'USA', 'Canada', 'Japan', 'United Kingdom', 'Germany', 'Australia', 'France',
    'Italy', 'Spain', 'Brazil', 'Argentina', 'Sweden', 'Norway', 'Denmark', 'Finland'
  ];

  private readonly gridSquares = [
    'FN20', 'DM79', 'EM12', 'CN87', 'FN31', 'DM43', 'EM25', 'CN98', 'FN42', 'DM13',
    'EM34', 'CN76', 'FN53', 'DM25', 'EM45', 'CN65', 'FN64', 'DM37', 'EM56', 'CN54'
  ];

  private readonly frequencyRanges: { [key: string]: [number, number] } = {
    '160m': [1.8, 2.0],
    '80m': [3.5, 4.0],
    '40m': [7.0, 7.3],
    '30m': [10.1, 10.15],
    '20m': [14.0, 14.35],
    '17m': [18.068, 18.168],
    '15m': [21.0, 21.45],
    '12m': [24.89, 24.99],
    '10m': [28.0, 29.7],
    '6m': [50.0, 54.0],
    '2m': [144.0, 148.0],
    '70cm': [420.0, 450.0]
  };

  private mockData: SignalData[] = [];

  constructor() {
    this.generateMockData(500); // Generate 500 mock signals
  }

  private generateMockData(count: number): void {
    this.mockData = [];
    
    for (let i = 1; i <= count; i++) {
      const band = this.getRandomItem(this.bands);
      const frequency = this.getRandomFrequency(band);
      
      const signal: SignalData = {
        id: i,
        callSign: this.getRandomItem(this.callSigns),
        frequency: frequency,
        mode: this.getRandomItem(this.modes),
        band: band,
        signalStrength: this.getRandomNumber(-120, 0),
        timestamp: this.getRandomDate(),
        location: this.getRandomItem(this.gridSquares),
        country: this.getRandomItem(this.countries),
        power: this.getRandomNumber(1, 1500),
        notes: Math.random() > 0.7 ? this.generateRandomNote() : undefined
      };
      
      this.mockData.push(signal);
    }
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }

  private getRandomFrequency(band: string): number {
    const range = this.frequencyRanges[band];
    if (range) {
      return this.getRandomNumber(range[0], range[1]);
    }
    return this.getRandomNumber(14.0, 14.35); // Default to 20m
  }

  private getRandomDate(): Date {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
    return new Date(randomTime);
  }

  private generateRandomNote(): string {
    const notes = [
      'Strong signal',
      'Weak copy',
      'QRM present',
      'Contest station',
      'DX expedition',
      'Clear copy',
      'Fading signal',
      'Good contact'
    ];
    return this.getRandomItem(notes);
  }

  getSignals(): Observable<SignalData[]> {
    // Simulate API delay
    return of([...this.mockData]).pipe(delay(500));
  }

  getSignalById(id: number): Observable<SignalData | undefined> {
    const signal = this.mockData.find(s => s.id === id);
    return of(signal).pipe(delay(200));
  }

  getUniqueValues(): {
    modes: string[];
    bands: string[];
    countries: string[];
    callSigns: string[];
  } {
    const modes = [...new Set(this.mockData.map(s => s.mode))].sort();
    const bands = [...new Set(this.mockData.map(s => s.band))].sort();
    const countries = [...new Set(this.mockData.map(s => s.country))].sort();
    const callSigns = [...new Set(this.mockData.map(s => s.callSign))].sort();

    return { modes, bands, countries, callSigns };
  }

  // Simulate error for testing error handling
  getSignalsWithError(): Observable<SignalData[]> {
    return throwError(() => new Error('Simulated network error'));
  }
}
