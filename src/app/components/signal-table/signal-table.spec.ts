import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalTable } from './signal-table';

describe('SignalTable', () => {
  let component: SignalTable;
  let fixture: ComponentFixture<SignalTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
