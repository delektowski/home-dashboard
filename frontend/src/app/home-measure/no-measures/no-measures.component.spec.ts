import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoMeasuresComponent } from './no-measures.component';

describe('NoMeasuresComponent', () => {
  let component: NoMeasuresComponent;
  let fixture: ComponentFixture<NoMeasuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoMeasuresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
