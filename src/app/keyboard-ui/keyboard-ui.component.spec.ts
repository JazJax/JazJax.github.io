import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardUIComponent } from './keyboard-ui.component';

describe('KeyboardUIComponent', () => {
  let component: KeyboardUIComponent;
  let fixture: ComponentFixture<KeyboardUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyboardUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
