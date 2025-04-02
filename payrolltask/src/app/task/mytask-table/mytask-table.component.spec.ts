import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MytaskTableComponent } from './mytask-table.component';

describe('MytaskTableComponent', () => {
  let component: MytaskTableComponent;
  let fixture: ComponentFixture<MytaskTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MytaskTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MytaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
