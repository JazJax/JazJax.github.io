import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordleGameComponent } from './wordle-game.component';

describe('WordleGameComponent', () => {
  let component: WordleGameComponent;
  let fixture: ComponentFixture<WordleGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordleGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordleGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
