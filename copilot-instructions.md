# Copilot Instructions for Amateur Radio App

## Project Standards

This project follows Angular best practices with proper error handling, type safety, and Material Design principles. All development should adhere to these standards:

- **Error Handling**: Implement comprehensive error handling using try-catch blocks, RxJS error operators, and proper error messaging to users
- **Type Safety**: Use TypeScript strictly with proper type definitions and interfaces
- **Code Quality**: Follow Angular style guide and maintain clean, readable code
- **Material Design**: Use Angular Material components consistently throughout the application
- **Theme**: Use the built-in cyan & orange Material Design theme (`@angular/material/prebuilt-themes/cyan-orange.css`)

## Project Setup

1. **Prerequisites**
   Ensure you have the following installed:
   - Node.js (v16 or higher)
   - npm or yarn
   - Angular CLI: `npm install -g @angular/cli`

2. **Create New Angular Project** (if starting fresh)
   ```
   ng new amateur-radio-app --routing --style=css
   cd amateur-radio-app
   ```

3. **Add Angular Material**
   Install and configure Angular Material:
   ```
   ng add @angular/material
   ```
   When prompted for theme selection, choose **"Custom"** or manually configure to use the cyan-orange theme.

4. **Configure Cyan-Orange Theme**
   In your `angular.json` file, ensure the cyan-orange theme is included:
   ```json
   "styles": [
     "src/custom-theme.scss",
     "src/styles.css"
   ]
   ```

5. **Clone Existing Repository** (if project exists)
   ```
   git clone <repository-url>
   cd amateur-radio-app
   ```

6. **Install Dependencies**
   ```
   npm install
   ```

## Data Structure & Backend Simulation

For development purposes, the application will use randomly generated objects that simulate pulling from a PostgreSQL database. The data will be amateur radio signal-related with the following structure:

### Signal Data Model
```typescript
interface SignalData {
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
```

### Dummy Data Examples
The randomly generated data should include realistic amateur radio values such as:
- **Call Signs**: W1ABC, K2DEF, VE3GHI, JA1JKL, G0MNO, etc.
- **Frequencies**: 3.500-4.000 (80m), 7.000-7.300 (40m), 14.000-14.350 (20m), 21.000-21.450 (15m), 28.000-29.700 (10m), 144.000-148.000 (2m), 420.000-450.000 (70cm)
- **Modes**: SSB, CW, FM, AM, FT8, FT4, PSK31, RTTY, JT65, MFSK
- **Bands**: 160m, 80m, 40m, 30m, 20m, 17m, 15m, 12m, 10m, 6m, 2m, 70cm
- **Grid Squares**: FN20, DM79, EM12, etc.
- **Countries**: USA, Canada, Japan, United Kingdom, Germany, Australia, etc.

## Development Standards

1. **Creating Components**
   Always use Angular CLI to generate components:
   ```
   ng generate component components/component-name
   ng g c components/component-name --standalone  # for standalone components
   ```

2. **Creating Services**
   ```
   ng generate service services/service-name
   ng g s services/service-name
   ```

3. **Creating Modules**
   ```
   ng generate module modules/module-name --routing
   ng g m modules/module-name --routing
   ```

4. **Error Handling Implementation**
   - Use Angular's global error handler
   - Implement proper HTTP error handling with interceptors
   - Display user-friendly error messages using Material snackbars
   - Log errors appropriately for debugging

5. **Material Components Usage**
   Reference the official Angular Material documentation: https://material.angular.dev/
   - Use Material components consistently
   - Follow Material Design principles
   - Implement proper accessibility features
   - Maintain the cyan & orange theme throughout the application

## Development Workflow

1. **Run the Application**
   Start the development server:
   ```
   ng serve
   ```
   Or with specific options:
   ```
   ng serve --open --port 4200
   ```

2. **Build for Production**
   ```
   ng build --prod
   ```

3. **Run Tests**
   ```
   ng test          # Unit tests
   ng e2e           # End-to-end tests
   ng lint          # Linting
   ```

4. **Access the Application**
   Open your web browser and navigate to `http://localhost:4200` to view the application.

## Code Quality Standards

1. **TypeScript Configuration**
   - Enable strict mode in `tsconfig.json`
   - Use proper type definitions for all variables and functions
   - Implement interfaces for data models

