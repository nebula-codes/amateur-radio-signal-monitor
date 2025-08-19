import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { SignalData } from '../../models/signal-data.interface';

@Component({
  selector: 'app-signal-detail-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: './signal-detail-modal.html',
  styleUrl: './signal-detail-modal.css'
})
export class SignalDetailModal {
  constructor(
    public dialogRef: MatDialogRef<SignalDetailModal>,
    @Inject(MAT_DIALOG_DATA) public signal: SignalData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  formatTimestamp(timestamp: Date): string {
    return new Date(timestamp).toLocaleString();
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

  formatCoordinates(lat: number, lng: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
  }
}
