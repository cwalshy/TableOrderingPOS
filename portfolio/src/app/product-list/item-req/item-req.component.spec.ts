import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemReqComponent } from './item-req.component';

describe('ItemReqComponent', () => {
  let component: ItemReqComponent;
  let fixture: ComponentFixture<ItemReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
