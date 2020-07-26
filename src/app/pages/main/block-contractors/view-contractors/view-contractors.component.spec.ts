import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractorsComponent } from './view-contractors.component';

describe('ViewContractorsComponent', () => {
  let component: ViewContractorsComponent;
  let fixture: ComponentFixture<ViewContractorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContractorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContractorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
