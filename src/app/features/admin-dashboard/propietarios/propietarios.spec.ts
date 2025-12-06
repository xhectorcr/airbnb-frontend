import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Propietarios } from './propietarios';

describe('Propietarios', () => {
  let component: Propietarios;
  let fixture: ComponentFixture<Propietarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Propietarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Propietarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
