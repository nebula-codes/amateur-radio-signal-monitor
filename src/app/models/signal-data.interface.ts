export interface SignalData {
  id: number;
  callSign: string;          // Amateur radio call sign (e.g., "W1ABC", "K2DEF")
  frequency: number;         // Frequency in MHz (e.g., 14.205, 145.500)
  mode: string;             // Operating mode (e.g., "SSB", "CW", "FM", "FT8", "PSK31")
  band: string;             // Amateur radio band (e.g., "20m", "2m", "40m", "70cm")
  signalStrength: number;   // Signal strength in dB (-120 to 0)
  timestamp: Date;          // When the signal was received
  location: string;         // Geographic location (e.g., "Grid Square FN20")
  country: string;          // Country of origin
  power: number;            // Transmit power in watts (1-1500)
  notes?: string;           // Optional notes about the signal
}

export interface DateTimeFilter {
  startDate: Date | null;
  startTime: string;
  endDate: Date | null;
  endTime: string;
}

export interface ColumnConfig {
  key: keyof SignalData | 'actions';
  label: string;
  visible: boolean;
  type: 'string' | 'number' | 'date' | 'boolean' | 'actions';
  unit?: string;
}

export interface SignalFilters {
  modes: string[];
  bands: string[];
  countries: string[];
  callSigns: string[];
  dateTimeFilter: DateTimeFilter;
  frequencyRange: {
    min: number | null;
    max: number | null;
  };
  signalStrengthRange: {
    min: number | null;
    max: number | null;
  };
}