2. **Error Handling Patterns**
   ```typescript
   // HTTP Error Handling Example
   this.dataService.getData().pipe(
     catchError(error => {
       console.error('Error fetching data:', error);
       this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
       return throwError(error);
     })
   ).subscribe(data => {
     // Handle successful response
   });
   ```

3. **Component Structure**
   - Implement OnInit, OnDestroy lifecycle hooks properly
   - Use reactive forms with proper validation
   - Unsubscribe from observables to prevent memory leaks

## Theme Guidelines

- **Built-in Theme**: Use the cyan-orange prebuilt theme from Angular Material
- **Primary Color**: Cyan - automatically applied to primary Material components
- **Accent Color**: Orange - automatically applied to accent Material components
- **Consistency**: The prebuilt theme ensures automatic consistency across all Material components

## Usage Features

- **Filtering**: Use the sidebar with Material form controls to select filters for the data table. Multiple selections are allowed using Material chips and select components.
- **Date/Time Filtering**: Implement calendar pickers for start and end date/time selection to filter signals by timestamp range. Use Material datepicker with time input capabilities.
- **Searching**: Click the Material button to apply selected filters and refresh the data table with proper loading states.
- **Pagination**: Navigate through pages using Material paginator component.
- **Sorting**: Click on Material table headers to sort data with visual indicators.
- **Error States**: Proper error handling with Material snackbar notifications and error state displays.

## Material Components Integration

Key Material components to use:
- `mat-table` for data tables
- `mat-paginator` for pagination
- `mat-sort` for sorting
- `mat-form-field` for form inputs
- `mat-select` for dropdowns
- `mat-checkbox` for filters
- `mat-datepicker` for date selection
- `mat-timepicker` or custom time input for timestamp filtering
- `mat-button` for actions
- `mat-snack-bar` for notifications
- `mat-progress-spinner` for loading states

### Date/Time Filter Implementation

For the timestamp filtering functionality, implement the following:

1. **Date Range Picker Setup**
   ```typescript
   // In your filter component
   export interface DateTimeFilter {
     startDate: Date | null;
     startTime: string;
     endDate: Date | null;
     endTime: string;
   }

   // Form controls for date/time filtering
   startDateControl = new FormControl<Date | null>(null);
   startTimeControl = new FormControl('');
   endDateControl = new FormControl<Date | null>(null);
   endTimeControl = new FormControl('');
   ```

## Implementation Status

✅ **COMPLETED FEATURES:**

1. **Project Setup**
   - Angular project created with CSS styling and routing
   - Angular Material integrated with cyan-orange theme
   - TypeScript configured with strict mode

2. **Data Models & Services**
   - `SignalData` interface with all required fields
   - `SignalFilters` interface for filtering functionality
   - `SignalDataService` with mock data generation (500+ signals)
   - `FilterService` for applying complex filters

3. **Components Created**
   - `SignalTableComponent` - Material table with sorting, pagination
   - `FilterSidebarComponent` - Comprehensive filtering interface
   - Main app layout with Material toolbar and sidenav

4. **Features Implemented**
   - ✅ Data table with sorting and pagination
   - ✅ Multiple filter types (modes, bands, countries, call signs)
   - ✅ Date/time range filtering with calendar pickers (including seconds support)
   - ✅ Frequency and signal strength range filters
   - ✅ Material chips for selected filters
   - ✅ Responsive design
   - ✅ Error handling with snackbar notifications
   - ✅ Loading states with progress spinners

5. **Material Components Used**
   - mat-table, mat-paginator, mat-sort
   - mat-form-field, mat-select, mat-input
   - mat-datepicker, mat-chips
   - mat-toolbar, mat-sidenav
   - mat-button, mat-icon
   - mat-card, mat-progress-spinner
   - mat-snack-bar for notifications

6. **Application Structure**
   ```
   src/app/
   ├── components/
   │   ├── signal-table/
   │   └── filter-sidebar/
   ├── models/
   │   └── signal-data.interface.ts
   ├── services/
   │   ├── signal-data.service.ts
   │   └── filter.service.ts
   └── app.ts (main component)
   ```

## Additional Notes

- Follow the Angular Material theming guide for consistent styling with the cyan-orange prebuilt theme
- Implement proper accessibility features as per Material Design guidelines
- Use Material icons for consistent iconography
- Ensure responsive design using Angular Flex Layout or CSS Grid
- For any issues, refer to the README.md and Angular Material documentation