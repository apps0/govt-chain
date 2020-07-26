import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuotationsComponent } from './view-quotations.component';

describe('ViewQuotationsComponent', () => {
  let component: ViewQuotationsComponent;
  let fixture: ComponentFixture<ViewQuotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQuotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
