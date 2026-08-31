import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarImagen } from './agregar-imagen';

describe('AgregarImagen', () => {
  let component: AgregarImagen;
  let fixture: ComponentFixture<AgregarImagen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarImagen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarImagen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
