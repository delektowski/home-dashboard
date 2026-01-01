import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalToggleBtnComponent } from './global-toggle-btn.component';

describe('GlobalToggleBtnComponent', () => {
  let component: GlobalToggleBtnComponent;
  let fixture: ComponentFixture<GlobalToggleBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalToggleBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalToggleBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
