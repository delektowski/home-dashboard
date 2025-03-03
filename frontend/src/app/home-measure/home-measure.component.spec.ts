import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMeasureComponent } from './home-measure.component';

describe('HomeMeasureComponent', () => {
  let component: HomeMeasureComponent;
  let fixture: ComponentFixture<HomeMeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeMeasureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
